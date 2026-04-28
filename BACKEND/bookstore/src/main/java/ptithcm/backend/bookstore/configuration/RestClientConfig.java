package ptithcm.backend.bookstore.configuration;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.builder().build();
    }

    @Bean
    public RestClient recommendationRestClient(
            @Value("${recommendation.service.url}") String recommendationServiceUrl
    ) {
        return RestClient.builder()
                .baseUrl(recommendationServiceUrl)
                .build();
    }
}