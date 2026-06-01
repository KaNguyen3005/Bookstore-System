package ptithcm.backend.bookstore.dto.response.ghn;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GHNProvinceResponse {
    @JsonProperty("ProvinceID")
    Integer provinceId;

    @JsonProperty("ProvinceName")
    String provinceName;
}

