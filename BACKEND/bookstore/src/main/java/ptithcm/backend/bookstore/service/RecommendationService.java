package ptithcm.backend.bookstore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ptithcm.backend.bookstore.dto.request.RecommendationItemDto;
import ptithcm.backend.bookstore.dto.response.BookResponse;
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

    public List<BookResponse> getPopularBooks(int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getPopularBooks(limit);

        return mapToBookResponses(response);
    }

    public List<BookResponse> recommendForUser(Long userId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getRecommendationsForUser(userId, limit);

        return mapToBookResponses(response);
    }

    public List<BookResponse> getSimilarBooks(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getSimilarBooks(bookId, limit);

        return mapToBookResponses(response);
    }

    public List<BookResponse> getFrequentlyBoughtTogether(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getFrequentlyBoughtTogether(bookId, limit);

        return mapToBookResponses(response);
    }

    private List<BookResponse> mapToBookResponses(RecommendationServiceResponse response) {
        if (response == null || response.getRecommendations() == null) {
            return List.of();
        }

        List<Integer> bookIds = response.getRecommendations()
                .stream()
                .map(RecommendationItemDto::getBookId)
                .toList();

        List<Book> books = bookRepository.findAllById(bookIds);

        Map<Integer, Book> bookMap = books.stream()
                .collect(Collectors.toMap(Book::getBookId, Function.identity()));

        return response.getRecommendations()
                .stream()
                .map(item -> bookMap.get(item.getBookId()))
                .filter(Objects::nonNull)
                .map(bookMapper::toResponse)
                .toList();
    }

    public List<BookResponse> recommendContentBased(int limit) {
        UserResponse user = userService.getMyInfoOrNull();
        if(user == null){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        RecommendationServiceResponse response =
                recommendationClient.getContentBasedRecommendations(user.getUserId(), limit);

        return mapToBookResponses(response);
    }

    public List<BookResponse> recommendCollaborative(int limit) {
        UserResponse user = userService.getMyInfoOrNull();
        if(user == null){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }


        RecommendationServiceResponse response =
                recommendationClient.getCollaborativeRecommendations(user.getUserId(),limit);

        return mapToBookResponses(response);
    }

    public List<BookResponse> recommendHybrid(int limit) {
        UserResponse user = userService.getMyInfoOrNull();
        if(user == null){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }


        RecommendationServiceResponse response =
                recommendationClient.getHybridRecommendations(user.getUserId(), limit);

        return mapToBookResponses(response);
    }

    public List<BookResponse> getRelatedBooks(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getRelatedBooks(bookId, limit);

        return mapToBookResponses(response);
    }

    public List<BookResponse> getRelatedBooksSimple(Integer bookId, int limit) {
        RecommendationServiceResponse response =
                recommendationClient.getRelatedBooksSimple(bookId, limit);

        return mapToBookResponses(response);
    }

    public Map<String, Object> getBookInfo(Integer bookId) {
        return recommendationClient.getBookInfo(bookId);
    }

    public Map<String, Object> searchBooks(String title, int limit) {
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