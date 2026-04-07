package ptithcm.backend.bookstore.mapper;

import org.mapstruct.Mapper;
import ptithcm.backend.bookstore.dto.request.CreateVoucherRequest;
import ptithcm.backend.bookstore.dto.response.VoucherResponse;
import ptithcm.backend.bookstore.entity.Voucher;

@Mapper(componentModel = "spring")
public interface VoucherMapper {
    Voucher toEntity(CreateVoucherRequest request);
    VoucherResponse toResponse(Voucher entity);
}

