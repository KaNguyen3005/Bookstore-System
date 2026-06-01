package ptithcm.backend.bookstore;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ptithcm.backend.bookstore.service.DashboardService;

@SpringBootTest
class DashboardServiceTests {
    @Autowired
    DashboardService dashboardService;

    @Test
    void getOverviewLoadsDashboardData() {
        dashboardService.getOverview("today", 10, 5);
    }
}
