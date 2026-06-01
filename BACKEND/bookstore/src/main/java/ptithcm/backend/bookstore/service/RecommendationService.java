package ptithcm.backend.bookstore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.RecommendationItemDto;
import ptithcm.backend.bookstore.dto.response.BookResponse;
import ptithcm.backend.bookstore.dto.response.RecommendedBookResponse;
import ptithcm.backend.bookstore.dto.response.RecommendationServiceResponse;
import ptithcm.backend.bookstore.dto.response.UserResponse;
import ptithcm.backend.bookstore.entity.Book;
import ptithcm.backend.bookstore.exception.AppException;
import ptithcm.backend.bookstore.exception.ErrorCode;
import ptithcm.backend.bookstore.mapper.BookMapper;
import ptithcm.backend.bookstore.repository.BookRepository;
import ptithcm.backend.bookstore.utils.RecommendationClient;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationClient recommendationClient;
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final UserService userService;

    public List<RecommendedBookResponse> getPopularBooks(int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getPopularBooks(limit);

        return mapToRecommendedBookResponses(response);
    }

    public List<RecommendedBookResponse> recommendForUser(Long userId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getRecommendationsForUser(userId, limit);

        return mapToRecommendedBookResponses(response);
    }

    public List<RecommendedBookResponse> getSimilarBooks(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getSimilarBooks(bookId, limit);

        return mapToRecommendedBookResponses(response);
    }

    public List<RecommendedBookResponse> getFrequentlyBoughtTogether(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getFrequentlyBoughtTogether(bookId, limit);

        return mapToRecommendedBookResponses(response);
    }

    private List<RecommendedBookResponse> mapToRecommendedBookResponses(RecommendationServiceResponse response) {
        if (response == null || response.getRecommendations() == null) {
            return List.of();
        }

        List<Integer> bookIds = response.getRecommendations()
                .stream()
                .map(RecommendationItemDto::getBookId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        List<Book> books = bookRepository.findAllById(bookIds);

        Map<Integer, Book> bookMap = books.stream()
                .collect(Collectors.toMap(Book::getBookId, Function.identity(), (existing, replacement) -> existing));

        return response.getRecommendations()
                .stream()
                .map(item -> {
                    Book book = bookMap.get(item.getBookId());
                    if (book == null) {
                        return null;
                    }

                    BookResponse bookResponse = bookMapper.toResponse(book);
                    return RecommendedBookResponse.builder()
                            .book(bookResponse)
                            .score(item.getScore())
                            .reason(item.getReason())
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }

    public List<RecommendedBookResponse> recommendContentBased(int limit) {
        UserResponse user = userService.getMyInfoOrNull();
        if(user == null){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        RecommendationServiceResponse response =
                recommendationClient.getContentBasedRecommendations(user.getUserId(), limit);

        return mapToRecommendedBookResponses(response);
    }

    public List<RecommendedBookResponse> recommendCollaborative(int limit) {
        UserResponse user = userService.getMyInfoOrNull();
        if(user == null){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }


        RecommendationServiceResponse response =
                recommendationClient.getCollaborativeRecommendations(user.getUserId(),limit);

        return mapToRecommendedBookResponses(response);
    }

    public List<RecommendedBookResponse> recommendHybrid(int limit) {
        UserResponse user = userService.getMyInfoOrNull();
        if(user == null){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }


        RecommendationServiceResponse response =
                recommendationClient.getHybridRecommendations(user.getUserId(), limit);

        return mapToRecommendedBookResponses(response);
    }

    public List<RecommendedBookResponse> getRelatedBooks(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getRelatedBooks(bookId, limit);

        return mapToRecommendedBookResponses(response);
    }

    public List<RecommendedBookResponse> getRelatedBooksSimple(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getRelatedBooksSimple(bookId, limit);

        return mapToRecommendedBookResponses(response);
    }

    public Map<String, Object> getBookInfo(Integer bookId) {
        return recommendationClient.getBookInfo(bookId);
    }

    public Object searchBooks(String title, int limit) {
        return recommendationClient.searchByTitle(title, limit);
    }

    public Map<String, Object> trainRecommendationModels(boolean retrainCollaborative, boolean retrainContent) {
        return recommendationClient.trainModels(retrainCollaborative, retrainContent);
    }

    public Map<String, Object> getRecommendationStats() {
        return recommendationClient.getStats();
    }

    public Map<String, Object> checkRecommendationServiceHealth() {
        return recommendationClient.healthCheck();
    }
}
