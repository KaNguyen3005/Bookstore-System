package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Publisher;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring")
public interface PublisherMapper {
    Publisher toEntity(CreatePublisherRequest createPublisherRequest);
    PublisherResponse toResponse(Publisher publisher);
}
