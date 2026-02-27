package ptithcm.backend.bookstore.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ImageFileValidator implements ConstraintValidator<ValidImageFile, MultipartFile> {

    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private boolean required;

    @Override
    public void initialize(ValidImageFile annotation) {
        this.required = annotation.required();
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        // Nếu không bắt buộc và file null thì bỏ qua
        if (file == null || file.isEmpty()) {
            if (required) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Ảnh bìa không được để trống")
                        .addConstraintViolation();
                return false;
            }
            return true;
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Chỉ chấp nhận file JPG, PNG, WEBP")
                    .addConstraintViolation();
            return false;
        }

        if (file.getSize() > MAX_SIZE) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Ảnh không được vượt quá 5MB")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}