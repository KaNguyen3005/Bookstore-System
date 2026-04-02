package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.BookImg;

@Repository
public interface BookImgRepository extends JpaRepository<BookImg, Integer> {
}
