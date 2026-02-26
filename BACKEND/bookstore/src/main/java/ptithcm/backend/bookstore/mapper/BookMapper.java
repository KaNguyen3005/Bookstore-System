package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.Publisher;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring")
public interface BookMapper {

    Book toEntity(CreateBookRequest createBookRequest);

    @Mapping(target="coverImgUrl", ignore = true)
    BookResponse toResponse(Book book);
}
