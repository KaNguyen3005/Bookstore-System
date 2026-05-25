package ptithcm.backend.bookstore.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "resend")
public class ResendEmailProperties {
    private String apiUrl = "https://api.resend.com";
    private String apiKey;
    private String fromEmail;
    private String fromName = "KATIIA Bookstore";
}
