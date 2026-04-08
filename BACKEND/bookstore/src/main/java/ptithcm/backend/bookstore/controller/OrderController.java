package ptithcm.backend.bookstore.controller;


import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateAuthorRequest;
import ptithcm.backend.bookstore.dto.request.CreateOrderRequest;
import ptithcm.backend.bookstore.dto.request.UpdateAuthorRequest;
import ptithcm.backend.bookstore.dto.request.UpdateOrderStatusRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.AuthorResponse;
import ptithcm.backend.bookstore.dto.response.OrderResponse;
import ptithcm.backend.bookstore.service.OrderService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/orders")
public class OrderController {
    OrderService orderService;
    @PostMapping()
    ApiResponse<OrderResponse> create(@RequestBody CreateOrderRequest request){
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(orderService.create(request));
        return apiResponse;
    }

    @GetMapping()
    ApiResponse<List<OrderResponse>> getAll(){
        return ApiResponse.<List<OrderResponse>>builder().result(orderService.getAll()).build();
    }

    @GetMapping("{id}")
    ApiResponse<OrderResponse> getById(@PathVariable("id") Long id){
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(orderService.getById(id));

        return apiResponse;
    }

    @PatchMapping("/{id}")
    ApiResponse<OrderResponse> updateOrderStatus(@PathVariable("id") Long id,@RequestBody UpdateOrderStatusRequest request){
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(orderService.update(id, request));

        return apiResponse;
    }
//
//    @DeleteMapping("/{id}")
//    ApiResponse<Void> delete(@PathVariable("id") Integer id){
//        authorService.delete(id);
//
//        return ApiResponse.<Void>builder()
//                .message("Delete success")
//                .build();
//    }

}
