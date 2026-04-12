package ptithcm.backend.bookstore.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.UpdateCategoryRequest;
import ptithcm.backend.bookstore.dto.response.ApiResponse;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.service.CategoryService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("api/v1/categories")
public class CategoryController {

    CategoryService categoryService;

    /**
     * Tạo category mới
     * POST /api/v1/categories
     */
    @PostMapping()
    ApiResponse<CategoryResponse> create(@RequestBody @Valid CreateCategoryRequest request) {
        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.create(request));
        return apiResponse;
    }

    /**
     * Lấy tất cả categories (theo cấu trúc cây)
     * GET /api/v1/categories
     */
    @GetMapping()
    ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAll())
                .build();
    }

    /**
     * Lấy category theo ID
     * GET /api/v1/categories/{id}
     */
    @GetMapping("/{id}")
    ApiResponse<CategoryResponse> getById(@PathVariable("id") Integer id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getById(id))
                .build();
    }

    /**
     * Lấy tất cả category con của một category
     * GET /api/v1/categories/{id}/children
     */
    @GetMapping("/{id}/children")
    ApiResponse<List<CategoryResponse>> getChildCategories(@PathVariable("id") Integer id) {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getChildCategories(id))
                .build();
    }

    /**
     * Soft delete category (và tất cả children)
     * DELETE /api/v1/categories/{id}
     */
    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable("id") Integer id) {
        categoryService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete success")
                .build();
    }

    /**
     * Update category
     * PATCH /api/v1/categories/{id}
     */
    @PatchMapping("/{id}")
    ApiResponse<CategoryResponse> update(@PathVariable("id") Integer id, 
                                         @RequestBody @Valid UpdateCategoryRequest request) {
        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.update(id, request));
        return apiResponse;
    }

    /**
     * Restore category từ soft delete
     * POST /api/v1/categories/{id}/restore
     */
    @PostMapping("/{id}/restore")
    ApiResponse<CategoryResponse> restore(@PathVariable("id") Integer id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.restore(id))
                .build();
    }
}
