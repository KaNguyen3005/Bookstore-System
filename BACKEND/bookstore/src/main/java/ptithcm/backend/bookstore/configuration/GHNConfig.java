package ptithcm.backend.bookstore.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ghn")
@Data
public class GHNConfig {
    String token;
    String shopId;
    String clientId;
    String webhookUrl;
}
