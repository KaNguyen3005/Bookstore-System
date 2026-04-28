package ptithcm.backend.bookstore.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.CreateCartItemRequest;
import ptithcm.backend.bookstore.dto.request.UpdateCartItemRequest;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.dto.response.CartItemResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.BookCart;
import ptithcm.backend.bookstore.entity.Cart;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.enums.InteractEventType;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.BookMapper;
import ptithcm.backend.bookstore.repository.BookCartRepository;
import ptithcm.backend.bookstore.repository.BookRepository;
import ptithcm.backend.bookstore.repository.CartRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService {
    BookCartRepository bookCartRepository;
    CartRepository cartRepository;
    UserRepository userRepository;
    UserService userService;
    BookRepository bookRepository;
    BookMapper bookMapper;
    private final InteractEventService interactEventService;

    public List<CartItemResponse> getAll() {
        UserResponse userResponse = userService.getMyInfo();
        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Cart cart = cartRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        return cart.getBookCarts().stream()
                .map(bookCart -> CartItemResponse.builder()
                        .bookCartId(bookCart.getBookCartId())
                        .book(bookMapper.toResponse(bookCart.getBook()))
                        .quantity(bookCart.getQuantity())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse create(Integer bookId, CreateCartItemRequest request) {
        UserResponse userResponse = userService.getMyInfo();
        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Cart cart = cartRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        Optional<BookCart> existing = bookCartRepository.findByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);
        // Nếu đã tồn tại và tổng số lượng sau khi cộng thêm không vượt quá stock, cập nhật số lượng
        if (existing.isPresent() && existing.get().getBook().getStockQuantity() >= existing.get().getQuantity() + request.getQuantity()) {
            BookCart bookCart = existing.get();
            bookCart.setQuantity(bookCart.getQuantity() + request.getQuantity());
            return CartItemResponse.builder()
                    .book(bookMapper.toResponse(bookCart.getBook()))
                    .quantity(bookCart.getQuantity())
                    .build();
        } else {
            BookCart bookCart = BookCart.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(request.getQuantity())
                    .build();
            if(user != null){
                interactEventService.recordEvent(user.getUserId(), book.getBookId(), InteractEventType.VIEW_BOOK);
            }
            bookCartRepository.save(bookCart);
            return CartItemResponse.builder()
                    .book(bookMapper.toResponse(bookCart.getBook()))
                    .quantity(request.getQuantity())
                    .build();
        }
    }

    @Transactional
    public CartItemResponse update(Long bookCartId, UpdateCartItemRequest request) {
        UserResponse userResponse = userService.getMyInfo();
        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        BookCart bookCart = bookCartRepository.findById(bookCartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!bookCart.getCart().getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        bookCart.setQuantity(request.getQuantity());
        bookCartRepository.save(bookCart);

        return CartItemResponse.builder()
                .book(bookMapper.toResponse(bookCart.getBook()))
                .quantity(bookCart.getQuantity())
                .build();
    }

    @Transactional
    public void delete(Long bookCartId) {
        UserResponse userResponse = userService.getMyInfo();
        User user = userRepository.findById(userResponse.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        BookCart bookCart = bookCartRepository.findById(bookCartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!bookCart.getCart().getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        bookCartRepository.delete(bookCart);
    }
}
