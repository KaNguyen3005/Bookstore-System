package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import ptithcm.backend.bookstore.dto.request.CreatePublisherRequest;
import ptithcm.backend.bookstore.dto.request.CreateSupplierRequest;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.dto.response.SupplierResponse;
import ptithcm.backend.bookstore.entity.Publisher;
import ptithcm.backend.bookstore.entity.Supplier;

// componentModel = "spring" giúp @Autowired mapper này ở Service
@Mapper(componentModel = "spring")
public interface SupplierMapper {
    Supplier toEntity(CreateSupplierRequest createSupplierRequest);
    SupplierResponse toResponse(Supplier supplier);
}
