package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    /**
     * Lấy tất cả category cha (parentCategory = null)
     */
    @Query("SELECT c FROM Category c WHERE c.parentCategory IS NULL AND c.deletedAt IS NULL")
    List<Category> findAllRootCategories();
    
    /**
     * Lấy tất cả category con của một parent
     */
    @Query("SELECT c FROM Category c WHERE c.parentCategory.categoryId = :parentId AND c.deletedAt IS NULL")
    List<Category> findChildCategories(@Param("parentId") Integer parentId);
    
    /**
     * Lấy category theo ID (check soft delete)
     */
    @Query("SELECT c FROM Category c WHERE c.categoryId = :categoryId AND c.deletedAt IS NULL")
    Optional<Category> findByIdActive(@Param("categoryId") Integer categoryId);
    
    /**
     * Lấy tất cả category không bị soft delete
     */
    @Query("SELECT c FROM Category c WHERE c.deletedAt IS NULL")
    List<Category> findAllActive();
}
