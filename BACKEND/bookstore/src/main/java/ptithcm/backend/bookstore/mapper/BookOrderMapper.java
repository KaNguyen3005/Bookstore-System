package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import ptithcm.backend.bookstore.dto.response.OrderItemResponse;
import ptithcm.backend.bookstore.entity.BookOrder;

@Mapper(componentModel = "spring")
public interface BookOrderMapper {
    OrderItemResponse toResponse(BookOrder bookOrder);
}

