package ptithcm.backend.bookstore.service;


import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.UpdateCategoryRequest;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.entity.Category;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.CategoryMapper;
import ptithcm.backend.bookstore.repository.CategoryRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    /**
     * Tạo category mới (có thể là parent hoặc child)
     */
    @Transactional
    public CategoryResponse create(CreateCategoryRequest request) {
        // Check category name không bị trùng
        if (isCategoryNameExists(request.getCategoryName())) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        Category category = categoryMapper.toEntity(request);

        // Nếu có parentId → tìm parent category
        if (request.getParentId() != null && request.getParentId() > 0) {
            Category parent = categoryRepository.findByIdActive(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            
            // Check parent không bị soft delete
            if (parent.getDeletedAt() != null) {
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            }

            category.setParentCategory(parent);
            if (parent.getChildCategories() != null) {
                parent.getChildCategories().add(category);
            }
        }

        Category savedCategory = categoryRepository.save(category);
        log.info("Category created: {} (Parent: {})", savedCategory.getCategoryId(), 
                 request.getParentId() == null ? "None" : request.getParentId());
        
        return categoryMapper.toResponse(savedCategory);
    }

    /**
     * Lấy tất cả categories (chỉ những chưa bị soft delete)
     * Kết quả sắp xếp theo cấu trúc cây (root → children)
     */
    public List<CategoryResponse> getAll() {
        List<Category> rootCategories = categoryRepository.findAllRootCategories();

        return rootCategories.stream()
                .map(this::buildCategoryTree)
                .toList();
    }

    private CategoryResponse buildCategoryTree(Category category) {
        CategoryResponse response = categoryMapper.toResponse(category);

        List<Category> childCategories =
                categoryRepository.findChildCategories(category.getCategoryId());

        List<CategoryResponse> children = childCategories.stream()
                .map(this::buildCategoryTree)
                .toList();

        response.setChildren(children);

        return response;
    }

    /**
     * Lấy category theo ID
     */
    public CategoryResponse getById(Integer id) {
        Category category = categoryRepository.findByIdActive(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        
        return categoryMapper.toResponse(category);
    }

    /**
     * Lấy tất cả category con của một parent
     */
    public List<CategoryResponse> getChildCategories(Integer parentId) {
        // Check parent tồn tại
        categoryRepository.findByIdActive(parentId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        List<Category> children = categoryRepository.findChildCategories(parentId);
        
        return children.stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    /**
     * Soft delete category (bao gồm tất cả children)
     */
    public boolean delete(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (category.getDeletedAt() != null) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_DELETED);
        }

        // Soft delete category này
        category.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(category);

        // Soft delete tất cả children categories
        deleteChildrenRecursively(category.getCategoryId());

        log.info("Category deleted (soft): {} and its children", id);
        return true;
    }

    /**
     * Recursive delete children
     */
    private void deleteChildrenRecursively(Integer parentId) {
        List<Category> children = categoryRepository.findChildCategories(parentId);
        
        for (Category child : children) {
            child.setDeletedAt(LocalDateTime.now());
            categoryRepository.save(child);
            
            // Recursively delete grandchildren
            deleteChildrenRecursively(child.getCategoryId().intValue());
        }
    }

    /**
     * Update category
     */
    public CategoryResponse update(Integer id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (category.getDeletedAt() != null) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Update name
        if (request.getCategoryName() != null && !request.getCategoryName().isBlank()) {
            category.setCategoryName(request.getCategoryName());
        }

        // Update parent category
        if (request.getParentId() != null) {
            if (request.getParentId() == 0 || request.getParentId() < 0) {
                // Unset parent (make it root)
                category.setParentCategory(null);
            } else {
                // Check circular reference (parent không được là chính category này hoặc children của nó)
                if (request.getParentId().equals(id)) {
                    throw new AppException(ErrorCode.INVALID_PARENT_CATEGORY);
                }

                if (isCircularReference(id, request.getParentId())) {
                    throw new AppException(ErrorCode.INVALID_PARENT_CATEGORY);
                }

                Category parent = categoryRepository.findById(request.getParentId())
                        .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

                if (parent.getDeletedAt() != null) {
                    throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
                }

                category.setParentCategory(parent);
            }
        }

        Category updated = categoryRepository.save(category);
        log.info("Category updated: {}", id);
        
        return categoryMapper.toResponse(updated);
    }

    /**
     * Check circular reference
     * Kiểm tra xem parentId có phải là descendant của categoryId không
     */
    private boolean isCircularReference(Integer categoryId, Integer potentialParentId) {
        if (potentialParentId == null || potentialParentId <= 0) {
            return false;
        }

        Set<Integer> descendants = new HashSet<>();
        collectDescendants(categoryId, descendants);
        
        return descendants.contains(potentialParentId);
    }

    /**
     * Collect tất cả descendants của một category
     */
    private void collectDescendants(Integer categoryId, Set<Integer> descendants) {
        List<Category> children = categoryRepository.findChildCategories(categoryId);
        
        for (Category child : children) {
            int childId = child.getCategoryId().intValue();
            descendants.add(childId);
            collectDescendants(childId, descendants);
        }
    }

    /**
     * Check category name đã tồn tại
     */
    private boolean isCategoryNameExists(String categoryName) {
        // TODO: Thêm query vào repository để kiểm tra
        return false;
    }

    /**
     * Restore category từ soft delete
     */
    public CategoryResponse restore(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (category.getDeletedAt() == null) {
            throw new AppException(ErrorCode.CATEGORY_NOT_DELETED);
        }

        category.setDeletedAt(null);
        Category restored = categoryRepository.save(category);
        log.info("Category restored: {}", id);
        
        return categoryMapper.toResponse(restored);
    }
}
