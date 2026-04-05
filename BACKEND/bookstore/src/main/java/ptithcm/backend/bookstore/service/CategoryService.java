package ptithcm.backend.bookstore.service;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateCategoryRequest;
import ptithcm.backend.bookstore.dto.request.UpdateCategoryRequest;
import ptithcm.backend.bookstore.dto.response.CategoryResponse;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Category;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.CategoryMapper;
import ptithcm.backend.bookstore.repository.CategoryRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    private final CategoryRepository categoryRepository;

    CategoryMapper categoryMapper;

    public CategoryResponse create(CreateCategoryRequest request){
        Category category = categoryMapper.toEntity(request);

        if (request.getParentId() != -1) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

            category.setParentCategory(parent);
        }

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getAll(){
        List<CategoryResponse> categories = new ArrayList<>();
        for(Category category : categoryRepository.findAll()){
            categories.add(categoryMapper.toResponse(category));
        }
        return categories;
    }

    public boolean delete(Integer id){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryRepository.delete(category);
        return true;
    }

    public CategoryResponse update(Integer id, UpdateCategoryRequest request){
        Category category  = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (request.getCategoryName() != null) {
            category.setCategoryName(request.getCategoryName());
        }

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

            category.setParentCategory(parent);
        }

        return categoryMapper.toResponse(categoryRepository.save(category));
    }
}
