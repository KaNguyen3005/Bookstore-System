package ptithcm.backend.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_ALREADY_EXISTS(1001, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1004, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1005, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must at least {min}", HttpStatus.BAD_REQUEST),
    AUTHOR_NOT_FOUND(1009, "Author not found", HttpStatus.NOT_FOUND),
    SUPPLIER_NOT_FOUND(1010, "Supplier not found", HttpStatus.NOT_FOUND),
    PUBLISHER_NOT_FOUND(1011, "Publisher not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(1012, "Category not found", HttpStatus.NOT_FOUND),
    UPLOAD_FAILED(1013, "Upload file failed", HttpStatus.BAD_REQUEST);




    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
