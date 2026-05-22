package ptithcm.backend.bookstore.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import ptithcm.backend.bookstore.dto.response.RecommendationServiceResponse;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class RecommendationClient {

    private static final long POPULAR_FALLBACK_USER_ID = 2_147_483_647L;

    private final RestClient recommendationRestClient;

    public RecommendationServiceResponse getPopularBooks(int limit) {
        return getRecommendationsForUser(POPULAR_FALLBACK_USER_ID, limit);
    }

    public RecommendationServiceResponse getRecommendationsForUser(Long userId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/recommendations/user/{userId}")
                        .queryParam("top_n", limit)
                        .build(userId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getSimilarBooks(Integer bookId, int limit) {
        return getRelatedBooks(bookId, limit);
    }

    public RecommendationServiceResponse getFrequentlyBoughtTogether(Integer bookId, int limit) {
        return getRelatedBooks(bookId, limit);
    }

    public RecommendationServiceResponse getContentBasedRecommendations(Long userId, int limit) {
        return getRecommendationsForUser(userId, limit);
    }

    public RecommendationServiceResponse getCollaborativeRecommendations(Long userId, int limit) {
        return getRecommendationsForUser(userId, limit);
    }

    public RecommendationServiceResponse getHybridRecommendations(Long userId, int limit) {
        return getRecommendationsForUser(userId, limit);
    }

    public RecommendationServiceResponse getRelatedBooks(Integer bookId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/books/{bookId}/related")
                        .queryParam("top_n", limit)
                        .build(bookId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getRelatedBooksSimple(Integer bookId, int limit) {
        return getRelatedBooks(bookId, limit);
    }

    public Map<String, Object> getBookInfo(Integer bookId) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/books/{bookId}/info")
                        .build(bookId))
                .retrieve()
                .body(Map.class);
    }

    public Object searchByTitle(String title, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/books/search/by-title")
                        .queryParam("title", title)
                        .queryParam("limit", limit)
                        .build())
                .retrieve()
                .body(Object.class);
    }

    public Map<String, Object> trainModels(boolean retrainCollaborative, boolean retrainContent) {
        Map<String, Boolean> request = Map.of(
                "retrain_collaborative", retrainCollaborative,
                "retrain_content", retrainContent
        );
        return recommendationRestClient.post()
                .uri("/api/recommendations/train")
                .body(request)
                .retrieve()
                .body(Map.class);
    }

    public Map<String, Object> getStats() {
        return recommendationRestClient.get()
                .uri("/api/recommendations/stats")
                .retrieve()
                .body(Map.class);
    }

    public Map<String, Object> healthCheck() {
        return recommendationRestClient.get()
                .uri("/health")
                .retrieve()
                .body(Map.class);
    }
}
