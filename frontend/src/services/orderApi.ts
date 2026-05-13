import axiosClient from "./axiosClient";
import { mockOrders } from "../data/purchaseOrder";
import { bookApi } from "./bookApi";

const IS_MOCK = false;
const LOCAL_ORDERS_KEY_PREFIX = "bookstore_local_orders";
const FALLBACK_BOOK_IMAGE = "/images/book-placeholder.svg";
let booksForImageLookupPromise: Promise<any[]> | null = null;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalizeOrderStatus = (status: any) => {
  const normalized = String(status ?? "").toUpperCase();
  if (!normalized) return "UNKNOWN";

  const aliases: Record<string, string> = {
    PICKUP: "PICKING_UP",
    PICK_UP: "PICKING_UP",
    COMPLETED: "DELIVERED",
    RETURN: "RETURNED",
    CANCEL: "CANCELLED",
  };

  return aliases[normalized] ?? normalized;
};

const shouldFallbackEndpoint = (error: any) => {
  const status = error?.response?.status;
  return status === 404 || status === 405;
};

const getOrdersResponse = async (params?: Record<string, any>) => {
  try {
    return await axiosClient.get("/me/orders", { params });
  } catch (error) {
    if (shouldFallbackEndpoint(error)) {
      return axiosClient.get("/orders/my", { params });
    }

    throw error;
  }
};

const getOrderDetailResponse = async (orderId: number | string) => {
  try {
    return await axiosClient.get(`/orders/${orderId}`);
  } catch (error) {
    if (shouldFallbackEndpoint(error)) {
      return axiosClient.get(`/orders/my/${orderId}`);
    }

    throw error;
  }
};

const normalizeImageUrl = (url: string) => {
  const trimmed = url.trim();

  if (!trimmed || trimmed === "/images/book.png") {
    return FALLBACK_BOOK_IMAGE;
  }

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/images/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    const baseUrl = axiosClient.defaults.baseURL || window.location.origin;
    const apiOrigin = new URL(baseUrl, window.location.origin).origin;

    return `${apiOrigin}${trimmed}`;
  }

  return trimmed;
};

const resolveImageUrl = (...values: any[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return normalizeImageUrl(value);
    }

    if (Array.isArray(value)) {
      const image = resolveImageUrl(...value);

      if (image !== FALLBACK_BOOK_IMAGE) {
        return image;
      }
    }

    if (value && typeof value === "object") {
      const image = resolveImageUrl(
        value.coverImgUrl,
        value.coverImageUrl,
        value.thumbnailUrl,
        value.imageUrl,
        value.imgUrl,
        value.url,
        value.path,
      );

      if (image !== FALLBACK_BOOK_IMAGE) {
        return image;
      }
    }
  }

  return FALLBACK_BOOK_IMAGE;
};

const isFallbackImage = (image?: string) =>
  !image || normalizeImageUrl(image) === FALLBACK_BOOK_IMAGE;

const isPlaceholderTitle = (title?: string) =>
  !title || title === "Sản phẩm";

const normalizeLookupText = (value: any) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getBooksForImageLookup = async () => {
  if (!booksForImageLookupPromise) {
    booksForImageLookupPromise = bookApi
      .getBooks({ size: 1000 })
      .then((res: any) => res?.data ?? [])
      .catch((error) => {
        booksForImageLookupPromise = null;
        throw error;
      });
  }

  return booksForImageLookupPromise;
};

const getBookImage = (book: any) =>
  resolveImageUrl(
    book?.coverImgUrl,
    book?.coverImageUrl,
    book?.thumbnailUrl,
    book?.imageUrl,
    book?.bookImgs,
    book?.images,
  );

const findBookByTitle = (books: any[], title: string) => {
  const targetTitle = normalizeLookupText(title);

  if (!targetTitle || targetTitle === normalizeLookupText("Sản phẩm")) {
    return null;
  }

  const exactMatch = books.find(
    (book) => normalizeLookupText(book?.title) === targetTitle,
  );

  if (exactMatch) {
    return exactMatch;
  }

  return (
    books.find((book) => {
      const bookTitle = normalizeLookupText(book?.title);

      return (
        bookTitle &&
        (bookTitle.includes(targetTitle) || targetTitle.includes(bookTitle))
      );
    }) ?? null
  );
};

const normalizeOrderItem = (item: any) => ({
  ...item,
  itemId:
    item.itemId ??
    item.orderItemId ??
    item.id ??
    item.bookId ??
    item.book_id ??
    item.book?.id ??
    item.book?.bookId,
  bookId: item.bookId ?? item.book_id ?? item.book?.id ?? item.book?.bookId,
  bookTitle:
    item.bookTitle ??
    item.title ??
    item.book_title ??
    item.productName ??
    item.product_name ??
    item.bookName ??
    item.book_name ??
    item.name ??
    item.book?.bookTitle ??
    item.book?.title ??
    item.book?.name ??
    "Sản phẩm",
  quantity: Number(
    item.quantity ??
      item.qty ??
      item.bookQuantity ??
      item.orderQuantity ??
      0,
  ),
  price: Number(
    item.price ??
      item.unitPrice ??
      item.unit_price ??
      item.book?.price ??
      0,
  ),
  lineTotal: Number(item.lineTotal ?? item.line_total ?? 0),
  coverImgUrl: resolveImageUrl(
    item.coverImgUrl ??
    item.coverImageUrl ??
      item.thumbnailUrl ??
      item.imageUrl ??
      item.image,
    item.book?.coverImgUrl ??
      item.book?.coverImageUrl ??
      item.book?.thumbnailUrl ??
      item.book?.imageUrl,
    item.book?.bookImgs,
    item.book?.images,
  ),
});

const getLocalOrdersKey = () => {
  if (typeof window === "undefined") {
    return `${LOCAL_ORDERS_KEY_PREFIX}_guest`;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userKey = user?.userId ?? user?.id ?? user?.username ?? "guest";

    return `${LOCAL_ORDERS_KEY_PREFIX}_${userKey}`;
  } catch {
    return `${LOCAL_ORDERS_KEY_PREFIX}_guest`;
  }
};

const readLocalOrders = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(getLocalOrdersKey());
    const orders = raw ? JSON.parse(raw) : [];

    return Array.isArray(orders) ? orders.map(normalizeOrder) : [];
  } catch {
    return [];
  }
};

const writeLocalOrders = (orders: any[]) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    getLocalOrdersKey(),
    JSON.stringify(orders.slice(0, 20)),
  );
};

const normalizeOrder = (order: any) => {
  const source = order?.data ?? order ?? {};
  const items =
    source.items ??
    source.orderItems ??
    source.orderDetails ??
    source.orderItemResponses ??
    source.orderItemResponseList ??
    [];
  const amount = source.amount ?? {};

  return {
    ...source,
    orderId: source.orderId ?? source.id ?? source.order_id,
    status: normalizeOrderStatus(
      source.status ?? source.orderStatus ?? source.order_status,
    ),
    items: Array.isArray(items) ? items.map(normalizeOrderItem) : [],
    subtotal: source.subtotal ?? amount.subtotal ?? 0,
    totalAmount: source.totalAmount ?? source.total ?? amount.total ?? 0,
  };
};

const normalizeOrdersResponse = (data: any) => {
  const source = data?.result ?? data?.data ?? data;

  if (Array.isArray(data)) {
    return data.map(normalizeOrder);
  }

  if (Array.isArray(source)) {
    return source.map(normalizeOrder);
  }

  if (Array.isArray(source?.content)) {
    return {
      ...source,
      content: source.content.map(normalizeOrder),
    };
  }

  if (Array.isArray(source?.data?.content)) {
    return {
      ...source.data,
      content: source.data.content.map(normalizeOrder),
    };
  }

  if (Array.isArray(source?.data)) {
    return {
      ...source,
      content: source.data.map(normalizeOrder),
    };
  }

  return source ? normalizeOrder(source) : source;
};

const enrichOrdersResponse = async (data: any) => {
  const normalized = normalizeOrdersResponse(data);
  const orders = Array.isArray(normalized) ? normalized : normalized?.content;

  if (!Array.isArray(orders)) {
    return normalized;
  }

  const ordersWithDetails = await Promise.all(
    orders.map(async (order: any) => {
      if ((order.items || []).length > 0 || !order.orderId) {
        return order;
      }

      try {
        const detailRes = await getOrderDetailResponse(order.orderId);
        const detail = normalizeOrder(
          detailRes.data?.result ?? detailRes.data?.data ?? detailRes.data,
        );

        return {
          ...order,
          ...detail,
          items: detail.items?.length ? detail.items : order.items,
        };
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
        return order;
      }
    }),
  );

  const missingBookIds = Array.from(
    new Set(
      ordersWithDetails.flatMap((order: any) =>
        (order.items || [])
          .filter(
            (item: any) =>
              item.bookId &&
              (isPlaceholderTitle(item.bookTitle) ||
                isFallbackImage(item.coverImgUrl)),
          )
          .map((item: any) => String(item.bookId)),
      ),
    ),
  );

  const books = await Promise.all(
    missingBookIds.map(async (bookId) => {
      try {
        const book = await bookApi.getBookById(Number(bookId));
        return [bookId, book] as const;
      } catch (error) {
        console.error("Failed to fetch order item book:", error);
        return [bookId, null] as const;
      }
    }),
  );

  const bookById = new Map(books);
  const enrichedOrdersById = ordersWithDetails.map((order: any) => ({
    ...order,
    items: (order.items || []).map((item: any) => {
      const book = bookById.get(String(item.bookId));

      if (!book) {
        return item;
      }

      return {
        ...item,
        bookTitle:
          item.bookTitle && item.bookTitle !== "Sản phẩm"
            ? item.bookTitle
            : book.title,
        coverImgUrl: isFallbackImage(item.coverImgUrl)
          ? getBookImage(book)
          : item.coverImgUrl,
        price: item.price || book.price || 0,
      };
    }),
  }));

  const needsTitleImageLookup = enrichedOrdersById.some((order: any) =>
    (order.items || []).some(
      (item: any) =>
        !isPlaceholderTitle(item.bookTitle) &&
        isFallbackImage(item.coverImgUrl),
    ),
  );

  if (!needsTitleImageLookup) {
    return Array.isArray(normalized)
      ? enrichedOrdersById
      : {
          ...normalized,
          content: enrichedOrdersById,
        };
  }

  try {
    const allBooks = await getBooksForImageLookup();
    const enrichedOrdersByTitle = enrichedOrdersById.map((order: any) => ({
      ...order,
      items: (order.items || []).map((item: any) => {
        if (
          isPlaceholderTitle(item.bookTitle) ||
          !isFallbackImage(item.coverImgUrl)
        ) {
          return item;
        }

        const matchedBook = findBookByTitle(allBooks, item.bookTitle);

        if (!matchedBook) {
          return item;
        }

        return {
          ...item,
          bookId: item.bookId ?? matchedBook.bookId ?? matchedBook.id,
          coverImgUrl: getBookImage(matchedBook),
          price: item.price || matchedBook.price || 0,
        };
      }),
    }));

    return Array.isArray(normalized)
      ? enrichedOrdersByTitle
      : {
          ...normalized,
          content: enrichedOrdersByTitle,
        };
  } catch (error) {
    console.error("Failed to lookup order item image by title:", error);
  }

  return Array.isArray(normalized)
    ? enrichedOrdersById
    : {
        ...normalized,
        content: enrichedOrdersById,
      };
};

const getOrdersFromNormalized = (normalized: any) => {
  if (Array.isArray(normalized)) {
    return normalized;
  }

  if (Array.isArray(normalized?.content)) {
    return normalized.content;
  }

  return [];
};

const sortOrdersByCreatedAt = (orders: any[]) =>
  [...orders].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return timeB - timeA;
  });

const mergeWithLocalOrders = (normalized: any) => {
  const localOrders = readLocalOrders();

  if (localOrders.length === 0) {
    return normalized;
  }

  const apiOrders = getOrdersFromNormalized(normalized);
  const apiOrderIds = new Set(apiOrders.map((order: any) => String(order.orderId)));
  const mergedOrders = sortOrdersByCreatedAt([
    ...apiOrders,
    ...localOrders.filter((order: any) => !apiOrderIds.has(String(order.orderId))),
  ]);

  if (Array.isArray(normalized)) {
    return mergedOrders;
  }

  return {
    ...(normalized || {}),
    content: mergedOrders,
  };
};

const fetchOrdersWithLegacyFallback = async (
  params?: Record<string, any>,
) => {
  const primaryRes = await getOrdersResponse(params);
  const primaryOrders = await enrichOrdersResponse(primaryRes.data ?? []);

  if (getOrdersFromNormalized(primaryOrders).length > 0) {
    return primaryOrders;
  }

  try {
    const legacyRes = await axiosClient.get("/orders/my", { params });
    const legacyOrders = await enrichOrdersResponse(legacyRes.data ?? []);

    const result = getOrdersFromNormalized(legacyOrders).length > 0
      ? legacyOrders
      : primaryOrders;

    return mergeWithLocalOrders(result);
  } catch {
    return mergeWithLocalOrders(primaryOrders);
  }
};

export const saveLocalOrderFallback = ({
  order,
  items,
  totals,
  paymentMethod,
}: {
  order: any;
  items: any[];
  totals: any;
  paymentMethod: string;
}) => {
  const source = order?.data ?? order ?? {};
  const orderId = source.orderId ?? source.id ?? `local_${Date.now()}`;
  const createdAt = source.createdAt ?? new Date().toISOString();
  const orderItems = items.map((item: any) => {
    const price = item.book.price;

    return {
      itemId: item.bookCartId ?? item.book.bookId,
      bookId: item.book.bookId,
      bookTitle: item.book.title,
      quantity: item.quantity,
      price,
      lineTotal: price * item.quantity,
      coverImgUrl: resolveImageUrl(
        item.book.coverImgUrl,
        item.book.coverImageUrl,
        item.book.thumbnailUrl,
        item.book.imageUrl,
        item.book.bookImgs,
        item.book.images,
      ),
    };
  });
  const localOrder = normalizeOrder({
    ...source,
    orderId,
    createdAt,
    status:
      source.status ??
      (paymentMethod === "VNPAY" ? "PENDING_PAYMENT" : "CREATED"),
    paymentMethod,
    items: source.items?.length ? source.items : orderItems,
    amount: {
      subtotal: totals?.subtotal ?? 0,
      shippingFee: totals?.shippingFee ?? 0,
      discount: totals?.discount ?? 0,
      total: totals?.total ?? 0,
      ...source.amount,
    },
  });
  const existing = readLocalOrders().filter(
    (item: any) => String(item.orderId) !== String(localOrder.orderId),
  );

  writeLocalOrders([localOrder, ...existing]);

  return localOrder;
};

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);
    return enrichOrdersResponse(mockOrders);
  }

  try {
    const orders = await fetchOrdersWithLegacyFallback();

    return enrichOrdersResponse(mergeWithLocalOrders(orders));
  } catch {
    return enrichOrdersResponse(mergeWithLocalOrders([]));
  }
};

/* ================= GET MY ORDERS BY STATUS ================= */
export const getMyOrdersByStatus = async (
  status: string
): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);
    return enrichOrdersResponse(mockOrders.filter((o) => o.status === status));
  }

  try {
    const orders = await fetchOrdersWithLegacyFallback({ status });

    return enrichOrdersResponse(mergeWithLocalOrders(orders));
  } catch {
    return enrichOrdersResponse(mergeWithLocalOrders([]));
  }
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (id: number): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);

    const order = mockOrders.find((o: any) => o.orderId === id);

    if (!order) throw new Error("Order not found");

    return enrichOrdersResponse([order]).then((orders) => orders[0]);
  }

  const res = await getOrderDetailResponse(id);

  const source = res.data?.result ?? res.data?.data ?? res.data;
  const order = source?.data ?? source;

  return order
    ? enrichOrdersResponse([order]).then((orders) => orders[0])
    : null;
};

/* ================= CREATE ORDER ================= */
export const createOrder = async (orderData: any): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);

    return {
      success: true,
      message: "Mua hàng thành công",
      orderId: Date.now(),
    };
  }

  const res = await axiosClient.post("/orders", orderData);

  return res.data;
};

/* ================= ADMIN: RECENT ORDERS ================= */
export const getRecentOrders = async (): Promise<any[]> => {
  const res = await axiosClient.get("/admin/recent-orders");
  return res.data ?? [];
};

/* ================= ADMIN: REVENUE ================= */
export const getRevenueData = async (): Promise<any[]> => {
  const res = await axiosClient.get("/admin/revenue");
  return res.data ?? [];
};

/* ================= EXPORT API OBJECT ================= */
export const orderApi = {
  getMyOrders,
  getMyOrdersByStatus,
  getOrderById,
  createOrder,
  getRecentOrders,
  getRevenueData,
  saveLocalOrderFallback,
};
