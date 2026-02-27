package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.entity.Author;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.Categories;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.BookMapper;
import ptithcm.backend.bookstore.repository.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

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
    CloudinaryService cloudinaryService;

    @Transactional // Rất quan trọng: Đảm bảo nếu lưu DB lỗi thì không bị rác dữ liệu
    public BookResponse create(CreateBookRequest request) {
        // 1. Khởi tạo Entity từ Request
        Book book = bookMapper.toEntity(request);
        log.error("Đã chạy xuống service");

        if(request.getCoverImgFile() == null){
            log.error("File is null");
        }
        String ImageUrl = cloudinaryService.uploadFile(request.getCoverImgFile(), "books");

        // 3. Xử lý Authors (Kiểm tra tồn tại)
        List<Author> authors = authorRepository.findAllById(request.getAuthorIds());

        if (authors.size() != request.getAuthorIds().size()) {
            throw new AppException(ErrorCode.AUTHOR_NOT_FOUND);
        }
        book.setAuthors(new HashSet<>(authors));

        // 4. Xử lý Supplier & Publisher (Sử dụng Optional hợp lý)
        book.setSupplier(supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND)));

        book.setPublisher(publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND)));

        // 5. Xử lý Categories
        List<Categories> categories = categoriesRepository.findAllById(request.getCategoryIds());

        if (categories.size() != request.getCategoryIds().size()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        book.setCategories(new HashSet<>(categories));

        // 6. Lưu và trả về Response
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
