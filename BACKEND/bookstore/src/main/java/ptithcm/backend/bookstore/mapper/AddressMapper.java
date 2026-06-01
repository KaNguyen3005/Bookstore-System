package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import ptithcm.backend.bookstore.dto.request.CreateAddressRequest;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.response.AddressResponse;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.entity.Address;
import ptithcm.backend.bookstore.entity.Author;

@Mapper(componentModel = "spring")

public interface AddressMapper {
    Address toEntity(CreateAddressRequest request);
    AddressResponse toResponse(Address entity);
}
