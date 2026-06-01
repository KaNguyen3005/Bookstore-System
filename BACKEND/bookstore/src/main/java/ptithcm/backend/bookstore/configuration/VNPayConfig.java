package ptithcm.backend.bookstore.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Data
public class VNPayConfig {
    String tmnCode;
    String hashSecret;
    String url;
    String returnUrl;
}
