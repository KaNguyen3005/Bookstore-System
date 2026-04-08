# API Hướng Dẫn Sử Dụng - Payment APIs

## Tổng Quan

Hệ thống payment hỗ trợ 4 phương thức thanh toán:
- **VNPAY**: Online payment (Sandbox)
- **MOMO**: Online payment
- **ZALOPAY**: Online payment
- **COD**: Thanh toán khi nhận hàng (Không cần redirect)

---

## API 1: Tạo Session Thanh Toán (Checkout)

### Endpoint
```
POST /api/v1/payments/checkout
```

### Mô Tả
- Tạo một session thanh toán mới cho order
- Trả về URL redirect nếu là online payment (VNPAY, MOMO, ZALOPAY)
- Trả về thông báo nếu là COD (thanh toán khi nhận hàng)

### Request Body
```json
{
  "orderId": 1,
  "paymentMethod": "VNPAY",
  "bankCode": "NCB",
  "language": "vn",
  "returnUrl": "https://yourapp.com/payment/return",
  "cancelUrl": "https://yourapp.com/payment/cancel"
}
```

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | Long | Yes | ID của order cần thanh toán |
| paymentMethod | String | Yes | Phương thức thanh toán: VNPAY, MOMO, ZALOPAY, COD |
| bankCode | String | No | Mã ngân hàng (chỉ dùng với VNPAY) |
| language | String | No | Ngôn ngữ: vn (mặc định), en |
| returnUrl | String | No | URL để quay lại sau thanh toán thành công |
| cancelUrl | String | No | URL nếu hủy thanh toán |

### Response - Trường Hợp Online Payment (VNPAY)
```json
{
  "code": "1000",
  "message": "Success",
  "result": {
    "paymentId": 5,
    "paymentMethod": "VNPAY",
    "redirectUrl": "https://sandbox.vnpayment.vn/paygate/payment.html?vnp_TxnRef=1&vnp_Amount=1000000&vnp_OrderInfo=Order_1",
    "message": null
  }
}
```

### Response - Trường Hợp COD
```json
{
  "code": "1000",
  "message": "Success",
  "result": {
    "paymentId": 6,
    "paymentMethod": "COD",
    "redirectUrl": null,
    "message": "Thanh toán khi nhận hàng - COD"
  }
}
```

### Cách Sử Dụng
```javascript
// Frontend JavaScript
fetch('/api/v1/payments/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    orderId: 1,
    paymentMethod: 'VNPAY',
    bankCode: 'NCB',
    language: 'vn',
    returnUrl: 'https://yourapp.com/payment/return',
    cancelUrl: 'https://yourapp.com/payment/cancel'
  })
})
.then(response => response.json())
.then(data => {
  if (data.result.redirectUrl) {
    // Redirect to payment gateway
    window.location.href = data.result.redirectUrl;
  } else {
    // COD - không cần redirect
    alert(data.result.message);
  }
})
.catch(error => console.error('Error:', error));
```

### Status Code
- **200 OK**: Tạo session thành công
- **400 Bad Request**: Dữ liệu không hợp lệ
- **404 Not Found**: Order không tìm thấy
- **409 Conflict**: Order không thể thanh toán

---

## API 2: Xác Nhận Thanh Toán (Confirm Payment)

### Endpoint
```
POST /api/v1/payments/confirm
```

### Mô Tả
- Xác nhận thanh toán thành công từ payment gateway
- Cập nhật trạng thái Payment và Order
- Được gọi sau khi user hoàn thành thanh toán hoặc từ webhook

### Request Body
```json
{
  "paymentId": 5,
  "transactionId": "VNP123456789",
  "status": "SUCCESS",
  "raw": "{\"vnp_ResponseCode\": \"00\", \"vnp_TransactionNo\": \"VNP123456789\"}"
}
```

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| paymentId | Long | Yes | ID của Payment từ response checkout |
| transactionId | String | Yes | Transaction ID từ payment gateway |
| status | String | Yes | SUCCESS hoặc FAILED |
| raw | String | No | JSON response từ gateway (để log) |

### Response - Success
```json
{
  "code": "1000",
  "message": "Payment confirmed successfully",
  "result": null
}
```

### Response - Error (Payment không tìm thấy)
```json
{
  "code": "8501",
  "message": "Payment not found",
  "result": null
}
```

### Cách Sử Dụng
```javascript
// Frontend - Sau khi VNPAY redirect về
const paymentId = 5;
const transactionId = urlParams.get('vnp_TransactionNo');
const responseCode = urlParams.get('vnp_ResponseCode'); // '00' = success

fetch('/api/v1/payments/confirm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    paymentId: paymentId,
    transactionId: transactionId,
    status: responseCode === '00' ? 'SUCCESS' : 'FAILED'
  })
})
.then(response => response.json())
.then(data => {
  if (data.code === '1000') {
    alert('Thanh toán thành công!');
  } else {
    alert('Lỗi: ' + data.message);
  }
})
.catch(error => console.error('Error:', error));
```

---

## Quy Trình Thanh Toán - Chi Tiết

### 1. Tạo Order
```
POST /api/v1/orders
→ Response: Order details (orderId, totalAmount, status: PENDING)
```

### 2. Tạo Session Thanh Toán
```
POST /api/v1/payments/checkout
Body: { orderId: 1, paymentMethod: "VNPAY", ... }
→ Response: { paymentId: 5, redirectUrl: "https://..." }
```

### 3. Redirect to Payment Gateway
```javascript
// If redirectUrl exists
window.location.href = response.redirectUrl;
```

### 4. User Completes Payment on Gateway

### 5. Confirm Payment
```
POST /api/v1/payments/confirm
Body: { paymentId: 5, transactionId: "...", status: "SUCCESS" }
→ Payment status: PENDING → SUCCESS
→ Order status: PENDING → CONFIRMED
```

---

## Error Handling

### Lỗi Common

| Error Code | Message | Giải Pháp |
|-----------|---------|----------|
| 2004 | User not found | Kiểm tra JWT token |
| 8001 | Order not found | OrderId không tồn tại |
| 8501 | Payment not found | PaymentId không tồn tại |
| 8502 | Payment already success | Đã thanh toán rồi |
| 9002 | Validation failed | Dữ liệu request không hợp lệ |

### Cách Xử Lý Lỗi
```javascript
fetch('/api/v1/payments/checkout', { ... })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.code !== '1000') {
      console.error('API Error:', data.message);
      // Handle error
    } else {
      // Handle success
    }
  })
  .catch(error => {
    console.error('Network or parsing error:', error);
  });
```

---

## Payment Status Transitions

```
Order Status Transitions:
PENDING → CONFIRMED (khi payment SUCCESS)
PENDING → CANCELLED (khi payment FAILED)

Payment Status Transitions:
PENDING → SUCCESS (xác nhận thành công)
PENDING → FAILED (xác nhận thất bại)
PENDING → CANCELLED (user hủy order)
```

---

## Testing

### Test Credentials (VNPAY Sandbox)
- **URL Sandbox**: https://sandbox.vnpayment.vn/
- **Test Card**: 4111111111111111
- **Expiry**: 12/25
- **OTP**: 123456

### cURL Examples

**1. Create Checkout Session**
```bash
curl -X POST http://localhost:8080/api/v1/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderId": 1,
    "paymentMethod": "VNPAY",
    "bankCode": "NCB",
    "language": "vn"
  }'
```

**2. Confirm Payment**
```bash
curl -X POST http://localhost:8080/api/v1/payments/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "paymentId": 5,
    "transactionId": "VNP123456789",
    "status": "SUCCESS"
  }'
```

---

## Security Notes

✅ Luôn sử dụng HTTPS trong production
✅ Verify transaction từ payment gateway webhook
✅ Không lưu sensitive payment data trên client
✅ Validate amount trước khi confirm payment
✅ Implement idempotency key để tránh duplicate payments


