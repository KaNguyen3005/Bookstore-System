package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Author;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Integer> {
}
