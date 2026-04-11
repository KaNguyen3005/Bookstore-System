package ptithcm.backend.bookstore.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GHNCreateOrderRequest {
    Integer payment_type_id;
    String note;
    String required_note;

    String from_name;
    String from_phone;
    String from_address;
    String from_ward_name;
    String from_district_name;
    String from_province_name;

    String to_name;
    String to_phone;
    String to_address;
    String to_ward_name;
    String to_district_name;
    String to_province_name;

    Integer weight;
    Integer length;
    Integer width;
    Integer height;
    Integer service_type_id;

    List<GHNItemRequest> items;
}