package ptithcm.backend.bookstore.controller;

import com.nimbusds.jose.JOSEException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.request.*;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.AuthenticationResponse;
import ptithcm.backend.bookstore.dto.response.IntrospectResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.service.AuthenticationService;
import ptithcm.backend.bookstore.service.GoogleAuthService;
import ptithcm.backend.bookstore.service.OtpService;

import java.text.ParseException;

/*
* CheckList: Đã chạy đúng happy case
* */
@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "API xác thực người dùng - Đăng nhập, đăng ký, làm mới token, đặt lại mật khẩu")
public class AuthenticationController {
    AuthenticationService authenticationService;
    GoogleAuthService googleAuthService;
    OtpService otpService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập",
            description = "Xác thực người dùng bằng username/email và password. Trả về access token và refresh token.",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đăng nhập thành công",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Username hoặc password không hợp lệ"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Thông tin xác thực không đúng"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) throws ParseException, JOSEException {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/introspect")
    @Operation(summary = "Xác minh token",
            description = "Kiểm tra tính hợp lệ và hạn sử dụng của JWT token",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token hợp lệ",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = IntrospectResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Token không hợp lệ hoặc hết hạn"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất",
            description = "Đăng xuất khỏi hệ thống - vô hiệu hóa access token hiện tại",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đăng xuất thành công"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Token không hợp lệ"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logout successfully!")
                .build();
    }

    @PostMapping("/refresh")
    @Operation(summary = "Làm mới token",
            description = "Sử dụng refresh token để lấy access token mới khi token cũ sắp hết hạn",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Làm mới token thành công",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Refresh token không hợp lệ hoặc hết hạn"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/google")
    @Operation(summary = "Đăng nhập với Google",
            description = "Xác thực người dùng bằng Google OAuth2. Tự động tạo tài khoản nếu chưa tồn tại.",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đăng nhập Google thành công",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Token Google không hợp lệ"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ApiResponse<AuthenticationResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(googleAuthService.loginWithGoogle(request))
                .build();
    }

    @PostMapping("/register/init")
    @Operation(summary = "Xác nhận thông tin đăng ký ban đầu",
            description = "Kiểm tra tính hợp lệ của thông tin người dùng trước khi hoàn thành đăng ký. Gửi OTP nếu cần thiết.",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thông tin hợp lệ, có thể tiếp tục đăng ký",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Thông tin không hợp lệ hoặc tài khoản đã tồn tại"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ApiResponse<AuthenticationResponse> validateUserInfo(@RequestBody @Valid RegisterRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.validateUserInfo(request))
                .build();
    }


    @PostMapping("/register/complete")
    @Operation(summary = "Hoàn thành đăng ký tài khoản mới",
            description = "Tạo tài khoản người dùng mới sau khi xác nhận thông tin. Mật khẩu sẽ được mã hóa.",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đăng ký thành công",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Tài khoản hoặc email đã tồn tại"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ApiResponse<UserResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(authenticationService.register(request))
                .build();
    }

    @PostMapping("/reset-password/init")
    @Operation(summary = "Bước 1: Kiểm tra email tồn tại",
            description = "Kiểm tra xem email có tồn tại trong hệ thống không trước khi yêu cầu đặt lại mật khẩu.",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Email tồn tại, có thể tiếp tục process"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Email không hợp lệ"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Email không tồn tại"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ApiResponse<Void> sendResetPasswordOtp(@RequestBody @Valid ResetPasswordInitRequest request) {
        authenticationService.sendOtpToResetPassword(request);
        return ApiResponse.<Void>builder()
                .message("OTP sent to email !")
                .build();
    }

    @PostMapping("/reset-password/verify")
    @Operation(summary = "Bước 2: Xác minh mã OTP",
            description = "Xác minh mã OTP được gửi đến email người dùng để xác thực quyền sở hữu email.",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Mã OTP hợp lệ, có thể tiếp tục đặt lại mật khẩu"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Mã OTP không hợp lệ hoặc hết hạn"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ApiResponse<String> verifyOtp(@RequestBody @Valid VerifyOtpRequest request) {
        if(!otpService.verifyOtp(request.getEmail(), request.getOtp())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String resetToken = authenticationService.generateResetToken(request.getEmail());
        return ApiResponse.<String>builder()
                .result(resetToken)
                .build();
    }

    @PostMapping("/reset-password/complete")
    @Operation(summary = "Bước 3: Hoàn thành đặt lại mật khẩu",
            description = "Đặt lại mật khẩu mới sau khi xác minh email và OTP. Mật khẩu sẽ được mã hóa.",
            tags = "Authentication")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đặt lại mật khẩu thành công"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Mật khẩu không hợp lệ hoặc dữ liệu thiếu"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ApiResponse<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest request) throws ParseException, JOSEException {
        authenticationService.resetPassword(request);
        return ApiResponse.<Void>builder()
                .message("Password reset successful")
                .build();
    }

    @PostMapping("/me/reset-password/init")
    @Operation(summary = "Gửi OTP đổi mật khẩu cho tài khoản hiện tại",
            description = "Gửi OTP đến email của người dùng đang đăng nhập. Client không được tự truyền email.",
            tags = "Authentication")
    public ApiResponse<Void> sendCurrentUserResetPasswordOtp() {
        authenticationService.sendOtpToCurrentUserResetPassword();
        return ApiResponse.<Void>builder()
                .message("OTP sent to current user's email")
                .build();
    }

    @PostMapping("/me/reset-password/verify")
    @Operation(summary = "Xác minh OTP đổi mật khẩu cho tài khoản hiện tại",
            description = "Xác minh OTP theo email của người dùng đang đăng nhập và trả về reset token.",
            tags = "Authentication")
    public ApiResponse<String> verifyCurrentUserResetPasswordOtp(@RequestBody @Valid VerifyCurrentUserOtpRequest request) {
        return ApiResponse.<String>builder()
                .result(authenticationService.verifyCurrentUserResetPasswordOtp(request))
                .build();
    }

    @PostMapping("/me/reset-password/complete")
    @Operation(summary = "Hoàn tất đổi mật khẩu cho tài khoản hiện tại",
            description = "Đổi mật khẩu cho người dùng đang đăng nhập sau khi OTP hợp lệ.",
            tags = "Authentication")
    public ApiResponse<Void> resetCurrentUserPassword(@RequestBody @Valid ResetPasswordRequest request)
            throws ParseException, JOSEException {
        authenticationService.resetCurrentUserPassword(request);
        return ApiResponse.<Void>builder()
                .message("Password reset successful")
                .build();
    }
}
