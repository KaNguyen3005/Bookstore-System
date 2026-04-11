package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.request.UpdateBookRequest;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.dto.response.ReviewResponse;
import ptithcm.backend.bookstore.dto.response.UploadResult;
import ptithcm.backend.bookstore.entity.*;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.BookMapper;
import ptithcm.backend.bookstore.mapper.ReviewMapper;
import ptithcm.backend.bookstore.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class BookService {

    CategoryRepository categoryRepository;
    AuthorRepository authorRepository;
    PublisherRepository publisherRepository;
    BookRepository bookRepository;
    BookMapper bookMapper;
    CloudinaryService cloudinaryService;
    ReviewMapper reviewMapper;

    @Transactional
    public BookResponse create(CreateBookRequest request) {
        log.info("Đã chạy xuống service tạo sách");

        List<Author> authors = authorRepository.findAllById(request.getAuthorIds());
        if (authors.size() != request.getAuthorIds().size()) {
            throw new AppException(ErrorCode.AUTHOR_NOT_FOUND);
        }

        Publisher publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));

        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        if (request.getCoverImgFile() == null || request.getCoverImgFile().isEmpty()) {
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }

        String imageUrl = null;
        String publicId = null;

        try {
            // Nên trả về cả imageUrl và publicId
            UploadResult uploadResult = cloudinaryService.uploadFile(request.getCoverImgFile(), "books");
            imageUrl = uploadResult.getUrl();
            publicId = uploadResult.getPublicId();

            Book book = bookMapper.toEntity(request);
            book.setAuthors(new HashSet<>(authors));
            book.setPublisher(publisher);
            book.setCategories(new HashSet<>(categories));
            book.setCoverImageUrl(imageUrl);

            Book savedBook = bookRepository.save(book);
            return bookMapper.toResponse(savedBook);

        } catch (Exception e) {
            if (publicId != null) {
                try {
                    cloudinaryService.deleteFile(publicId);
                } catch (Exception ex) {
                    log.error("Không thể xóa ảnh rác trên Cloudinary: {}", publicId, ex);
                }
            }
            throw e;
        }
    }

    public List<BookResponse> getAll() {
        List<BookResponse> books = new ArrayList<>();
        for(Book book : bookRepository.findAll()){
            books.add(bookMapper.toResponse(book));
        }
        return books;
    }

    public List<BookResponse> searchBooks(String keyword, Integer categoryId, BigDecimal minPrice, BigDecimal maxPrice, String sort) {
        // Validate sort parameter
        if (sort != null && !sort.equalsIgnoreCase("asc")
                && !sort.equalsIgnoreCase("desc")) {
            sort = null; // Default to no specific sort
        }

        List<Book> books = bookRepository.searchBooks(keyword, categoryId, minPrice, maxPrice, sort);

        return books.stream()
                .map(bookMapper::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }
    public BookResponse get(Integer id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        return bookMapper.toResponse(book);
    }

    @Transactional
    public void delete(Integer id){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (book.getDeletedAt() != null) {
            throw new AppException(ErrorCode.BOOK_ALREADY_DELETED);
        }

        book.setDeletedAt(LocalDateTime.now());
    }

    @Transactional
    public BookResponse update(Integer id, UpdateBookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (book.getDeletedAt() != null) {
            throw new AppException(ErrorCode.BOOK_ALREADY_DELETED);
        }

        if (request.getTitle() != null) {
            book.setTitle(request.getTitle());
        }

        if (request.getIsbn() != null) {
            book.setIsbn(request.getIsbn());
        }

        if (request.getLanguage() != null) {
            book.setLanguage(request.getLanguage());
        }

        if (request.getDescription() != null) {
            book.setDescription(request.getDescription());
        }

        if (request.getPageCount() != null) {
            book.setPageCount(request.getPageCount());
        }

        if (request.getCoverType() != null) {
            book.setCoverType(request.getCoverType());
        }

        if (request.getStockQuantity() != null) {
            book.setStockQuantity(request.getStockQuantity());
        }

        if (request.getPrice() != null) {
            book.setPrice(request.getPrice());
        }

        if (request.getAvgRating() != null) {
            if (request.getAvgRating() < 0 || request.getAvgRating() > 5) {
                throw new AppException(ErrorCode.INVALID_AVG_RATING);
            }
            book.setAvgRating(request.getAvgRating());
        }

        if (request.getSalePercent() != null) {
            book.setSalePercent(request.getSalePercent());
        }

        if (request.getPublisherId() != null) {
            Publisher publisher = publisherRepository.findById(request.getPublisherId())
                    .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
            book.setPublisher(publisher);
        }

        if (request.getAuthorIds() != null) {
            Set<Author> authors = new HashSet<>(authorRepository.findAllById(request.getAuthorIds()));
            if (authors.size() != request.getAuthorIds().size()) {
                throw new AppException(ErrorCode.AUTHOR_NOT_FOUND);
            }
            book.setAuthors(authors);
        }

        if (request.getCategories() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategories()));
            if (categories.size() != request.getCategories().size()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            }
            book.setCategories(categories);
        }

        if (request.getCoverImg() != null && !request.getCoverImg().isEmpty()) {
            String imageUrl = null;
            String publicId = null;
            try {
                // Nên trả về cả imageUrl và publicId
                UploadResult uploadResult = cloudinaryService.uploadFile(request.getCoverImg(), "books");
                imageUrl = uploadResult.getUrl();
                publicId = uploadResult.getPublicId();

                book.setCoverImageUrl(imageUrl);
            } catch (Exception e) {
                if (publicId != null) {
                    try {
                        cloudinaryService.deleteFile(publicId);
                    } catch (Exception ex) {
                        log.error("Không thể xóa ảnh rác trên Cloudinary: {}", publicId, ex);
                    }
                }
                throw e;
            }
        }



        book.setUpdatedAt(LocalDateTime.now());

        return bookMapper.toResponse(book);
    }

    public List<ReviewResponse> getAllReview(Integer bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        List<ReviewResponse> reviews = new ArrayList<>();
        for (Review review : book.getReviews()) {
            reviews.add(reviewMapper.toResponse(review));
        }
        return reviews;
    }
}
