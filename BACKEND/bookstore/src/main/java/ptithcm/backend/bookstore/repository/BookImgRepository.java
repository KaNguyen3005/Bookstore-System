package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.BookImg;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookImgRepository extends JpaRepository<BookImg, Integer> {
    List<BookImg> findAllByBook_BookId(Integer bookId);
}
