package ptithcm.backend.bookstore.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.GoogleLoginRequest;
import ptithcm.backend.bookstore.dto.response.AuthenticationResponse;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.enums.AuthProvider;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.UserRepository;
import ptithcm.backend.bookstore.utils.GoogleOAuthProperties;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GoogleAuthService {

    private final GoogleOAuthProperties googleOAuthProperties;
    private final UserRepository userRepository;
    AuthenticationService authenticationService;
    public AuthenticationResponse loginWithGoogle(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleOAuthProperties.getClientId()))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());

            if (idToken == null) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String googleSub = payload.getSubject(); // provider id
            String email = payload.getEmail();
            boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());
            String fullName = (String) payload.get("name");
            String avatarUrl = (String) payload.get("picture");

            if (!emailVerified) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            User user = userRepository.findByProviderId(googleSub)
                    .orElseGet(() -> userRepository.findByEmail(email)
                            .map(existingUser -> {
                                existingUser.setProviderId(googleSub);
                                existingUser.setAuthProvider(AuthProvider.GOOGLE.name());
                                existingUser.setEmailVerified(true);
                                if (existingUser.getName() == null || existingUser.getName().isBlank()) {
                                    existingUser.setName(fullName);
                                }
                                return userRepository.save(existingUser);
                            })
                            .orElseGet(() -> {
                                User newUser = User.builder()
                                        .email(email)
                                        .name(fullName)
                                        .providerId(googleSub)
                                        .authProvider(AuthProvider.GOOGLE.name())
                                        .emailVerified(true)
                                        .build();
                                return userRepository.save(newUser);
                            }));

            String token = authenticationService.generateToken(user);

            return AuthenticationResponse.builder()
                    .token(token)
                    .authenticated(true)
                    .build();

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
