package ptithcm.backend.bookstore.controller;


import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateOrderRequest;
import ptithcm.backend.bookstore.dto.request.UpdateOrderItemRequest;
import ptithcm.backend.bookstore.dto.request.UpdateOrderStatusRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.OrderItemResponse;
import ptithcm.backend.bookstore.dto.response.OrderResponse;
import ptithcm.backend.bookstore.dto.response.TopSellingBookResponse;
import ptithcm.backend.bookstore.service.OrderService;

import java.time.LocalDate;
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
    ApiResponse<OrderResponse> create(@RequestBody @Valid CreateOrderRequest request){
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(orderService.create(request));
        return apiResponse;
    }

    @GetMapping()
    ApiResponse<Page<OrderResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ApiResponse.<Page<OrderResponse>>builder().result(orderService.getAll(page, size)).build();
    }

    @GetMapping("{id}")
    ApiResponse<OrderResponse> getById(@PathVariable("id") Long id){
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(orderService.getById(id));

        return apiResponse;
    }

    @GetMapping("/my")
    ApiResponse<Page<OrderResponse>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ApiResponse.<Page<OrderResponse>>builder().result(orderService.getMyOrders(page, size)).build();
    }

    @GetMapping("/my/{id}")
    ApiResponse<OrderResponse> getMyOrderById(@PathVariable("id") Long id){
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(orderService.getMyOrderById(id));

        return apiResponse;
    }

    @PatchMapping("/{id}")
    ApiResponse<OrderResponse> updateOrderStatus(@PathVariable("id") Long id,@RequestBody @Valid UpdateOrderStatusRequest request){
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();

        apiResponse.setResult(orderService.update(id, request));

        return apiResponse;
    }

    @PostMapping("/{id}/cancel")
    ApiResponse<Void> cancelOrder(@PathVariable("id") Integer id){
        orderService.cancelOrder(id);

        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }

    @PutMapping("/{orderId}/approve")
    public ApiResponse<OrderResponse> approveOrder(@PathVariable Long orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.approveOrder(orderId))
                .build();
    }

    /**
     * API: Lấy sách bán chạy nhất trong khoảng thời gian
     * GET /api/v1/orders/top-selling-book?from=2026-01-01&to=2026-12-31
     */
    @GetMapping("/top-selling-book")
    public ApiResponse<TopSellingBookResponse> getTopSellingBook(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to
    ) {
        return ApiResponse.<TopSellingBookResponse>builder()
                .result(orderService.getTopSellingBook(from, to))
                .build();
    }

    /**
     * API: Lấy danh sách N sách bán chạy nhất trong khoảng thời gian
     * GET /api/v1/orders/top-selling-books?from=2026-01-01&to=2026-12-31&limit=10
     */
    @GetMapping("/top-selling-books")
    public ApiResponse<List<TopSellingBookResponse>> getTopSellingBooks(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<List<TopSellingBookResponse>>builder()
                .result(orderService.getTopSellingBooksWithRank(from, to, limit))
                .build();
    }
    @PatchMapping("/{id}/items/{itemId}")
    public ApiResponse<OrderItemResponse> updateOrderItem(@PathVariable Long id, @PathVariable Long itemId, @RequestBody @Valid UpdateOrderItemRequest request) {
        return ApiResponse.<OrderItemResponse>builder()
                .result(orderService.updateOrderItem(id, itemId, request))
                .message("Update order item success")
                .build();
    }

}
