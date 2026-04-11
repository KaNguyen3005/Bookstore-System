package ptithcm.backend.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication
public class BookstoreApplication {
	public static void main(String[] args) {
        System.out.println("Hello world!");
		SpringApplication.run(BookstoreApplication.class, args);
	}
}
