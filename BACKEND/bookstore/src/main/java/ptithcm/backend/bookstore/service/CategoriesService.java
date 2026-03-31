package ptithcm.backend.bookstore.service;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateCategoriesRequest;
import ptithcm.backend.bookstore.dto.response.CategoriesResponse;
import ptithcm.backend.bookstore.entity.Category;
import ptithcm.backend.bookstore.mapper.CategoriesMapper;
import ptithcm.backend.bookstore.repository.CategoriesRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class CategoriesService {

    CategoriesRepository categoriesRepository;
    CategoriesMapper categoriesMapper;

    public CategoriesResponse create(CreateCategoriesRequest createCategoriesRequest){
        Category category = categoriesMapper.toEntity(createCategoriesRequest);
        return categoriesMapper.toResponse(categoriesRepository.save(category));
    }

    public List<CategoriesResponse> getAll(){
        List<CategoriesResponse> categories = new ArrayList<>();
        for(Category category : categoriesRepository.findAll()){
            categories.add(categoriesMapper.toResponse(category));
        }
        return categories;
    }

}
