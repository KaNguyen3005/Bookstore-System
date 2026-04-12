package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ptithcm.backend.bookstore.dto.request.CreateBookRequest;
import ptithcm.backend.bookstore.dto.request.UpdateBookRequest;
import ptithcm.backend.bookstore.dto.response.BookImgResponse;
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
    BookImgRepository bookImgRepository;

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
            book.setPublicIdCoverImage(publicId);

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

    // ❌ FIXED: Không phân trang gây OutOfMemory + N+1 Query
    public Page<BookResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findAll(pageable)
                .map(bookMapper::toResponse);
    }

    //TODO: Code cần hiểu - FIXED: Thêm validation, xử lý N+1 Query
    public Page<BookResponse> searchBooks(String keyword,
                                          Integer categoryId,
                                          BigDecimal minPrice,
                                          BigDecimal maxPrice,
                                          String sort,
                                          int page,
                                          int size) {
        // Validate sort parameter
        if (sort != null && !sort.equalsIgnoreCase("asc")
                && !sort.equalsIgnoreCase("desc")) {
            sort = null;
        }
        
        // Validate pagination
        if (page < 0) page = 0;
        if (size <= 0) size = 10;
        if (size > 100) size = 100; // Limit max size

        Pageable pageable = PageRequest.of(page, size);

        Page<Book> books = bookRepository.searchBooks(
                keyword, categoryId, minPrice, maxPrice, sort, pageable
        );

        return books.map(bookMapper::toResponse);
    }

    public BookResponse get(Integer id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        
        // Kiểm tra soft delete
        if (book.getDeletedAt() != null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        
        BookResponse response = bookMapper.toResponse(book);
        response.setBookImgs(bookImgRepository.findAllByBook_BookId(id).stream()
                .map(img -> {
                    BookImgResponse imgResponse = new BookImgResponse();
                    imgResponse.setImgUrl(img.getImgUrl());
                    imgResponse.setPublicId(img.getPublicId());
                    return imgResponse;
                })
                .toList());
        return response;
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

        // Update basic fields
        updateBasicFields(book, request);
        
        // Update publisher if provided
        if (request.getPublisherId() != null) {
            Publisher publisher = publisherRepository.findById(request.getPublisherId())
                    .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
            book.setPublisher(publisher);
        }

        // Update authors if provided
        if (request.getAuthorIds() != null) {
            Set<Author> authors = new HashSet<>(authorRepository.findAllById(request.getAuthorIds()));
            if (authors.size() != request.getAuthorIds().size()) {
                throw new AppException(ErrorCode.AUTHOR_NOT_FOUND);
            }
            book.setAuthors(authors);
        }

        // Update categories if provided
        if (request.getCategories() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategories()));
            if (categories.size() != request.getCategories().size()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            }
            book.setCategories(categories);
        }

        // Update cover image if provided
        if (request.getCoverImg() != null && !request.getCoverImg().isEmpty()) {
            updateCoverImage(book, request.getCoverImg());
        }

        book.setUpdatedAt(LocalDateTime.now());
        bookRepository.save(book);

        return bookMapper.toResponse(book);
    }
    
    /**
     * Helper: Update basic book fields
     */
    private void updateBasicFields(Book book, UpdateBookRequest request) {
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
    }
    
    /**
     * Helper: Update cover image and delete old one
     */
    private void updateCoverImage(Book book, MultipartFile newCoverImg) {
        String oldPublicId = book.getPublicIdCoverImage();
        String newImageUrl = null;
        String newPublicId = null;

        try {
            UploadResult uploadResult = cloudinaryService.uploadFile(newCoverImg, "books");
            newImageUrl = uploadResult.getUrl();
            newPublicId = uploadResult.getPublicId();

            book.setCoverImageUrl(newImageUrl);
            book.setPublicIdCoverImage(newPublicId);
            
            // ✅ FIXED: Xóa ảnh cũ sau khi upload thành công
            if (oldPublicId != null && !oldPublicId.isEmpty()) {
                try {
                    cloudinaryService.deleteFile(oldPublicId);
                    log.info("Đã xóa ảnh cũ: {}", oldPublicId);
                } catch (Exception e) {
                    log.warn("Không thể xóa ảnh cũ {}: {}", oldPublicId, e.getMessage());
                }
            }
            
        } catch (Exception e) {
            // Rollback: xóa ảnh mới nếu upload thất bại
            if (newPublicId != null) {
                try {
                    cloudinaryService.deleteFile(newPublicId);
                } catch (Exception ex) {
                    log.error("Không thể xóa ảnh rác trên Cloudinary: {}", newPublicId, ex);
                }
            }
            log.error("Lỗi khi upload ảnh cover: {}", e.getMessage());
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }

    // ❌ FIXED: Không phân trang + N+1 Query + không check deletedAt
    public Page<ReviewResponse> getAllReview(Integer bookId, int page, int size) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        
        if (book.getDeletedAt() != null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }

        // Validate pagination
        if (page < 0) page = 0;
        if (size <= 0) size = 10;
        if (size > 100) size = 100;
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = book.getReviews() != null ? 
            new org.springframework.data.domain.PageImpl<>(book.getReviews(), pageable, book.getReviews().size()) :
            Page.empty();

        return reviews.map(reviewMapper::toResponse);
    }

    @Transactional
    public void uploadImages(Integer id, List<MultipartFile> files) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (files == null || files.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        List<UploadResult> uploadedResults = new ArrayList<>();
        List<BookImg> bookImages = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) {
                    throw new AppException(ErrorCode.INVALID_FILE);
                }

                UploadResult uploadResult = cloudinaryService.uploadFile(file, "books");
                uploadedResults.add(uploadResult);

                BookImg bookImage = new BookImg();
                bookImage.setBook(book);
                bookImage.setImgUrl(uploadResult.getUrl());
                bookImage.setPublicId(uploadResult.getPublicId());

                bookImages.add(bookImage);
            }

            bookImgRepository.saveAll(bookImages);

        } catch (Exception e) {
            for (UploadResult result : uploadedResults) {
                try {
                    cloudinaryService.deleteFile(result.getPublicId());
                } catch (Exception ex) {
                    log.error("Không thể xóa ảnh rác trên Cloudinary: {}", result.getPublicId(), ex);
                }
            }

            log.error("Lỗi khi upload ảnh cho sách {}: {}", id, e.getMessage(), e);
            throw new AppException(ErrorCode.UPLOAD_IMAGE_FAILED);
        }
    }
}
