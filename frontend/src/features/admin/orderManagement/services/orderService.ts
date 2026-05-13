import axiosClient from "../../../../services/axiosClient";
import type { Order, OrderStatus } from "../types/order";

export interface OrdersResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const unwrap = (data: any) => data?.result ?? data?.data ?? data;

const normalizeStatus = (status: any): OrderStatus => {
  const normalized = String(status ?? "").toUpperCase();
  const aliases: Record<string, OrderStatus> = {
    CANCEL: "CANCELLED",
    CANCELED: "CANCELLED",
    CONFIRM: "CONFIRMED",
    APPROVED: "CONFIRMED",
    CREATED: "PENDING",
  };

  return (aliases[normalized] ?? normalized ?? "PENDING") as OrderStatus;
};

const toNumber = (value: any, fallback = 0) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const normalizeVatRate = (value: any) => {
  const rate = toNumber(value, 0);

  return rate > 1 ? rate / 100 : rate;
};

const normalizeOrderItem = (item: any) => {
  const quantity = toNumber(
    item.quantity ?? item.qty ?? item.bookQuantity ?? item.orderQuantity,
    0,
  );
  const rawUnitPrice =
    item.unitPrice ??
    item.unit_price ??
    item.price ??
    item.book?.price ??
    item.book?.sellingPrice ??
    item.book?.selling_price ??
    0;
  const rawLineTotal =
    item.lineTotal ??
    item.line_total ??
    item.subtotal ??
    item.total ??
    item.totalPrice ??
    item.total_price;
  const price = toNumber(rawUnitPrice, 0);
  const lineTotal =
    rawLineTotal !== undefined && rawLineTotal !== null
      ? toNumber(rawLineTotal, price * quantity)
      : price * quantity;

  return {
    ...item,
    bookId: item.bookId ?? item.book_id ?? item.book?.bookId ?? item.book?.id,
    bookTitle:
      item.bookTitle ??
      item.book_title ??
      item.title ??
      item.productName ??
      item.bookName ??
      item.book?.title ??
      item.book?.bookTitle ??
      "Sản phẩm",
    quantity,
    price,
    lineTotal,
    rate: toNumber(item.rate, 0),
    content: item.content ?? "",
    unit: item.unit ?? "",
  };
};

const normalizeOrder = (order: any): Order => {
  const source = unwrap(order) ?? {};
  const items =
    source.items ??
    source.orderItems ??
    source.order_items ??
    source.orderDetails ??
    source.orderItemResponses ??
    source.orderItemResponseList ??
    [];
  const amount = source.amount ?? {};
  const customer = source.customer ?? source.user ?? {};
  const staff = source.staff ?? {};

  return {
    ...source,
    orderId: source.orderId ?? source.order_id ?? source.id,
    vatRate: normalizeVatRate(source.vatRate ?? source.vat_rate ?? 0),
    vatAmount: toNumber(source.vatAmount ?? source.vat_amount ?? 0),
    voucher: source.voucher,
    totalAmount: toNumber(
      source.totalAmount ?? source.total ?? amount.total ?? 0,
    ),
    subtotal: toNumber(source.subtotal ?? amount.subtotal ?? 0),
    items: Array.isArray(items) ? items.map(normalizeOrderItem) : [],
    staffName:
      source.staffName ??
      source.staff_name ??
      staff.fullName ??
      staff.name ??
      "",
    customerName:
      source.customerName ??
      source.customer_name ??
      customer.fullName ??
      customer.name ??
      source.receiverName ??
      "",
    status: normalizeStatus(
      source.status ?? source.orderStatus ?? source.order_status,
    ),
    shippingStatus:
      source.shippingStatus ?? source.shipping_status ?? "PICKING_UP",
    paymentStatus: source.paymentStatus ?? source.payment_status ?? "PENDING",
    createdAt: source.createdAt ?? source.created_at ?? "",
    updatedAt: source.updatedAt ?? source.updated_at ?? "",
    deletedAt: source.deletedAt ?? source.deleted_at,
  };
};

const normalizeOrdersResponse = (data: any): OrdersResponse => {
  const source = unwrap(data);
  const contentSource = Array.isArray(source)
    ? source
    : source?.content ?? source?.data ?? [];
  const content = Array.isArray(contentSource)
    ? contentSource.map(normalizeOrder)
    : [];

  return {
    content,
    totalPages: Number(source?.totalPages ?? 1),
    totalElements: Number(source?.totalElements ?? content.length),
    size: Number(source?.size ?? content.length),
    number: Number(source?.number ?? 0),
  };
};

const withOrderDetails = async (response: OrdersResponse) => {
  const content = await Promise.all(
    response.content.map(async (order) => {
      if ((order.items?.length ?? 0) > 0 || !order.orderId) {
        return order;
      }

      try {
        const detail = await orderService.getOrderById(order.orderId);

        return {
          ...order,
          ...detail,
          items: detail.items?.length ? detail.items : order.items,
        };
      } catch (error) {
        console.error("Failed to fetch admin order detail:", error);
        return order;
      }
    }),
  );

  return {
    ...response,
    content,
  };
};

export const orderService = {
  // ================= GET ORDERS (PAGINATED) =================
  getOrders: async (params: {
    page?: number;
    size?: number;
    status?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OrdersResponse> => {
    const response = await axiosClient.get("/orders", {
      params,
    });
    return withOrderDetails(normalizeOrdersResponse(response.data));
  },

  // ================= GET ORDER DETAIL =================
  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosClient.get(`/orders/${id}`);
    return normalizeOrder(response.data);
  },

  // ================= APPROVE ORDER =================
  approveOrder: async (id: number): Promise<Order> => {
    try {
      const response = await axiosClient.put(`/orders/${id}/approve`, {});

      return normalizeOrder(response.data);
    } catch (error: any) {
      console.error(
        "APPROVE ORDER ERROR:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  // ================= CANCEL ORDER =================
  cancelOrder: async (id: number): Promise<Order> => {
    try {
      const response = await axiosClient.post(`/orders/${id}/cancel`);
      return normalizeOrder(response.data);
    } catch (error: any) {
      console.error(
        "CANCEL ORDER ERROR:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // ================= UPDATE ORDER STATUS =================
  updateOrderStatus: async (
    id: number,
    status: OrderStatus,
  ): Promise<Order> => {
    const response = await axiosClient.patch(`/orders/${id}`, {
      status,
    });

    return normalizeOrder(response.data);
  },

  // ================= EXPORT EXCEL =================
  exportOrders: async (): Promise<Blob> => {
    const response = await axiosClient.get("/orders/export", {
      responseType: "blob",
    });

    return response.data;
  },
};

export default orderService;
