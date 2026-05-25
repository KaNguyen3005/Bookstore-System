package ptithcm.backend.bookstore.service;


import ptithcm.backend.bookstore.utils.AppTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.entity.InteractEvent;
import ptithcm.backend.bookstore.entity.User;
import ptithcm.backend.bookstore.enums.InteractEventType;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.repository.BookRepository;
import ptithcm.backend.bookstore.repository.InteractEventRepository;
import ptithcm.backend.bookstore.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InteractEventService {

    private final InteractEventRepository interactEventRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public void recordEvent(Long userId, Integer bookId, InteractEventType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        InteractEvent event = InteractEvent.builder()
                .customer(user)
                .book(book)
                .eventType(type.name())
                .value(type.getScore())
                .eventTime(AppTime.now())
                .build();

        interactEventRepository.save(event);
    }

    public void recordViewBookEvent(Long userId, Integer bookId) {
        LocalDateTime thirtyMinutesAgo = AppTime.now().minusMinutes(30);

        boolean exists = interactEventRepository
                .existsByCustomer_UserIdAndBook_BookIdAndEventTypeAndEventTimeAfter(
                        userId,
                        bookId,
                        InteractEventType.VIEW_BOOK.name(),
                        thirtyMinutesAgo
                );

        if (exists) {
            return;
        }

        recordEvent(userId, bookId, InteractEventType.VIEW_BOOK);
    }
}