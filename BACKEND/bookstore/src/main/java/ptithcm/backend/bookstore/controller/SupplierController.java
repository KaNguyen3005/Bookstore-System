package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.request.CreateSupplierRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.dto.response.PublisherResponse;
import ptithcm.backend.bookstore.dto.response.SupplierResponse;
import ptithcm.backend.bookstore.service.AuthorService;
import ptithcm.backend.bookstore.service.SupplierService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/suppliers")
public class SupplierController {
    SupplierService supplierService;

    @PostMapping()
    ApiResponse<SupplierResponse> create(@RequestBody CreateSupplierRequest createSupplierRequest){
        ApiResponse<SupplierResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(supplierService.create(createSupplierRequest));
        return apiResponse;
    }


    @GetMapping()
    ApiResponse<List<SupplierResponse>> getAll(){
        return ApiResponse.<List<SupplierResponse>>builder().result(supplierService.getAll()).build();
    }
}
