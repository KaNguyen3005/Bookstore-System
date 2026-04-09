package ptithcm.backend.bookstore.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    CustomJwtDecoder customJwtDecoder;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults());

        http.csrf(csrf -> csrf.disable()) // Tắt CSRF để gọi POST/PUT được
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/users/me").authenticated()
                        .requestMatchers("/api/v1/addresses").authenticated()
                        .requestMatchers("/api/v1/orders").authenticated()
                        .anyRequest().permitAll()); // Cho phép tất cả
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