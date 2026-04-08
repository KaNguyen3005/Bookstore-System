# Test API Payment

## 1. Tạo Checkout Session

### Request - VNPAY
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

### Request - COD (mặc định)
```bash
curl -X POST http://localhost:8080/api/v1/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderId": 1
  }'
```

### Request - COD (explicit)
```bash
curl -X POST http://localhost:8080/api/v1/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderId": 1,
    "paymentMethod": "COD"
  }'
```

## 2. Xác nhận Payment

### Request
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

## Các PaymentMethod hợp lệ:
- `VNPAY`
- `MOMO`
- `ZALOPAY`
- `COD`

## Lưu ý:
- Nếu không truyền `paymentMethod`, sẽ mặc định là `COD`
- `paymentMethod` phải viết HOA: `VNPAY`, không phải `vnpay`
- Order phải có status `PENDING` mới có thể thanh toán
