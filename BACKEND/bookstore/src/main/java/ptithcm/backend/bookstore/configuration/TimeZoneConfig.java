package ptithcm.backend.bookstore.configuration;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

@Configuration
public class TimeZoneConfig {
    private static final String APP_TIME_ZONE = "Asia/Ho_Chi_Minh";

    @PostConstruct
    void setDefaultTimeZone() {
        TimeZone.setDefault(TimeZone.getTimeZone(APP_TIME_ZONE));
    }
}
