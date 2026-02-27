package ptithcm.backend.bookstore.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ImageFileValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)

public @interface ValidImageFile {
    String message() default "File ảnh không hợp lệ";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    boolean required() default false;
}