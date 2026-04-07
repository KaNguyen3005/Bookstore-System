package ptithcm.backend.bookstore.dto.request;

public class OrderItemRequest {
    String bookId;
    int quantity;
    Long price;       // giá tại thời điểm mua
    String note;      // ghi chú
}
