package ptithcm.backend.bookstore.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import ptithcm.backend.bookstore.validator.ValidImageFile;


import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookRequest {
    @NotBlank(message = "INVALID_TITLE")
    @Size(max = 255, message = "INVALID_TITLE")
    String title;

    @NotEmpty(message = "INVALID_AUTHOR_IDS")
    Set<String> authorIds = new HashSet<>();

    @NotBlank(message = "INVALID_SUPPLIER_ID")
    String supplierId;

    @NotBlank(message = "INVALID_PUBLISHER_ID")
    String publisherId;

    @NotBlank(message = "INVALID_ISBN")
    @Pattern(regexp = "^(97[89])?\\d{9}(\\d|X)$", message = "INVALID_ISBN")
    String isbn;

    @NotBlank(message = "INVALID_LANGUAGE")
    @Size(max = 50, message = "INVALID_LANGUAGE")
    String language;

    @Size(max = 5000, message = "INVALID_DESCRIPTION")
    String description;

    @Min(value = 1, message = "INVALID_PAGE_COUNT")
    @Max(value = 99999, message = "INVALID_PAGE_COUNT")
    int pageCount;

    @NotBlank(message = "INVALID_COVER_TYPE")
    String coverType;

    @ValidImageFile(required = true)
    MultipartFile coverImgFile;

    @Min(value = 0, message = "INVALID_STOCK_QUANTITY")
    int stockQuantity = 0;

    @NotNull(message = "INVALID_PRICE")
    @DecimalMin(value = "0.0", inclusive = false, message = "INVALID_PRICE")
    @Digits(integer = 10, fraction = 2, message = "INVALID_PRICE")
    BigDecimal price;

    @DecimalMin(value = "0.0", message = "INVALID_AVG_RATING")
    @DecimalMax(value = "5.0", message = "INVALID_AVG_RATING")
    Float avgRating;

    @Min(value = 0, message = "INVALID_SALE_PERCENT")
    @Max(value = 100, message = "INVALID_SALE_PERCENT")
    Integer salePercent = 0;

    @NotEmpty(message = "INVALID_CATEGORY_IDS")
    Set<String> categoryIds = new HashSet<>();
}
