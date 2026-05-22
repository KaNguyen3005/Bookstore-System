package ptithcm.backend.bookstore.exception;

import jakarta.validation.ConstraintViolation;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ptithcm.backend.bookstore.dto.response.ApiResponse;

import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GlobalExceptionHandler {
    // Khai báo tất cả attribute keys
    String MIN_ATTRIBUTE = "min";
    String MAX_ATTRIBUTE = "max";
    String VALUE_ATTRIBUTE = "value";
    String INCLUSIVE_ATTRIBUTE = "inclusive";
    String INTEGER_ATTRIBUTE = "integer";
    String FRACTION_ATTRIBUTE = "fraction";
    String REGEXP_ATTRIBUTE = "regexp";

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(Exception exception) {
        log.error("Exception: ", exception);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
        ApiResponse apiResponse = new ApiResponse();
        ErrorCode errorCode = exception.getErrorcode();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccesDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.ACCESS_DENIED;

        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        Map<String, Object> attributes = null;
        try {
            errorCode = ErrorCode.valueOf(enumKey);

            // BindingResult chính là những error mà MethodArgumentNotValidException wrap lại
            var constraintViolation = exception
                    .getBindingResult()
                    .getAllErrors()
                    .getFirst()
                    .unwrap(ConstraintViolation.class); // Đoạn code này sẽ lấy những thông tin attribute mong muốn

            attributes = constraintViolation.getConstraintDescriptor().getAttributes();

            log.info(attributes.toString());
        } catch (IllegalArgumentException e) {
            log.warn("Unknown error code key: {}", enumKey);
        }

        // Trả về apiResponse khi có lỗi và bên trong đã được map
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());

        // Check attributes trả về có null không , không thì -> MapAttribute vào erro message trong error
        apiResponse.setMessage(
                Objects.nonNull(attributes)
                        ? mapAttribute(errorCode.getMessage(), attributes)
                        : errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        // Duyệt qua tất cả attribute và replace vào message
        String result = message;

        if (attributes.containsKey(MIN_ATTRIBUTE))
            result = result.replace("{min}", attributes.get(MIN_ATTRIBUTE).toString());

        if (attributes.containsKey(MAX_ATTRIBUTE))
            result = result.replace("{max}", attributes.get(MAX_ATTRIBUTE).toString());

        if (attributes.containsKey(VALUE_ATTRIBUTE))
            result = result.replace("{value}", attributes.get(VALUE_ATTRIBUTE).toString());

        if (attributes.containsKey(INCLUSIVE_ATTRIBUTE))
            result = result.replace("{inclusive}", attributes.get(INCLUSIVE_ATTRIBUTE).toString());

        if (attributes.containsKey(INTEGER_ATTRIBUTE))
            result = result.replace("{integer}", attributes.get(INTEGER_ATTRIBUTE).toString());

        if (attributes.containsKey(FRACTION_ATTRIBUTE))
            result = result.replace("{fraction}", attributes.get(FRACTION_ATTRIBUTE).toString());

        if (attributes.containsKey(REGEXP_ATTRIBUTE))
            result = result.replace("{regexp}", attributes.get(REGEXP_ATTRIBUTE).toString());

        return result;
    }
}
