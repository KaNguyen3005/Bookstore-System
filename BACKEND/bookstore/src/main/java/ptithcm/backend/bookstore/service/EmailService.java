package ptithcm.backend.bookstore.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.entity.Role;
import ptithcm.backend.bookstore.entity.User;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    JavaMailSender mailSender;

    @NonFinal
    @Value("${app.mail.from-email:${spring.mail.username:}}")
    String fromEmail;

    @NonFinal
    @Value("${spring.mail.username:}")
    String mailUsername;

    @NonFinal
    @Value("${spring.mail.password:}")
    String mailPassword;

    @NonFinal
    @Value("${app.mail.from-name:KATIIA Bookstore}")
    String fromName;

    public void sendOtpEmail(String toEmail, String otp) {
        sendOtpEmail(toEmail, otp, "Ma OTP xac thuc", "Xac thuc tai khoan");
    }

    public void sendOtpEmail(String toEmail, String otp, String subject, String title) {
        try {
            sendHtmlEmail(toEmail, subject, buildOtpHtml(otp, title));
        } catch (Exception e) {
            log.error("Cannot send OTP email to {}", toEmail, e);
            throw new IllegalStateException("Cannot send OTP email", e);
        }
    }

    public void sendRoleChangedEmail(User user, Role oldRole, Role newRole, String actorName) {
        if (user == null || isBlank(user.getEmail()) || newRole == null) {
            return;
        }

        try {
            sendHtmlEmail(
                    user.getEmail(),
                    "Cap nhat quyen truy cap tai khoan KATIIA Bookstore",
                    buildRoleChangedHtml(user, oldRole, newRole, actorName)
            );
        } catch (Exception e) {
            log.warn("Cannot send role update email to {}", user.getEmail(), e);
        }
    }

    public void sendStaffAccountCreatedEmail(User user, String rawPassword, Role role, String actorName) {
        if (user == null || isBlank(user.getEmail()) || isBlank(rawPassword) || role == null) {
            return;
        }

        try {
            sendHtmlEmail(
                    user.getEmail(),
                    "Tai khoan KATIIA Bookstore cua ban da duoc tao",
                    buildStaffAccountCreatedHtml(user, rawPassword, role, actorName)
            );
        } catch (Exception e) {
            log.warn("Cannot send account created email to {}", user.getEmail(), e);
        }
    }

    private void sendHtmlEmail(String toEmail, String subject, String html)
            throws MessagingException, UnsupportedEncodingException {
        validateMailConfig();

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(buildFromAddress());
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
    }

    private void validateMailConfig() {
        if (isBlank(mailUsername)) {
            throw new IllegalStateException("Missing MAIL_USERNAME or spring.mail.username");
        }

        if (isBlank(mailPassword)) {
            throw new IllegalStateException("Missing MAIL_PASSWORD or spring.mail.password");
        }

        if (isBlank(fromEmail)) {
            throw new IllegalStateException("Missing MAIL_FROM_EMAIL, MAIL_USERNAME, or app.mail.from-email");
        }
    }

    private InternetAddress buildFromAddress() throws MessagingException, UnsupportedEncodingException {
        if (isBlank(fromName)) {
            return new InternetAddress(fromEmail.trim());
        }

        return new InternetAddress(fromEmail.trim(), fromName.trim(), "UTF-8");
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

    private String buildRoleChangedHtml(User user, Role oldRole, Role newRole, String actorName) {
        String displayName = escapeHtml(isBlank(user.getName()) ? user.getUsername() : user.getName());
        String username = escapeHtml(user.getUsername());
        String email = escapeHtml(user.getEmail());
        String oldRoleName = escapeHtml(oldRole == null ? "Chua gan vai tro" : oldRole.getRoleName());
        String newRoleName = escapeHtml(newRole.getRoleName());
        String updater = escapeHtml(isBlank(actorName) ? "Quan tri vien he thong" : actorName);
        String updatedAt = escapeHtml(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

        return """
                <!doctype html>
                <html lang="vi">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Cap nhat quyen truy cap</title>
                  </head>
                  <body style="margin:0;padding:0;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#17252a;">
                    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#f3f6f8;padding:30px 12px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e1e8ec;box-shadow:0 14px 34px rgba(24,47,58,0.12);">
                            <tr>
                              <td style="background:#183b4a;padding:26px 30px;color:#ffffff;">
                                <div style="font-size:21px;font-weight:700;">KATIIA Bookstore</div>
                                <div style="font-size:13px;opacity:0.9;margin-top:7px;">Thong bao cap nhat quyen truy cap tai khoan</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:30px 30px 10px;">
                                <h1 style="margin:0;font-size:22px;line-height:1.35;color:#17252a;">Vai tro cua ban da duoc cap nhat</h1>
                                <p style="margin:14px 0 0;font-size:15px;line-height:1.65;color:#52636a;">Xin chao <strong>%s</strong>, he thong vua ghi nhan thay doi quyen truy cap cho tai khoan cua ban.</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:18px 30px 8px;">
                                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
                                  <tr><td style="color:#6b7b84;font-size:13px;width:150px;">Tai khoan</td><td style="font-size:14px;font-weight:700;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Email</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Vai tro truoc do</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Vai tro moi</td><td style="font-size:15px;font-weight:800;color:#0f766e;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Nguoi thuc hien</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Thoi gian</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px 30px 30px;">
                                <div style="border-radius:12px;background:#eef7f6;border:1px solid #cfe5e2;padding:15px 17px;color:#173f47;font-size:13px;line-height:1.6;">
                                  Vui long dang xuat va dang nhap lai de quyen moi co hieu luc day du. Neu ban khong mong doi thay doi nay, hay lien he quan tri vien ngay.
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:18px 30px;background:#f8fbfb;border-top:1px solid #e6eeee;color:#789;font-size:12px;line-height:1.5;">
                                Email nay duoc gui tu he thong KATIIA Bookstore. Vui long khong tra loi truc tiep email nay.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """.formatted(displayName, username, email, oldRoleName, newRoleName, updater, updatedAt);
    }

    private String buildStaffAccountCreatedHtml(User user, String rawPassword, Role role, String actorName) {
        String displayName = escapeHtml(isBlank(user.getName()) ? user.getUsername() : user.getName());
        String username = escapeHtml(user.getUsername());
        String email = escapeHtml(user.getEmail());
        String password = escapeHtml(rawPassword);
        String roleName = escapeHtml(role.getRoleName());
        String creator = escapeHtml(isBlank(actorName) ? "Quan tri vien he thong" : actorName);
        String createdAt = escapeHtml(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

        return """
                <!doctype html>
                <html lang="vi">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Tai khoan noi bo KATIIA Bookstore</title>
                  </head>
                  <body style="margin:0;padding:0;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#17252a;">
                    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#f3f6f8;padding:30px 12px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e1e8ec;box-shadow:0 14px 34px rgba(24,47,58,0.12);">
                            <tr>
                              <td style="background:#183b4a;padding:26px 30px;color:#ffffff;">
                                <div style="font-size:21px;font-weight:700;">KATIIA Bookstore</div>
                                <div style="font-size:13px;opacity:0.9;margin-top:7px;">Thong tin tai khoan noi bo</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:30px 30px 10px;">
                                <h1 style="margin:0;font-size:22px;line-height:1.35;color:#17252a;">Tai khoan cua ban da duoc tao</h1>
                                <p style="margin:14px 0 0;font-size:15px;line-height:1.65;color:#52636a;">Xin chao <strong>%s</strong>, ban co the dang nhap vao he thong quan tri voi thong tin ben duoi.</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:18px 30px 8px;">
                                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
                                  <tr><td style="color:#6b7b84;font-size:13px;width:150px;">Ten dang nhap</td><td style="font-size:14px;font-weight:700;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Email</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Mat khau tam</td><td style="font-size:15px;font-weight:800;color:#0f766e;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Vai tro</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Nguoi tao</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                  <tr><td style="color:#6b7b84;font-size:13px;">Thoi gian</td><td style="font-size:14px;color:#17252a;">%s</td></tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px 30px 30px;">
                                <div style="border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;padding:15px 17px;color:#7c2d12;font-size:13px;line-height:1.6;">
                                  Hay doi mat khau sau lan dang nhap dau tien va khong chia se mat khau nay cho bat ky ai.
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:18px 30px;background:#f8fbfb;border-top:1px solid #e6eeee;color:#789;font-size:12px;line-height:1.5;">
                                Email nay duoc gui tu he thong KATIIA Bookstore. Vui long khong tra loi truc tiep email nay.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """.formatted(displayName, username, email, password, roleName, creator, createdAt);
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
