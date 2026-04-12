package ptithcm.backend.bookstore.mapper;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.dto.response.ReviewResponse;
import ptithcm.backend.bookstore.entity.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring", uses = {ReviewMapper.class})
public interface BookMapper {
    Book toEntity(CreateBookRequest request);

    @Mapping(target = "coverImgUrl", source = "coverImageUrl")
    @Mapping(target = "categories", expression = "java(mapCategories(book.getCategories()))")
    BookResponse toResponse(Book book);

    default Set<String> mapCategories(Set<Category> categories) {
        if (categories == null) return new HashSet<>();
        return categories.stream()
                .map(Category::getCategoryName)
                .collect(Collectors.toSet());
    }
}
