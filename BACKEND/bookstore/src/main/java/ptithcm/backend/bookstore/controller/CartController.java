package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ptithcm.backend.bookstore.dto.request.CreateCartItemRequest;
import ptithcm.backend.bookstore.dto.request.UpdateCartItemRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.CartItemResponse;
import ptithcm.backend.bookstore.service.CartService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/cart")
public class CartController {
    CartService cartService;

    @GetMapping("/items")
    ApiResponse<List<CartItemResponse>> getAll(){
        return ApiResponse.<List<CartItemResponse>>builder().result(cartService.getAll()).build();
    }

    @PostMapping("/items/{bookId}")
    ApiResponse<CartItemResponse> addItem(@PathVariable Integer bookId, @RequestBody @Valid CreateCartItemRequest request) {
        return ApiResponse.<CartItemResponse>builder().result(cartService.create(bookId, request)).build();
    }

    @PatchMapping("/items/{bookCartId}")
    ApiResponse<CartItemResponse> updateItem(@PathVariable Long bookCartId, @RequestBody @Valid UpdateCartItemRequest request) {
        return ApiResponse.<CartItemResponse>builder().result(cartService.update(bookCartId, request)).build();
    }

    @DeleteMapping("/items/{bookCartId}")
    ApiResponse<Void> deleteItem(@PathVariable Long bookCartId) {
        cartService.delete(bookCartId);
        return ApiResponse.<Void>builder().build();
    }
}
