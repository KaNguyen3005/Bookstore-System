package ptithcm.backend.bookstore.service;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã OTP xác thực");
        message.setText(
                "Xin chào,\n\n" +
                        "Mã OTP của bạn là: " + otp + "\n" +
                        "Mã có hiệu lực trong 5 phút.\n\n" +
                        "Nếu bạn không yêu cầu mã này, hãy bỏ qua email."
        );

        mailSender.send(message);
    }
}
