package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import ptithcm.backend.bookstore.configuration.ResendEmailProperties;

import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    ResendEmailProperties resendEmailProperties;

    public void sendOtpEmail(String toEmail, String otp) {
        sendOtpEmail(toEmail, otp, "Ma OTP xac thuc", "Xac thuc tai khoan");
    }

    public void sendOtpEmail(String toEmail, String otp, String subject, String title) {
        try {
            validateResendConfig();

            RestClient restClient = RestClient.builder()
                    .baseUrl(resendEmailProperties.getApiUrl())
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + resendEmailProperties.getApiKey())
                    .build();

            restClient.post()
                    .uri("/emails")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "from", buildFromAddress(),
                            "to", new String[]{toEmail},
                            "subject", subject,
                            "html", buildOtpHtml(otp, title)
                    ))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.error("Cannot send OTP email to {}", toEmail, e);
            throw new IllegalStateException("Cannot send OTP email", e);
        }
    }

    private void validateResendConfig() {
        if (isBlank(resendEmailProperties.getApiKey())) {
            throw new IllegalStateException("Missing resend.api-key or RESEND_API_KEY");
        }

        if (isBlank(resendEmailProperties.getFromEmail())) {
            throw new IllegalStateException("Missing resend.from-email or RESEND_FROM_EMAIL");
        }
    }

    private String buildFromAddress() {
        if (isBlank(resendEmailProperties.getFromName())) {
            return resendEmailProperties.getFromEmail();
        }

        return "%s <%s>".formatted(
                resendEmailProperties.getFromName().trim(),
                resendEmailProperties.getFromEmail().trim()
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String buildOtpHtml(String otp, String title) {
        String escapedTitle = escapeHtml(title);
        String escapedOtp = escapeHtml(otp);

        return """
                <!doctype html>
                <html lang="vi">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>%s</title>
                  </head>
                  <body style="margin:0;padding:0;background:#f4f7f7;font-family:Arial,Helvetica,sans-serif;color:#17252a;">
                    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f7f7;padding:28px 12px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e1ecec;box-shadow:0 12px 32px rgba(22,53,59,0.12);">
                            <tr>
                              <td style="background:#2c5d63;padding:24px 28px;color:#ffffff;">
                                <div style="font-size:20px;font-weight:700;letter-spacing:0;">KATIIA Bookstore</div>
                                <div style="font-size:13px;opacity:0.9;margin-top:6px;">%s</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:30px 28px 10px;">
                                <h1 style="margin:0;font-size:22px;line-height:1.35;color:#17252a;">Ma OTP cua ban</h1>
                                <p style="margin:12px 0 0;font-size:15px;line-height:1.65;color:#52636a;">Nhap ma ben duoi de tiep tuc thao tac. Ma co hieu luc trong <strong>5 phut</strong>.</p>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="padding:18px 28px 26px;">
                                <div style="display:inline-block;padding:18px 28px;border-radius:14px;background:#eef7f6;border:1px solid #cfe5e2;color:#173f47;font-size:34px;font-weight:800;letter-spacing:10px;line-height:1;">%s</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:0 28px 30px;">
                                <div style="border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;padding:14px 16px;color:#7c2d12;font-size:13px;line-height:1.55;">
                                  Neu ban khong yeu cau ma nay, hay bo qua email nay va khong chia se OTP cho bat ky ai.
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:18px 28px;background:#f8fbfb;border-top:1px solid #e6eeee;color:#789; font-size:12px;line-height:1.5;">
                                Email nay duoc gui tu he thong KATIIA Bookstore. Vui long khong tra loi truc tiep email nay.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """.formatted(escapedTitle, escapedTitle, escapedOtp);
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
