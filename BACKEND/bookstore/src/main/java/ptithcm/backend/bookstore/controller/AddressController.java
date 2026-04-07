package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateAddressRequest;
import ptithcm.backend.bookstore.dto.request.UpdateAddressRequest;
import ptithcm.backend.bookstore.dto.response.AddressResponse;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.service.AddressService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/addresses")
public class AddressController {

    AddressService addressService;

    @PostMapping()
    ApiResponse<AddressResponse> create(@RequestBody CreateAddressRequest request){
        ApiResponse<AddressResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(addressService.create(request));
        return apiResponse;
    }

    @GetMapping()
    ApiResponse<List<AddressResponse>> getAll(){
        return ApiResponse.<List<AddressResponse>>builder().result(addressService.getAll()).build();
    }

    @PatchMapping("/{id}")
    ApiResponse<AddressResponse> update(@PathVariable("id") Long id,@RequestBody UpdateAddressRequest request){
        ApiResponse<AddressResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(addressService.update(id, request));

        return apiResponse;
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Long id){
        addressService.delete(id);

        return ApiResponse.<Void>builder()
            .message("Delete success")
            .build();
    }


}
