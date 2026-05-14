export const FALLBACK_BOOK_IMAGE = "/images/book-placeholder.svg";

export const formatPrice = (value: number) => {
  return (Number(value || 0)).toLocaleString("vi-VN");
};

export const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    CREATED: "Chờ xác nhận",
    PENDING: "Chờ xác nhận",
    PENDING_PAYMENT: "Chờ thanh toán",

    CONFIRMED: "Chờ lấy hàng",
    PROCESSING: "Chờ lấy hàng",
    PICKING_UP: "Chờ lấy hàng",

    SHIPPING: "Đang giao hàng",

    DELIVERED: "Đã giao",
    COMPLETED: "Đã giao",

    RETURNED: "Trả hàng",
    REFUNDED: "Đã hoàn tiền",

    FAILED: "Thanh toán thất bại",
    CANCELLED: "Đã hủy",
  };

  return map[status] || status;
};

export const normalizeOrders = (ordersResponse: any) => {
  const rawOrders =
    ordersResponse?.result ??
    ordersResponse ??
    [];

  if (!Array.isArray(rawOrders)) return [];

  return rawOrders
    .map(normalizeOrder)
    .filter((order): order is NonNullable<typeof order> => Boolean(order));
};

export const normalizeOrder = (order: any) => {
  if (!order || typeof order !== "object") return null;

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  return {
    orderId: order.orderId ?? null,
    status: order.status ?? "UNKNOWN",

    totalAmount: Number(order.totalAmount ?? 0),
    subtotal: Number(order.subtotal ?? 0),
    vatAmount: Number(order.vatAmount ?? 0),
    vatRate: Number(order.vatRate ?? 0),

    items: items.map((item: any, index: number) => {
      const bookImg =
        item?.bookImgs?.[0]?.imgUrl ?? FALLBACK_BOOK_IMAGE;

      return {
        itemId:
          item?.itemId ??
          item?.bookId ??
          `${order.orderId ?? "order"}-${index}`,

        bookId: item?.bookId ?? null,

        title: item?.bookTitle ?? "Sản phẩm",

        image: bookImg,

        quantity: Number(item?.quantity ?? 0),
        price: Number(item?.price ?? 0),

        hasReview: Boolean(item?.hasReview ?? false),
      };
    }),
  };
};