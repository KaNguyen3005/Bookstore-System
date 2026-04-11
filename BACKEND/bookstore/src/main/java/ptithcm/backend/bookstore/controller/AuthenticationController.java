package ptithcm.backend.bookstore.controller;

import com.nimbusds.jose.JOSEException;
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
import ptithcm.backend.bookstore.service.AuthenticationService;
import ptithcm.backend.bookstore.service.GoogleAuthService;
import ptithcm.backend.bookstore.service.OtpService;

import java.text.ParseException;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    GoogleAuthService googleAuthService;
    OtpService otpService;
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) throws ParseException, JOSEException {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/google")
    public ApiResponse<AuthenticationResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(googleAuthService.loginWithGoogle(request))
                .build();
    }

    @PostMapping("/register/init")
    public ApiResponse<AuthenticationResponse> validateUserInfo(@RequestBody RegisterRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.validateUserInfo(request))
                .build();
    }


    @PostMapping("/register/complete")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(authenticationService.register(request))
                .build();
    }

    @PostMapping("/reset-password/init")
    public ApiResponse<Boolean> isExistingEmail(@RequestBody ResetPasswordRequest request) {
        return ApiResponse.<Boolean>builder()
                .result(authenticationService.isExistingEmail(request.getEmail()))
                .build();
    }

    @PostMapping("/reset-password/verify")
    public ApiResponse<Boolean> verifyOtp(@RequestBody ResetPasswordRequest request) {
        return ApiResponse.<Boolean>builder()
                .result(otpService.verifyOtp(request.getEmail(), request.getOtp()))
                .build();
    }

    @PostMapping("/reset-password/complete")
    public ApiResponse<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ApiResponse.<Void>builder()
                .message("Password reset successful")
                .build();
        }
}