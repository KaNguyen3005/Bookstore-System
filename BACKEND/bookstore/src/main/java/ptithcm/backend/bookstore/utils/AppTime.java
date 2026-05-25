package ptithcm.backend.bookstore.utils;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

public final class AppTime {
    public static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    public static final Clock VIETNAM_CLOCK = Clock.system(VIETNAM_ZONE);

    private AppTime() {
    }

    public static LocalDate today() {
        return LocalDate.now(VIETNAM_CLOCK);
    }

    public static LocalDateTime now() {
        return LocalDateTime.now(VIETNAM_CLOCK);
    }
}
