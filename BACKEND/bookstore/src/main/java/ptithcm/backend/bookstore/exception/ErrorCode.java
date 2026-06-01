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
    CATEGORY_NOT_DELETED(9003, "Category cannot be deleted because it has child categories or associated books", HttpStatus.BAD_REQUEST),
    CATEGORY_ALREADY_EXISTS(9004, "Category name already exists", HttpStatus.CONFLICT),
    CATEGORY_ALREADY_DELETED(9005, "Category already deleted", HttpStatus.BAD_REQUEST),
    INVALID_PARENT_CATEGORY(9006, "Invalid parent category", HttpStatus.BAD_REQUEST),
    TOKEN_NOT_PROVIDED(9007, "Token not provided", HttpStatus.UNAUTHORIZED),
    // ===== AUTH (1xxx) =====
    UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(1002, "You do not have permission", HttpStatus.FORBIDDEN),

    // ===== USER (2xxx) =====
    USER_ALREADY_EXISTS(2001, "User already existed", HttpStatus.CONFLICT),  // nên là 409 CONFLICT
    INVALID_USERNAME(2002, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(2003, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(2004, "User not found", HttpStatus.NOT_FOUND),
    INVALID_DOB(2005, "Your age must be {regexp}", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS(2006, "Email already existed", HttpStatus.CONFLICT),  // nên là 409 CONFLICT
    INVALID_AGE(2019, "User must be at least {min} years old", HttpStatus.BAD_REQUEST),
    PHONE_ALREADY_EXISTS(2007, "Phone already existed", HttpStatus.CONFLICT),  // nên là 409 CONFLICT
    USER_ALREADY_DELETED(2008, "User already deleted", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(2009, "Invalid email format", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(2010, "Invalid phone number format", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(2011, "Password must be at least {min} characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character", HttpStatus.BAD_REQUEST),
    INVALID_NAME(2012, "Name must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    INVALID_GENDER(2013, "Gender must be MALE or FEMALE or OTHER", HttpStatus.BAD_REQUEST),
    INVALID_ACCOUNT_STATUS(2014, "Account status not null", HttpStatus.BAD_REQUEST),
    UPDATE_USER_FAILED(2015, "Update user failed", HttpStatus.INTERNAL_SERVER_ERROR),
    USERNAME_CHANGE_LIMITED(2016, "Username can only be changed once", HttpStatus.BAD_REQUEST),
    USER_INACTIVE(2017, "User account is inactive", HttpStatus.FORBIDDEN),
    INVALID_ROLE_ID(2018, "Role ID is required and must be valid", HttpStatus.BAD_REQUEST),
    // ===== BOOK (3xxx) =====
    INVALID_TITLE(3001, "Title must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    INVALID_AUTHOR_IDS(3002, "Must have at least 1 author", HttpStatus.BAD_REQUEST),
    INVALID_SUPPLIER_ID(3003, "Supplier is required", HttpStatus.BAD_REQUEST),
    INVALID_PUBLISHER_ID(3004, "Publisher is required", HttpStatus.BAD_REQUEST),
    INVALID_ISBN(3005,  "ISBN must be a valid ISBN-10 or ISBN-13", HttpStatus.BAD_REQUEST),
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
    INVALID_COMMENT(3017, "Comment must not exceed {max} characters", HttpStatus.BAD_REQUEST),
    UPLOAD_IMAGE_FAILED(3018, "Upload image failed", HttpStatus.INTERNAL_SERVER_ERROR), // nên là 500
    // ===== PEOPLE (4xxx) =====
    AUTHOR_NOT_FOUND(4001, "Author not found", HttpStatus.NOT_FOUND),

    // ===== ADDRESS (41xx) =====
    ADDRESS_NOT_FOUND(4101, "Address not found", HttpStatus.NOT_FOUND),
    CART_NOT_FOUND(4102, "Cart not found", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_FOUND(4103, "Cart item not found", HttpStatus.NOT_FOUND),
    INVALID_PROVINCE(4104, "Invalid province", HttpStatus.BAD_REQUEST),
    INVALID_DISTRICT(4105, "Invalid district", HttpStatus.BAD_REQUEST),
    INVALID_WARD(4106, "Invalid ward", HttpStatus.BAD_REQUEST),
    INVALID_DETAIL_ADDRESS(4107, "Invalid detail address", HttpStatus.BAD_REQUEST),
    // ===== PARTNER (5xxx) =====
    SUPPLIER_NOT_FOUND(5001, "Supplier not found", HttpStatus.NOT_FOUND),
    PUBLISHER_NOT_FOUND(5002, "Publisher not found", HttpStatus.NOT_FOUND),

    // ===== CATEGORY (60xx) =====
    CATEGORY_NOT_FOUND(6001, "Category not found", HttpStatus.NOT_FOUND),
    INVALID_CATEGORY_NAME(6002, "Category name must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    INVALID_PARENT_ID(6003, "Parent category not found", HttpStatus.BAD_REQUEST),
    // ===== ROLE (61xx) =====
    ROLE_NOT_FOUND(6101, "Role not found", HttpStatus.NOT_FOUND),
    SYSTEM_ROLE_PROTECTED(6102, "System role cannot be changed or deleted", HttpStatus.BAD_REQUEST),
    // ===== PERMISSION (62xx) =====
    PERMISSION_NOT_FOUND(6201, "Permission not found", HttpStatus.NOT_FOUND),
    // ===== FILE (7xxx) =====
    UPLOAD_FAILED(7001, "Upload file failed", HttpStatus.INTERNAL_SERVER_ERROR), // nên là 500
    FILE_SIZE_EXCEEDED(7002, "File size exceeded limit", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(7003, "Invalid file type", HttpStatus.BAD_REQUEST),

    // ===== VOUCHER (7.5xxx) =====
    VOUCHER_NOT_FOUND(7101, "Voucher not found", HttpStatus.NOT_FOUND),
    VOUCHER_ALREADY_EXISTS(7102, "Voucher code already exists", HttpStatus.CONFLICT),
    INVALID_VOUCHER_CODE(7103, "Voucher code must be between {min} and {max} characters", HttpStatus.BAD_REQUEST),
    INVALID_NOTE(7104, "Note must not exceed {max} characters", HttpStatus.BAD_REQUEST),
    VOUCHER_NOT_STARTED(7105, "Voucher is not active yet", HttpStatus.BAD_REQUEST),
    VOUCHER_EXPIRED(7106, "Voucher has expired", HttpStatus.BAD_REQUEST),
    VOUCHER_OUT_OF_STOCK(7107, "Voucher is out of stock", HttpStatus.BAD_REQUEST),
    ORDER_NOT_ELIGIBLE_FOR_VOUCHER(7108, "Order does not meet voucher requirements", HttpStatus.BAD_REQUEST),
    VOUCHER_INACTIVE(7109, "Voucher is not active", HttpStatus.BAD_REQUEST),
    // ===== ORDER (8xxx) =====
    ORDER_NOT_FOUND(8001, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_ALREADY_CANCELLED(8002, "Order already cancelled", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_CONFIRMED(8003, "Order already confirmed", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_COMPLETED(8004, "Order already completed", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_CANCEL(8005, "Order cannot be cancelled at this stage", HttpStatus.BAD_REQUEST),
    ORDER_ITEM_NOT_FOUND(8006, "Order item not found", HttpStatus.NOT_FOUND),
    ORDER_IS_EMPTY(8007, "Order must have at least 1 item", HttpStatus.BAD_REQUEST),
    REVIEW_ALREADY_EXISTS(8008, "You have already reviewed this book", HttpStatus.BAD_REQUEST),

    // ===== PAYMENT (85xx) =====
    PAYMENT_NOT_FOUND(8501, "Payment not found", HttpStatus.NOT_FOUND),
    PAYMENT_ALREADY_SUCCESS(8502, "Payment already success", HttpStatus.BAD_REQUEST),
    PAYMENT_ALREADY_FAILED(8503, "Payment already failed", HttpStatus.BAD_REQUEST),
    PAYMENT_CANCELLED(8504, "Payment has been cancelled", HttpStatus.BAD_REQUEST),
    INVALID_SIGNATURE(8505, "Invalid payment signature", HttpStatus.BAD_REQUEST),
    PAYMENT_AMOUNT_MISMATCH(8506, "Payment amount does not match order", HttpStatus.BAD_REQUEST),
    PAYMENT_EXPIRED(8507, "Payment session has expired", HttpStatus.BAD_REQUEST),
    PAYMENT_METHOD_NOT_SUPPORTED(8508, "Payment method not supported", HttpStatus.BAD_REQUEST),
    INVALID_PAYMENT_METHOD(8509, "Invalid payment method", HttpStatus.BAD_REQUEST),
    // ===== SHIPMENT (86xx) =====
    SHIPMENT_NOT_FOUND(8601, "Shipment not found", HttpStatus.NOT_FOUND),
    GHN_CREATE_ORDER_FAILED(8602, "Failed to create shipping order with GHN", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_ORDER_STATUS(8603, "Order status does not allow shipment creation", HttpStatus.BAD_REQUEST),
    // ===== STOCK (8x8x) =====
    OUT_OF_STOCK(8801, "Book is out of stock", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK(8802, "Not enough stock available", HttpStatus.BAD_REQUEST),
    INVALID_RATING(8803, "Rating must be between {min} and {max}", HttpStatus.BAD_REQUEST),
    // ===== CART (9xxx) =====
    INVALID_QUANTITY(9001, "Quantity must be between {min} and {max}", HttpStatus.BAD_REQUEST),
    // ===== OTP (91xx) =====
    OTP_NOT_FOUND(9101, "OTP không đúng", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(9102, "OTP has expired", HttpStatus.BAD_REQUEST),
    OTP_INVALID(9103, "OTP không đúng", HttpStatus.BAD_REQUEST),
    // ===== FILE (92xx) =====
    INVALID_FILE(9201, "Invalid file", HttpStatus.BAD_REQUEST),
    FILE_NOT_FOUND(9202, "File not found", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(9203, "Invalid request", HttpStatus.BAD_REQUEST);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
