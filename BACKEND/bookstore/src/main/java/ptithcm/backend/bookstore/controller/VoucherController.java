package ptithcm.backend.bookstore.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateVoucherRequest;
import ptithcm.backend.bookstore.dto.request.UpdateVoucherRequest;
import ptithcm.backend.bookstore.dto.response.VoucherResponse;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.service.VoucherService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/vouchers")
public class VoucherController {

    VoucherService voucherService;

    @PostMapping()
    ApiResponse<VoucherResponse> create(@RequestBody CreateVoucherRequest request){
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.create(request))
                .build();
    }

    @GetMapping()
    ApiResponse<List<VoucherResponse>> getAll(){
        return ApiResponse.<List<VoucherResponse>>builder()
                .result(voucherService.getAll())
                .build();
    }

    @GetMapping("/active")
    ApiResponse<List<VoucherResponse>> getAllActive(){
        return ApiResponse.<List<VoucherResponse>>builder()
                .result(voucherService.getAllActive())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<VoucherResponse> getById(@PathVariable("id") Long id){
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.getById(id))
                .build();
    }

    @GetMapping("/code/{code}")
    ApiResponse<VoucherResponse> getByCode(@PathVariable("code") String voucherCode){
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.getByCode(voucherCode))
                .build();
    }

    @PatchMapping("/{id}")
    ApiResponse<VoucherResponse> update(@PathVariable("id") Long id, @RequestBody UpdateVoucherRequest request){
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Long id){
        voucherService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }
}

