package ptithcm.backend.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptithcm.backend.bookstore.entity.Publisher;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, String> {
}
