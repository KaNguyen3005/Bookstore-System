package ptithcm.backend.bookstore.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import ptithcm.backend.bookstore.dto.response.RecommendationServiceResponse;

@Component
@RequiredArgsConstructor
public class RecommendationClient {

    private final RestClient recommendationRestClient;

    public RecommendationServiceResponse getPopularBooks(int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommendations/popular")
                        .queryParam("limit", limit)
                        .build())
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getRecommendationsForUser(Long userId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommendations/users/{userId}")
                        .queryParam("limit", limit)
                        .build(userId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getSimilarBooks(Integer bookId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommendations/books/{bookId}/similar")
                        .queryParam("limit", limit)
                        .build(bookId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getFrequentlyBoughtTogether(Integer bookId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommendations/books/{bookId}/frequently-bought-together")
                        .queryParam("limit", limit)
                        .build(bookId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getContentBasedRecommendations(Long userId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommendations/v2/users/{userId}/content-based")
                        .queryParam("limit", limit)
                        .build(userId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getCollaborativeRecommendations(Long userId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommendations/v3/users/{userId}/collaborative")
                        .queryParam("limit", limit)
                        .build(userId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }

    public RecommendationServiceResponse getHybridRecommendations(Long userId, int limit) {
        return recommendationRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommendations/v4/users/{userId}/hybrid")
                        .queryParam("limit", limit)
                        .build(userId))
                .retrieve()
                .body(RecommendationServiceResponse.class);
    }
}