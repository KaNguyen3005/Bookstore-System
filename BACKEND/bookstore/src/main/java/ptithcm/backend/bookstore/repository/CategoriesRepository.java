package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ptithcm.backend.bookstore.entity.Categories;

public interface CategoriesRepository extends JpaRepository<Categories, String> {
}