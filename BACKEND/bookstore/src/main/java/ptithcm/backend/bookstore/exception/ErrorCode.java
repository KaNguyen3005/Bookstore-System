package ptithcm.backend.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

    // ===== SYSTEM (9xxx) =====
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(9001, "Invalid key", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR(9002, "Validation failed", HttpStatus.BAD_REQUEST),

    // ===== AUTH (1xxx) =====
    UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(1002, "You do not have permission", HttpStatus.FORBIDDEN),

    // ===== USER (2xxx) =====
    USER_ALREADY_EXISTS(2001, "User already existed", HttpStatus.CONFLICT),  // nên là 409 CONFLICT
    USERNAME_INVALID(2002, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(2003, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(2004, "User not found", HttpStatus.NOT_FOUND),
    INVALID_DOB(2005, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS(2006, "Email already existed", HttpStatus.CONFLICT),  // nên là 409 CONFLICT
    PHONE_ALREADY_EXISTS(2007, "Phone already existed", HttpStatus.CONFLICT),  // nên là 409 CONFLICT
    USER_ALREADY_DELETED(2008, "User already deleted", HttpStatus.BAD_REQUEST),

    // ===== BOOK (3xxx) =====
    INVALID_TITLE(3001, "Title must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    INVALID_AUTHOR_IDS(3002, "Must have at least 1 author", HttpStatus.BAD_REQUEST),
    INVALID_SUPPLIER_ID(3003, "Supplier is required", HttpStatus.BAD_REQUEST),
    INVALID_PUBLISHER_ID(3004, "Publisher is required", HttpStatus.BAD_REQUEST),
    INVALID_ISBN(3005,  "ISBN must match pattern {regexp}", HttpStatus.BAD_REQUEST),
    INVALID_LANGUAGE(3006, "Language is required and max 50 characters", HttpStatus.BAD_REQUEST),
    INVALID_DESCRIPTION(3007, "Description must not exceed 5000 characters", HttpStatus.BAD_REQUEST),
    INVALID_PAGE_COUNT(3008, "Page count must be between {min} and {max}", HttpStatus.BAD_REQUEST),
    INVALID_COVER_TYPE(3009, "Cover type is required", HttpStatus.BAD_REQUEST),
    INVALID_STOCK_QUANTITY(3010, "Stock quantity must not be negative", HttpStatus.BAD_REQUEST),
    INVALID_PRICE(3011, "Price must have max {integer} digits and {fraction} decimal places", HttpStatus.BAD_REQUEST),
    INVALID_AVG_RATING(3012, "Rating must be between {value} and 5", HttpStatus.BAD_REQUEST),
    INVALID_SALE_PERCENT(3013,  "Sale percent must be between {min} and {max}", HttpStatus.BAD_REQUEST),
    INVALID_CATEGORY_IDS(3014, "Must have at least 1 category", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(3015, "Book not found", HttpStatus.NOT_FOUND),
    BOOK_ALREADY_DELETED(3016, "Book already deleted", HttpStatus.BAD_REQUEST),
    // ===== PEOPLE (4xxx) =====
    AUTHOR_NOT_FOUND(4001, "Author not found", HttpStatus.NOT_FOUND),

    // ===== ADDRESS (4.5xxx) =====
    ADDRESS_NOT_FOUND(4101, "Address not found", HttpStatus.NOT_FOUND),

    // ===== PARTNER (5xxx) =====
    SUPPLIER_NOT_FOUND(5001, "Supplier not found", HttpStatus.NOT_FOUND),
    PUBLISHER_NOT_FOUND(5002, "Publisher not found", HttpStatus.NOT_FOUND),

    // ===== CATEGORY (60xx) =====
    CATEGORY_NOT_FOUND(6001, "Category not found", HttpStatus.NOT_FOUND),
    // ===== ROLE (61xx) =====
    ROLE_NOT_FOUND(6101, "Role not found", HttpStatus.NOT_FOUND),
    // ===== PERMISSION (62xx) =====
    PERMISSION_NOT_FOUND(6201, "Permission not found", HttpStatus.NOT_FOUND),
    // ===== FILE (7xxx) =====
    UPLOAD_FAILED(7001, "Upload file failed", HttpStatus.INTERNAL_SERVER_ERROR), // nên là 500
    FILE_SIZE_EXCEEDED(7002, "File size exceeded limit", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(7003, "Invalid file type", HttpStatus.BAD_REQUEST),

    // ===== VOUCHER (7.5xxx) =====
    VOUCHER_NOT_FOUND(7101, "Voucher not found", HttpStatus.NOT_FOUND),
    VOUCHER_ALREADY_EXISTS(7102, "Voucher code already exists", HttpStatus.CONFLICT),

    // ===== ORDER (8xxx) =====
    ORDER_NOT_FOUND(8001, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_ALREADY_CANCELLED(8002, "Order already cancelled", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_CONFIRMED(8003, "Order already confirmed", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_COMPLETED(8004, "Order already completed", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_CANCEL(8005, "Order cannot be cancelled at this stage", HttpStatus.BAD_REQUEST),
    ORDER_ITEM_NOT_FOUND(8006, "Order item not found", HttpStatus.NOT_FOUND),
    ORDER_IS_EMPTY(8007, "Order must have at least 1 item", HttpStatus.BAD_REQUEST),

    // ===== PAYMENT (8x5x) =====
    PAYMENT_NOT_FOUND(8501, "Payment not found", HttpStatus.NOT_FOUND),
    PAYMENT_ALREADY_SUCCESS(8502, "Payment already success", HttpStatus.BAD_REQUEST),
    PAYMENT_ALREADY_FAILED(8503, "Payment already failed", HttpStatus.BAD_REQUEST),
    PAYMENT_CANCELLED(8504, "Payment has been cancelled", HttpStatus.BAD_REQUEST),
    INVALID_SIGNATURE(8505, "Invalid payment signature", HttpStatus.BAD_REQUEST),
    PAYMENT_AMOUNT_MISMATCH(8506, "Payment amount does not match order", HttpStatus.BAD_REQUEST),
    PAYMENT_EXPIRED(8507, "Payment session has expired", HttpStatus.BAD_REQUEST),
    PAYMENT_METHOD_NOT_SUPPORTED(8508, "Payment method not supported", HttpStatus.BAD_REQUEST),

    // ===== STOCK (8x8x) =====
    OUT_OF_STOCK(8801, "Book is out of stock", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK(8802, "Not enough stock available", HttpStatus.BAD_REQUEST);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
