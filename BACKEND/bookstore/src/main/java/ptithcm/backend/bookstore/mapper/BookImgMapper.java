package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import ptithcm.backend.bookstore.dto.response.BookImgResponse;
import ptithcm.backend.bookstore.entity.BookImg;

@Mapper(componentModel = "spring")
public interface BookImgMapper {
        // BookImg to BookImgResponse
        BookImgResponse toResponse(BookImg bookImg);
}
