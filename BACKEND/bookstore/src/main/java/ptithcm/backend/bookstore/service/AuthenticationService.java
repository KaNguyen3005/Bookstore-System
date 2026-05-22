package ptithcm.backend.bookstore.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import ptithcm.backend.bookstore.dto.request.*;
import ptithcm.backend.bookstore.dto.response.AuthenticationResponse;
import ptithcm.backend.bookstore.dto.response.IntrospectResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.InvalidatedToken;
import ptithcm.backend.bookstore.entity.Role;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.UserMapper;
import ptithcm.backend.bookstore.repository.InvalidatedTokenRepository;
import ptithcm.backend.bookstore.repository.RoleRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    private final RoleRepository roleRepository;

    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    OtpService otpService;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    // Cho phép field này không bị đánh dấu final
    // (vì Lombok @FieldDefaults có thể đặt mặc định là final)

    @Value("${jwt.valid-duration}")
    // Inject giá trị từ file cấu hình (application.yml / application.properties)
    // Ví dụ: jwt.valid-duration=3600 (giây)

    protected long VALID_DURATION;
    // Thời gian sống của JWT (access token)
    // Sau khoảng thời gian này token sẽ hết hạn

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    // Hàm dùng để introspect JWT token
    // Mục đích: kiểm tra token có hợp lệ hay không (đúng chữ ký, chưa hết hạn, chưa bị logout...)
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {

        // Lấy JWT token từ request gửi lên
        // Thường token này được client gửi khi cần kiểm tra trạng thái đăng nhập
        var token = request.getToken();

        // Xác thực token
        // Bên trong verifyToken thường sẽ:
        // - Verify chữ ký JWT
        // - Kiểm tra token hết hạn (exp)
        // - Kiểm tra token có nằm trong blacklist hay không
        // Nếu token không hợp lệ → method này sẽ throw exception
        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        // Nếu chạy được tới đây nghĩa là token hợp lệ
        // Trả về response với valid = true
        return IntrospectResponse.builder().valid(isValid).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws ParseException, JOSEException {
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);
        ensureUserActive(user);

        var token = generateToken(user);
        SignedJWT signedJWT = verifyToken(token, false);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        LocalDateTime expiresAt = LocalDateTime.ofInstant(expiryTime.toInstant(), java.time.ZoneId.systemDefault());

        return AuthenticationResponse.builder().token(token).authenticated(true).expiredAt(expiresAt).build();
    }

    public String generateResetToken(String email){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(email)
                .issuer("kaakaa.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(15, ChronoUnit.MINUTES).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Can not create reset token", e);
            throw new RuntimeException(e);
        }
    }

    public String generateToken(User user) {
        ensureUserActive(user);
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // Khởi tạo đối tượng JWTClaimsSet bằng Builder pattern
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()

                // Subject (sub): định danh chính của token, thường là username hoặc userId
                .subject(user.getUserId().toString())

                // Issuer (iss): đơn vị phát hành token
                .issuer("kaakaa.com")

                // Issue Time (iat): thời điểm token được tạo
                .issueTime(new Date())

                // Expiration Time (exp): thời điểm token hết hạn
                // Ở đây token sẽ hết hạn sau thời gian ược config kể từ thời điểm hiện tại
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))

                // JWT ID (jti): định danh duy nhất của token
                // Thường dùng để kiểm soát token (ví dụ: blacklist, logout)
                // Tạo một UUID (Universally Unique Identifier) ngẫu nhiên
                // UUID này có xác suất trùng lặp cực kỳ thấp
                // toString() chuyển UUID thành chuỗi theo định dạng chuẩn: 8-4-4-4-12
                // Ví dụ: "550e8400-e29b-41d4-a716-446655440000"
                .jwtID(UUID.randomUUID().toString())

                // Custom claim: scope
                // Lưu thông tin quyền hạn / role của user
                .claim("scope", buildScope(user))

                // Xây dựng đối tượng JWTClaimsSet
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Can not create token", e);
            throw new RuntimeException(e);
        }
    }

    // Hàm dùng để build chuỗi scope (authorities) đưa vào JWT token
    // Scope này sẽ chứa ROLE và PERMISSION của user
    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        // Lấy role duy nhất của user
        Role role = user.getRole();

        if (role != null) {
            // Thêm ROLE_
            stringJoiner.add("ROLE_" + role.getRoleName());

            // Thêm permissions nếu có
            if (!CollectionUtils.isEmpty(role.getPermissions())) {
                role.getPermissions()
                        .forEach(permission -> stringJoiner.add(permission.getPermissionName()));
            }
        }

        return stringJoiner.toString();
    }

    // Hàm xử lý logout
    // Mục đích: vô hiệu hóa JWT hiện tại bằng cách lưu token vào blacklist
    // Sau khi logout, token này sẽ không còn sử dụng được dù chưa hết hạn
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        if(request.getToken() == null) throw new AppException(ErrorCode.TOKEN_NOT_PROVIDED);
        // Verify JWT token để đảm bảo:
        // - Token hợp lệ
        // - Chữ ký đúng
        // - Token chưa hết hạn
        // Nếu không hợp lệ → exception được throw ra
        try {
            var signedToken = verifyToken(request.getToken(), false);

            // Lấy JWT ID (jti) từ token
            // jti là định danh duy nhất của mỗi JWT
            // Dùng để nhận diện token khi cần blacklist
            String jti = signedToken.getJWTClaimsSet().getJWTID();

            // Lấy thời gian hết hạn của token
            // Thời điểm này dùng để biết khi nào có thể xóa token khỏi blacklist
            Date expiryTime = signedToken.getJWTClaimsSet().getExpirationTime();

            // Tạo entity InvalidatedToken
            // Entity này đại diện cho một token đã bị logout (bị vô hiệu hóa)
            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    // Lưu jti làm khóa chính
                    .id(jti)
                    // Lưu thời gian hết hạn của token
                    .expiryTime(expiryTime)
                    .build();

            // Lưu token đã bị vô hiệu hóa vào database (hoặc Redis)
            // Mỗi request sau này sẽ kiểm tra:
            // - jti có tồn tại trong bảng invalidated_token hay không
            // Nếu có → từ chối truy cập
            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException e) {
            log.info("Token already exprired");
        }
    }

    // Hàm dùng để verify (xác thực) JWT token
    // Trả về SignedJWT nếu token hợp lệ
    // Nếu token không hợp lệ → throw exception
    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {

        // Tạo verifier để kiểm tra chữ ký JWT
        // MACVerifier dùng cho JWT ký bằng thuật toán HMAC (HS256, HS512, ...)
        // SIGNER_KEY là secret key dùng để ký và verify token
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        // Parse chuỗi token (String) thành đối tượng SignedJWT
        // Nếu token sai format → ParseException
        SignedJWT signedJWT = SignedJWT.parse(token);

        // Lấy thời gian hết hạn (exp) từ payload của JWT
        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        // Verify chữ ký của JWT
        // true  → chữ ký hợp lệ (token không bị chỉnh sửa)
        // false → chữ ký không hợp lệ
        boolean verified = signedJWT.verify(verifier);

        // Kiểm tra 2 điều kiện bắt buộc:
        // 1. Chữ ký hợp lệ (verified == true)
        // 2. Token chưa hết hạn (expiryTime sau thời điểm hiện tại)
        // Nếu 1 trong 2 điều kiện sai → token không hợp lệ
        if (!(verified && expiryTime.after(new Date())))
            // Ném exception xác thực thất bại
            // Thường sẽ map sang HTTP 401 Unauthorized
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        // Nếu token hợp lệ → trả về SignedJWT
        // Object này có thể dùng tiếp để:
        // - Lấy username (sub)
        // - Lấy scope / role / permission
        ensureTokenSubjectActive(signedJWT.getJWTClaimsSet().getSubject());
        return signedJWT;
    }

    private void ensureTokenSubjectActive(String subject) {
        if (subject == null || subject.isBlank()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        try {
            Long userId = Long.parseLong(subject);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
            ensureUserActive(user);
        } catch (NumberFormatException ignored) {
            // Reset-password tokens use email as subject, not user id.
        }
    }

    private void ensureUserActive(User user) {
        if (user == null || user.getDeletedAt() != null || !Boolean.TRUE.equals(user.getStatus())) {
            throw new AppException(ErrorCode.USER_INACTIVE);
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {

        // Xác thực refresh token gửi lên từ client.
        // Nếu token không hợp lệ, hết hạn hoặc đã bị vô hiệu hóa → verifyToken sẽ throw exception
        var signToken = verifyToken(request.getToken(), true);

        // Lấy JWT ID (jti) – định danh duy nhất của token
        var jti = signToken.getJWTClaimsSet().getJWTID();

        // Lấy thời gian hết hạn của token cũ
        var expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        // Tạo đối tượng InvalidatedToken để lưu token cũ vào blacklist
        // nhằm đảm bảo token này không thể được sử dụng lại
        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jti).expiryTime(expiryTime).build();

        // Lưu token cũ đã bị vô hiệu hóa vào database
        invalidatedTokenRepository.save(invalidatedToken);

        // Lấy username (subject) từ token cũ
        Long userId = signToken.getJWTClaimsSet().getSubject() != null
                ? Long.parseLong(signToken.getJWTClaimsSet().getSubject())
                : null;

        // Tìm thông tin user trong database
        // Nếu không tồn tại → báo lỗi UNAUTHENTICATED
        var user =
                userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        // Sinh token mới cho user
        var token = generateToken(user);
        SignedJWT signedJWT = verifyToken(token, false);

        Date expiryTimeOfToken = signedJWT.getJWTClaimsSet().getExpirationTime();
        LocalDateTime expiresAt = LocalDateTime.ofInstant(expiryTime.toInstant(), java.time.ZoneId.systemDefault());

        return AuthenticationResponse.builder().token(token).authenticated(true).expiredAt(expiresAt).build();
    }

    public AuthenticationResponse validateUserInfo(RegisterRequest request) {
        LocalDateTime expiredTime = otpService.sendOtp(request.getEmail());
        return AuthenticationResponse.builder()
                .authenticated(true)
                .expiredAt(expiredTime)
                .build();
    }

    public void sendOtpToResetPassword(ResetPasswordInitRequest request) {
        if (!isExistingEmail(request.getEmail())) throw new AppException(ErrorCode.USER_NOT_FOUND);
        otpService.sendOtp(request.getEmail());
    }

    private Boolean isExistingEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void resetPassword(ResetPasswordRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getResetToken(), false);
        String email = signedJWT.getJWTClaimsSet().getSubject();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName(ptithcm.backend.bookstore.enums.Role.CUSTOMER.name())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        user.setRole(role);

        return userMapper.toResponse(userRepository.save(user));
    }
}
