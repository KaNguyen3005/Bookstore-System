package ptithcm.backend.bookstore.dto;

import jakarta.persistence.GeneratedValue;
import org.springframework.data.annotation.Id;

public class Customer {
    @Id
    @GeneratedValue(strategy = )
    private String customerId;
}
