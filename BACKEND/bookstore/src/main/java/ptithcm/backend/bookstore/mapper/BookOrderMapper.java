package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ptithcm.backend.bookstore.dto.response.OrderItemResponse;
import ptithcm.backend.bookstore.entity.BookOrder;

@Mapper(componentModel = "spring")
public interface BookOrderMapper {
    @Mapping(source = "bookOrderId", target = "orderItemId")
    @Mapping(source = "book.bookId", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "book.price", target = "price")
    @Mapping(source = "book.coverImageUrl", target = "coverImageUrl")
    OrderItemResponse toResponse(BookOrder bookOrder);
}

