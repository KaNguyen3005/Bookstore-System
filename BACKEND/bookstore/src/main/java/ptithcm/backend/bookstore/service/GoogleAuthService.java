package ptithcm.backend.bookstore.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.GoogleLoginRequest;
import ptithcm.backend.bookstore.dto.response.AuthenticationResponse;
import ptithcm.backend.bookstore.entity.Cart;
import ptithcm.backend.bookstore.entity.Role;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.enums.AuthProvider;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.CartRepository;
import ptithcm.backend.bookstore.repository.RoleRepository;
import ptithcm.backend.bookstore.repository.UserRepository;
import ptithcm.backend.bookstore.utils.GoogleOAuthProperties;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GoogleAuthService {

    private final GoogleOAuthProperties googleOAuthProperties;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
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
                                existingUser.setRole(resolveCustomerRole(existingUser.getRole()));
                                if (existingUser.getName() == null || existingUser.getName().isBlank()) {
                                    existingUser.setName(fullName);
                                }
                                if (existingUser.getAvatarUrl() == null || existingUser.getAvatarUrl().isBlank()) {
                                    existingUser.setAvatarUrl(avatarUrl);
                                }
                                return userRepository.save(existingUser);
                            })
                            .orElseGet(() -> {
                                User newUser = User.builder()
                                        .email(email)
                                        .username(email)
                                        .name(fullName)
                                        .avatarUrl(avatarUrl)
                                        .role(resolveCustomerRole(null))
                                        .providerId(googleSub)
                                        .authProvider(AuthProvider.GOOGLE.name())
                                        .emailVerified(true)
                                        .build();
                                return userRepository.save(newUser);
                            }));

            user = normalizeGoogleUser(user, fullName, avatarUrl);
            ensureCart(user);

            String token = authenticationService.generateToken(user);

            SignedJWT signedJwt = authenticationService.verifyToken(token, false);

            Date expiryDate = signedJwt.getJWTClaimsSet().getExpirationTime();
            LocalDateTime expiredAt = LocalDateTime.ofInstant(expiryDate.toInstant(), java.time.ZoneId.systemDefault());
            return AuthenticationResponse.builder()
                    .token(token)
                    .authenticated(true)
                    .expiredAt(expiredAt)
                    .build();

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Google login failed", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private User normalizeGoogleUser(User user, String fullName, String avatarUrl) {
        boolean changed = false;

        if (user.getRole() == null) {
            user.setRole(resolveCustomerRole(null));
            changed = true;
        }

        if ((user.getName() == null || user.getName().isBlank()) && fullName != null && !fullName.isBlank()) {
            user.setName(fullName);
            changed = true;
        }

        if ((user.getAvatarUrl() == null || user.getAvatarUrl().isBlank()) && avatarUrl != null && !avatarUrl.isBlank()) {
            user.setAvatarUrl(avatarUrl);
            changed = true;
        }

        return changed ? userRepository.save(user) : user;
    }

    private Role resolveCustomerRole(Role currentRole) {
        if (currentRole != null) {
            return currentRole;
        }

        return roleRepository.findByRoleName(ptithcm.backend.bookstore.enums.Role.CUSTOMER.name())
                .orElseGet(() -> roleRepository.findByRoleName("USER")
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND)));
    }

    private void ensureCart(User user) {
        cartRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .user(user)
                        .build()));
    }
}
//SEO
