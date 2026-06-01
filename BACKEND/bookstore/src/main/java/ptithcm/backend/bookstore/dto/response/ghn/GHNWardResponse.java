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
public class GHNWardResponse {
    @JsonProperty("WardCode")
    String wardCode;

    @JsonProperty("WardName")
    String wardName;

    @JsonProperty("DistrictID")
    Integer districtId;
}

