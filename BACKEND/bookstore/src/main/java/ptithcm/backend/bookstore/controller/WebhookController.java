package ptithcm.backend.bookstore.controller;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.service.WebhookService;

import java.util.Map;



@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/webhooks")
public class WebhookController {

    WebhookService webhookService;

    @PostMapping("/ghn")
    ApiResponse<Void> handleGHNWebhook(@RequestBody Map<String, Object> payload) {
        log.info("GHN webhook payload: {}", payload);

        webhookService.handleGHNWebhook(payload);

        return ApiResponse.<Void>builder()
                .message("Webhook received successfully")
                .build();
    }
}
