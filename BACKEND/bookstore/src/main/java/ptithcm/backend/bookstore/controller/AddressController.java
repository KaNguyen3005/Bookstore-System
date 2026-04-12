package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
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
import ptithcm.backend.bookstore.service.GHNService;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/addresses")
public class AddressController {

    AddressService addressService;
    GHNService ghnAddressService;
    @PostMapping()
    ApiResponse<AddressResponse> create(@RequestBody @Valid CreateAddressRequest request){
        ApiResponse<AddressResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(addressService.create(request));
        return apiResponse;
    }

    @GetMapping()
    ApiResponse<List<AddressResponse>> getAll(){
        return ApiResponse.<List<AddressResponse>>builder().result(addressService.getAll()).build();
    }

    @PatchMapping("/{id}")
    ApiResponse<AddressResponse> update(@PathVariable("id") Long id,@RequestBody @Valid UpdateAddressRequest request){
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

    @GetMapping("/provinces")
    public ApiResponse<List<Map<String, Object>>> getProvinces() {
        return ApiResponse.<List<Map<String,Object>>>builder().result(ghnAddressService.getProvinces()).build();
    }

    @GetMapping("/districts/{provinceId}")
    public ApiResponse<List<Map<String, Object>>> getDistricts(@PathVariable Integer provinceId) {
        return ApiResponse.<List<Map<String,Object>>>builder().result(ghnAddressService.getDistricts(provinceId)).build();
    }

    @GetMapping("/wards/{districtId}")
    public ApiResponse<List<Map<String, Object>>> getWards(@PathVariable Integer districtId) {
        return ApiResponse.<List<Map<String,Object>>>builder().result(ghnAddressService.getWards(districtId)).build();
    }
}
