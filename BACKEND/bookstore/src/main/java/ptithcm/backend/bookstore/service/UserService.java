package ptithcm.backend.bookstore.service;


import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.*;
import ptithcm.backend.bookstore.dto.response.UploadResult;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.*;
import ptithcm.backend.bookstore.enums.Tier;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.UserMapper;
import ptithcm.backend.bookstore.repository.BookRepository;
import ptithcm.backend.bookstore.repository.RoleRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

import java.time.LocalDateTime;
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class UserService {
    BookRepository bookRepository;
    RoleRepository roleRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    CloudinaryService cloudinaryService;
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) throw new AppException(ErrorCode.USER_ALREADY_EXISTS);

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        user.setRole(role);

        return userMapper.toResponse(userRepository.save(user));
    }

    public Page<UserResponse> getAll(int page, int size){
        Pageable pageable = buildUserPageable(page, size);
        return userRepository.findByDeletedAtIsNull(pageable)
                .map(userMapper::toResponse);
    }

    private Pageable buildUserPageable(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional
    public UserResponse update(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            if (!request.getUsername().equals(user.getUsername()) && userRepository.existsByUsernameAndUserIdNot(request.getUsername(), userId)) {
                throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(user.getEmail()) && userRepository.existsByEmailAndUserIdNot(request.getEmail(), userId)) {
                throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (!request.getPhone().equals(user.getPhone()) && userRepository.existsByPhoneAndUserIdNot(request.getPhone(), userId)) {
                throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
            }
            user.setPhone(request.getPhone());
        }

        if (request.getGender() != null && !request.getGender().isBlank()) {
            user.setGender(request.getGender());
        }

        if (request.getIsChangeAccount() != null) {
            user.setIsChangeAccount(request.getIsChangeAccount());
        }

        if (request.getPoint() != null) {
            user.setPoint(request.getPoint());
        }

        if (request.getDob() != null) {
            LocalDateTime dob = LocalDateTime.parse(request.getDob());
            user.setDob(dob);
        }

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            user.setRole(role);
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public void disableUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new AppException(ErrorCode.USER_ALREADY_DELETED);
        }

        user.setStatus(false);
    }

    @Transactional
    public void delete(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getDeletedAt() != null) {
            throw new AppException(ErrorCode.USER_ALREADY_DELETED);
        }

        user.setDeletedAt(LocalDateTime.now());
    }

    @Transactional
    public UserResponse changeStatusAccount(Long id, ChangeStatusAccountRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setStatus(request.getStatus());
        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    public UserResponse getMyInfo(){
        // Lấy thông tin User hiện tại từ bộ nhớ của Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }


        // Thường là username hoặc UserDetails object
        Long userId = Long.parseLong(authentication.getName());

        // Bạn có thể dùng username này gọi xuống Database để lấy đầy đủ Object User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toResponse(user);
    }

    public UserResponse getMyInfoOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            return null;
        }

        try {
            Long userId = Long.parseLong(authentication.getName());

            return userRepository.findById(userId)
                    .map(userMapper::toResponse)
                    .orElse(null);

        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Transactional
    public UserResponse updateMyInfo(UpdateMyInfoRequest request) {
        UserResponse userResponse = getMyInfo();
        Long userId = userResponse.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        try {

            if (request.getName() != null && !request.getName().isBlank()) {
                user.setName(request.getName());
            }

            if (request.getPhone() != null && !request.getPhone().isBlank()) {
                if (!request.getPhone().equals(user.getPhone()) && userRepository.existsByPhoneAndUserIdNot(request.getPhone(), userId)) {
                    throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
                }
                user.setPhone(request.getPhone());
            }

            if (request.getGender() != null && !request.getGender().isBlank()) {
                user.setGender(request.getGender());
            }

            if (request.getDob() != null && !request.getDob().isBlank()) {
                LocalDateTime dob = LocalDateTime.parse(request.getDob());
                user.setDob(dob);
            }

            if(request.getUsername() != null && !request.getUsername().isBlank()) {

                if (!request.getUsername().equals(user.getUsername()) && userRepository.existsByUsernameAndUserIdNot(request.getUsername(), userId)) {
                    throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
                }
                if(user.getIsChangeAccount()) {
                    throw new AppException(ErrorCode.USERNAME_CHANGE_LIMITED);
                }
                user.setUsername(request.getUsername());
                user.setIsChangeAccount(true);
            }

            User savedUser = userRepository.save(user);

            return userMapper.toResponse(savedUser);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật thông tin người dùng: {}", e.getMessage(), e);

            throw new AppException(ErrorCode.UPDATE_USER_FAILED);
        }
    }

    // Review functionality removed - Review entity no longer exists
    // This method has been deprecated

    @Transactional
    public UserResponse uploadAvatar(UploadAvatarRequest request) {
        UserResponse userResponse = getMyInfo();
        Long userId = userResponse.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String oldAvatarPublicId = user.getPublicIdAvatar();
        String newAvatarPublicId = null;

        try {
            UploadResult uploadResult = cloudinaryService.uploadFile(request.getAvatar(), "avatars");
            newAvatarPublicId = uploadResult.getPublicId();

            user.setAvatarUrl(uploadResult.getUrl());
            user.setPublicIdAvatar(uploadResult.getPublicId());
            User savedUser = userRepository.save(user);

            // Xóa avatar cũ nếu có
            if (oldAvatarPublicId != null && !oldAvatarPublicId.isBlank()) {
                try {
                    cloudinaryService.deleteFile(oldAvatarPublicId);
                } catch (Exception e) {
                    log.warn("Không thể xóa avatar cũ trên Cloudinary. Public ID: {}", oldAvatarPublicId, e);
                }
            }

            return userMapper.toResponse(savedUser);
        } catch (AppException e) {
            rollbackNewAvatar(newAvatarPublicId);
            throw e;
        } catch (Exception e) {
            rollbackNewAvatar(newAvatarPublicId);
            throw new AppException(ErrorCode.UPDATE_USER_FAILED);
        }
    }

    // Tách hàm rollback ra để tránh lặp code (DRY principle)
    private void rollbackNewAvatar(String newAvatarPublicId) {
        if (newAvatarPublicId != null) {
            try {
                cloudinaryService.deleteFile(newAvatarPublicId);
            } catch (Exception ex) {
                log.warn("Không thể xóa avatar mới tải lên (rollback) sau khi xử lý thất bại. Public ID: {}", newAvatarPublicId, ex);
            }
        }
    }

    public void pointToTier(User user) {
        Long point = user.getPoint();
        if(point >= 10000) {
            user.setTier(Tier.PLATINUM.name());
        }
        else if (point >= 5000) {
            user.setTier(Tier.GOLD.name());
        } else if (point >= 1000) {
            user.setTier(Tier.SILVER.name());
        } else {
            user.setTier(Tier.BRONZE.name());
        }
    }
}
