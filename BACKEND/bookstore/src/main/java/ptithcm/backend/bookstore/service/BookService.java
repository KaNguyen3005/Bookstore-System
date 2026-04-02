//package ptithcm.backend.bookstore.service;
//
//import jakarta.transaction.Transactional;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
//import ptithcm.backend.bookstore.dto.response.BookResponse;
//import ptithcm.backend.bookstore.entity.*;
//import ptithcm.backend.bookstore.exception.AppException;
//import ptithcm.backend.bookstore.exception.ErrorCode;
//import ptithcm.backend.bookstore.mapper.BookMapper;
//import ptithcm.backend.bookstore.repository.*;
//import java.util.ArrayList;
//import java.util.HashSet;
//import java.util.List;
//
//@Service
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//@RequiredArgsConstructor
//@Slf4j
//public class BookService {
//
//    CategoriesRepository categoriesRepository;
//    SupplierRepository supplierRepository;
//    AuthorRepository authorRepository;
//    PublisherRepository publisherRepository;
//    BookRepository bookRepository;
//    BookMapper bookMapper;
//    CloudinaryService cloudinaryService;
//
//    @Transactional // Rất quan trọng: Đảm bảo nếu lưu DB lỗi thì không bị rác dữ liệu
//    public BookResponse create(CreateBookRequest request) {
//        // 1. Khởi tạo Entity từ Request
//        log.info("Đã chạy xuống service tạo sách");
//        // 1. Validate Authors trước
//        List<Author> authors = authorRepository.findAllById(request.getAuthorIds());
//        if (authors.size() != request.getAuthorIds().size()) {
//            throw new AppException(ErrorCode.AUTHOR_NOT_FOUND);
//        }
//
//        // 2. Validate Supplier
//        Supplier supplier = supplierRepository.findById(request.getSupplierId())
//                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));
//
//        // 3. Validate Publisher
//        Publisher publisher = publisherRepository.findById(request.getPublisherId())
//                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
//
//        // 4. Validate Categories
//        List<Category> categories = categoriesRepository.findAllById(request.getCategoryIds());
//        if (categories.size() != request.getCategoryIds().size()) {
//            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
//        }
//
//        // 5. Tất cả hợp lệ → mới upload ảnh
//        if (request.getCoverImgFile() == null || request.getCoverImgFile().isEmpty()) {
//            throw new AppException(ErrorCode.UPLOAD_FAILED);
//        }
//
//        String imageUrl = cloudinaryService.uploadFile(request.getCoverImgFile(), "books");
//
//        Book book = bookMapper.toEntity(request);
//        book.builder()
//                .authors(new HashSet<>(authors))
//                .supplier(supplier)
//                .publisher(publisher)
//                .categories(new HashSet<>(categories))
//                .coverImageUrl(imageUrl)
//                .build();
//
//
//
//        // 6. Lưu và trả về Response
//        return bookMapper.toResponse(bookRepository.save(book));
//    }
//
//    public List<BookResponse> getAll() {
//        List<BookResponse> books = new ArrayList<>();
//        for(Book book : bookRepository.findAll()){
//            books.add(bookMapper.toResponse(book));
//        }
//        return books;
//    }
//}
