package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.response.RevenueResponse;
import ptithcm.backend.bookstore.service.OrderService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/reports")
public class ReportController {
    OrderService orderService;

    //TODO: Cần hiểu code này
    @GetMapping("/revenue")
    public List<RevenueResponse> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(name = "group_by", defaultValue = "day") String groupBy
    ) {
        return orderService.getRevenue(from, to, groupBy);
    }
}
