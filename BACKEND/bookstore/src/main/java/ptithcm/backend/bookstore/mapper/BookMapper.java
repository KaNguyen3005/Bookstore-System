package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.entity.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring")
public interface BookMapper {
    Book toEntity(CreateBookRequest request);

    @Mapping(target = "coverImgUrl", source = "coverImageUrl")
    @Mapping(target = "categories", expression = "java(mapCategories(book.getCategories()))")
    @Mapping(target = "bookStatus", expression = "java(resolveBookStatus(book))")
    BookResponse toResponse(Book book);

    default Set<String> mapCategories(Set<Category> categories) {
        if (categories == null) return new HashSet<>();
        return categories.stream()
                .map(Category::getCategoryName)
                .collect(Collectors.toSet());
    }

    default String resolveBookStatus(Book book) {
        if (book == null || Boolean.FALSE.equals(book.getIsActive())) {
            return "Tạm Ngưng";
        }
        if (book.getStockQuantity() <= 0) {
            return "Hết Hàng";
        }
        return "Đang Bán";
    }
}
