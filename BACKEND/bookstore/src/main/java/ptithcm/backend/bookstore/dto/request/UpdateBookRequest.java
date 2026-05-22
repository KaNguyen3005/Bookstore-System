package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import ptithcm.backend.bookstore.validator.ValidImageFile;
import ptithcm.backend.bookstore.validator.ValidIsbn;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateBookRequest {

    @Size(max = 255, message = "INVALID_TITLE")
    String title;

    Set<Integer> authorIds; // bỏ qua validate ID

    Integer publisherId; // bỏ qua validate ID

    @ValidIsbn
    String isbn;

    @Size(max = 50, message = "INVALID_LANGUAGE")
    String language;

    @Size(max = 5000, message = "INVALID_DESCRIPTION")
    String description;

    @Min(value = 1, message = "INVALID_PAGE_COUNT")
    @Max(value = 99999, message = "INVALID_PAGE_COUNT")
    Integer pageCount;

    String coverType;

    @ValidImageFile(required = false)
    MultipartFile coverImg;

    @Min(value = 0, message = "INVALID_STOCK_QUANTITY")
    Integer stockQuantity;

    @DecimalMin(value = "0.0", inclusive = false, message = "INVALID_PRICE")
    @Digits(integer = 10, fraction = 2, message = "INVALID_PRICE")
    BigDecimal price;

    @DecimalMin(value = "0.0", message = "INVALID_AVG_RATING")
    @DecimalMax(value = "5.0", message = "INVALID_AVG_RATING")
    Float avgRating;

    @Min(value = 0, message = "INVALID_SALE_PERCENT")
    @Max(value = 100, message = "INVALID_SALE_PERCENT")
    Integer salePercent;

    Boolean isActive;

    Set<Integer> categories; // bỏ qua validate ID
}
