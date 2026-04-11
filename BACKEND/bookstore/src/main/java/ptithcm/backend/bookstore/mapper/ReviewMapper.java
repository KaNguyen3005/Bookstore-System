package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ptithcm.backend.bookstore.dto.request.CreateReviewRequest;
import ptithcm.backend.bookstore.dto.response.ReviewResponse;
import ptithcm.backend.bookstore.entity.Review;

/*TODO: Cần hiểu code sau */

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    Review toEntity(CreateReviewRequest createReviewRequest);

    @Mapping(target = "bookId", source = "book.bookId")
    @Mapping(target = "username", source = "customer.username")
    ReviewResponse toResponse(Review review);
}
