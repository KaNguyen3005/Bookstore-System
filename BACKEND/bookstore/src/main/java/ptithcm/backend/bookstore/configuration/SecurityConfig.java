package ptithcm.backend.bookstore.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    CustomJwtDecoder customJwtDecoder;

    // POST endpoints - không cần JWT
    private final String[] PUBLIC_POST_ENDPOINTS = {
            "/api/v1/auth/login",
            "/api/v1/auth/introspect",
            "/api/v1/auth/refresh",
            "/api/v1/auth/google",
            "/api/v1/auth/register/init",
            "/api/v1/auth/register/complete",
            "/api/v1/auth/reset-password/init",
            "/api/v1/auth/reset-password/verify",
            "/api/v1/auth/reset-password/complete",
            "/api/v1/otp/send",
            "/api/v1/otp/verify",
    };

    // GET endpoints - không cần JWT
    private final String[] PUBLIC_GET_ENDPOINTS = {
            // Books
            "/api/v1/books",
            "/api/v1/books/**",
            "/api/v1/books/search",

            // Authors
            "/api/v1/authors",
            "/api/v1/authors/**",

            // Publishers
            "/api/v1/publishers",
            "/api/v1/publishers/**",

            // Categories
            "/api/v1/categories",
            "/api/v1/categories/**",

            // Vouchers
            "/api/v1/vouchers",
            "/api/v1/vouchers/**",

            // Public book statistics
            "/api/v1/orders/top-selling-book",
            "/api/v1/orders/top-selling-books",

            // Recommendations
            "/api/v1/recommendations/**",

            // Payment
            "/api/v1/payments/callback",

            // GHN master-data (Address picker)
            "/api/v1/addresses/provinces",
            "/api/v1/addresses/districts/**",
            "/api/v1/addresses/wards/**"
    };

    // Static resources - không cần JWT
    private final String[] RESOURCE_ENDPOINTS = {
            "/imgs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults());
        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                .accessDeniedHandler(new JwtAccessDeniedHandler()));
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // POST endpoints - public
                        .requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
                        // GET endpoints - public
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                        // Static resources - public
                        .requestMatchers(HttpMethod.GET, RESOURCE_ENDPOINTS).permitAll()
                        // Tất cả các request khác phải có JWT
                        .anyRequest().authenticated());
        // Cấu hình application hoạt động như một OAuth2 Resource Server
        // Tức là server sẽ:
        // - Nhận JWT từ client
        // - Verify JWT
        // - Trích xuất thông tin user + quyền
        http.oauth2ResourceServer(oauth2 -> oauth2
                // Cấu hình xử lý JWT
                .jwt(jwtConfigurer -> jwtConfigurer
                        // Decoder dùng để verify và decode JWT
                        .decoder(customJwtDecoder)

                        // Converter dùng để convert JWT -> Authentication
                        // (trích xuất role, permission từ token)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                // Xử lý khi xác thực thất bại (401 Unauthorized)
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();

        // Liệt kê chi tiết các domain, tránh dùng "*" khi có allowCredentials(true)
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://localhost:3000"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true); // Cho phép gửi Cookie/Token qua Header
        configuration.setMaxAge(3600L); // Cache kết quả pre-flight trong 1 giờ

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {

        // Converter dùng để lấy authority từ claim trong JWT
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        // Mặc định Spring sẽ tự thêm prefix "ROLE_"
        // Ở đây set prefix = "" vì trong JWT đã có ROLE_ sẵn
        // Ví dụ: ROLE_ADMIN, USER_CREATE
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        // Converter chính để tạo Authentication từ JWT
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();

        // Gán converter authority vào JWT Authentication Converter
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }
}
