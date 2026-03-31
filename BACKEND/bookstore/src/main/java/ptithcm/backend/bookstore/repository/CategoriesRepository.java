package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ptithcm.backend.bookstore.entity.Category;

public interface CategoriesRepository extends JpaRepository<Category, String> {
}