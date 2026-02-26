package ptithcm.backend.bookstore.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.Categories;
import ptithcm.backend.bookstore.mapper.BookMapper;
import ptithcm.backend.bookstore.repository.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class BookService {
    CategoriesRepository categoriesRepository;
    SupplierRepository supplierRepository;
    AuthorRepository authorRepository;
    PublisherRepository publisherRepository;
    BookRepository bookRepository;
    BookMapper bookMapper;

    public BookResponse create(CreateBookRequest createBookRequest){

        Book book = bookMapper.toEntity(createBookRequest);
        log.info("Title = " + createBookRequest.getTitle());
        if(!CollectionUtils.isEmpty(createBookRequest.getAuthorIds())){
            // Tìm tất cả authors có ID nằm trong Set
            List<Author> authors = authorRepository.findAllById(createBookRequest.getAuthorIds());

            if(authors.size() != createBookRequest.getAuthorIds().size()){
                throw new RuntimeException("Một số Author không tồn tại!");
            }

            book.setAuthors(new HashSet<>(authors));
        }

        if(StringUtils.hasText(createBookRequest.getSupplierId())){
            book.setSupplier(supplierRepository.findById(createBookRequest.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier không tồn tại!"))
            );
        }

        if(StringUtils.hasText(createBookRequest.getPublisherId())){
            book.setPublisher(publisherRepository.findById(createBookRequest.getPublisherId())
                    .orElseThrow(() -> new RuntimeException("Publisher không tồn tại!"))
            );
        }

        if(!CollectionUtils.isEmpty(createBookRequest.getCategoryIds())){
            // Tìm tất cả authors có ID nằm trong Set
            List<Categories> categories = categoriesRepository.findAllById(createBookRequest.getCategoryIds());

            if(categories.size() != createBookRequest.getCategoryIds().size()){
                throw new RuntimeException("Một số loại không tồn tại!");
            }

            book.setCategories(new HashSet<>(categories));
        }

        return bookMapper.toResponse(bookRepository.save(book));
    }

    public List<BookResponse> getAll() {
        List<BookResponse> books = new ArrayList<>();
        for(Book book : bookRepository.findAll()){
            books.add(bookMapper.toResponse(book));
        }
        return books;
    }
}
