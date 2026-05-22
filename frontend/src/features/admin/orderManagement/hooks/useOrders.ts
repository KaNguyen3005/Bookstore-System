import { useState, useEffect, useCallback, useMemo } from "react";
import type { Order, OrderStatus } from "../types/order";
import { orderService, type OrdersResponse } from "../services/orderService";

const VIETNAM_TIME_OFFSET_MS = 7 * 60 * 60 * 1000;

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING"],
  PROCESSING: ["SHIPPING"],
  SHIPPING: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const useOrders = () => {
  // ... (states)
  const [data, setData] = useState<OrdersResponse | Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // ================= MAPPERS =================
  const mapStatusToData = (uiStatus: string): string | undefined => {
    switch (uiStatus) {
      case "Chờ xác nhận":
        return "PENDING";
      case "Đã duyệt":
        return "CONFIRMED";
      case "Đang giao":
        return "SHIPPING";
      case "Đã giao":
        return "DELIVERED";
      case "Hoàn thành":
        return "COMPLETED";
      case "Đã hủy":
        return "CANCELLED";
      default:
        return undefined;
    }
  };

  const orderTime = (order: Order) => {
    const time = new Date(order.createdAt).getTime();

    return Number.isNaN(time) ? 0 : time;
  };

  const formatCurrency = (amount?: number) => {
    return Number(amount || 0).toLocaleString("vi-VN");
  };

  const formatVietnamDateTime = (date?: string) => {
    if (!date) return "";

    const time = new Date(date).getTime();

    if (Number.isNaN(time)) return "";

    return new Date(time + VIETNAM_TIME_OFFSET_MS).toLocaleString("vi-VN");
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPING":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status?: string) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      default:
        return status || "";
    }
  };

  const getShippingAddress = (order: Order) => {
    const customerAddress = order.shipment?.address;
    const shippingSnapshot = order.shipping;

    return [
      customerAddress?.detailAddress || shippingSnapshot?.line1,
      shippingSnapshot?.line2,
      customerAddress?.ward || shippingSnapshot?.ward,
      customerAddress?.district || shippingSnapshot?.district,
      customerAddress?.province || shippingSnapshot?.city,
      shippingSnapshot?.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const sortNewestFirst = (first: Order, second: Order) => {
    const timeDiff = orderTime(second) - orderTime(first);

    if (timeDiff !== 0) return timeDiff;

    return (second.orderId ?? 0) - (first.orderId ?? 0);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        status:
          statusFilter === "Tất cả" ? undefined : mapStatusToData(statusFilter),
        keyword: searchTerm,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      };
      const summary = await orderService.getOrders({
        ...filters,
        page: 0,
        size: 1,
        sort: "createdAt,desc",
      });
      const response = await orderService.getOrders({
        ...filters,
        page: 0,
        size: Math.max(summary.totalElements, size),
        sort: "createdAt,desc",
      });

      setData(response);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [size, statusFilter, searchTerm, dateRange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, searchTerm, dateRange]);

  // ================= DATA PREPARATION =================
  const rawOrders = useMemo(
    () => (Array.isArray(data) ? data : (data?.content ?? [])),
    [data],
  );

  // Lọc dữ liệu tại Frontend để đảm bảo chính xác tuyệt đối (phòng trường hợp Backend chưa lọc chuẩn)
  const safeOrders = useMemo(() => {
    const mappedStatus = mapStatusToData(statusFilter);
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const startTime = dateRange.startDate
      ? new Date(dateRange.startDate).setHours(0, 0, 0, 0)
      : undefined;
    const endTime = dateRange.endDate
      ? new Date(dateRange.endDate).setHours(23, 59, 59, 999)
      : undefined;

    return [...rawOrders]
      .filter((order: Order) => {
        if (mappedStatus && order.status !== mappedStatus) return false;

        if (normalizedSearch) {
          const fields = [
            order.orderId,
            order.customerName,
            order.status,
            order.paymentStatus,
          ];

          const matchedSearch = fields.some((field) =>
            String(field ?? "").toLowerCase().includes(normalizedSearch),
          );

          if (!matchedSearch) return false;
        }

        const createdTime = orderTime(order);

        if (startTime !== undefined && createdTime < startTime) return false;
        if (endTime !== undefined && createdTime > endTime) return false;

        return true;
      })
      .sort(sortNewestFirst);
  }, [rawOrders, statusFilter, searchTerm, dateRange]);

  const totalPages = Math.max(1, Math.ceil(safeOrders.length / size));
  const paginatedOrders = safeOrders.slice(page * size, page * size + size);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  // ================= HANDLERS =================
  const handleApprove = async (id: number) => {
    try {
      await orderService.approveOrder(id);
      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;
        if (Array.isArray(prev)) {
          return prev.map((o) =>
            o.orderId === id ? { ...o, status: "CONFIRMED" as OrderStatus } : o,
          );
        }
        return {
          ...prev,
          content: (prev as OrdersResponse).content.map((o) =>
            o.orderId === id ? { ...o, status: "CONFIRMED" as OrderStatus } : o,
          ),
        } as OrdersResponse;
      });
      alert("Đã phê duyệt đơn hàng thành công");
      return true;
    } catch (err) {
      alert("Lỗi khi phê duyệt đơn hàng");
      return false;
    }
  };

  const handleUpdateStatus = async (
    id: number,
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ) => {
    console.log("UPDATE STATUS:", {
      id,
      currentStatus,
      newStatus,
    });

    // Safety check
    if (!ALLOWED_TRANSITIONS[currentStatus].includes(newStatus)) {
      console.log("INVALID TRANSITION");

      alert("Chuyển đổi trạng thái không hợp lệ");

      return false;
    }

    try {
      if (newStatus === "CANCELLED") {
        console.log("CALL CANCEL API");

        await orderService.cancelOrder(id);
      } else {
        console.log("CALL PATCH API WITH:", {
          status: newStatus,
        });

        await orderService.updateOrderStatus(id, newStatus);
      }

      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;

        if (Array.isArray(prev)) {
          return prev.map((o) =>
            o.orderId === id
              ? {
                  ...o,
                  status: newStatus,
                }
              : o,
          );
        }

        return {
          ...prev,

          content: (prev as OrdersResponse).content.map((o) =>
            o.orderId === id
              ? {
                  ...o,
                  status: newStatus,
                }
              : o,
          ),
        } as OrdersResponse;
      });

      return true;
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);

      alert("Lỗi khi cập nhật trạng thái");

      return false;
    }
  };

  const handleExport = async () => {
    try {
      if (safeOrders.length === 0) {
        alert("Không có đơn hàng để xuất Excel");
        return;
      }

      const rows = safeOrders.map((order) => ({
        "Mã đơn": order.orderId,
        "Khách hàng": order.customerName || "",
        "Số sản phẩm": order.items?.length ?? 0,
        "Sản phẩm": (order.items ?? [])
          .map((item) => `${item.bookTitle} x${item.quantity}`)
          .join(", "),
        "Tạm tính": formatCurrency(order.subtotal),
        "VAT": formatCurrency(order.vatAmount),
        "Tổng tiền": formatCurrency(order.totalAmount),
        "Thanh toán": getPaymentStatusLabel(order.paymentStatus),
        "Trạng thái": getStatusLabel(order.status),
        "Ngày đặt": formatVietnamDateTime(order.createdAt),
        "Nhân viên xử lý": order.staffName || "",
        "Người nhận":
          order.shipment?.address?.customerName ||
          order.shipping?.receiverName ||
          order.customerName ||
          "",
        "Số điện thoại":
          order.shipment?.address?.customerPhone ||
          order.shipping?.receiverPhone ||
          "",
        "Địa chỉ giao hàng": getShippingAddress(order),
      }));

      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      const columnWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(
          key.length,
          ...rows.map((row) => String(row[key as keyof typeof row] ?? "").length),
        ) + 2,
      }));

      worksheet["!cols"] = columnWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Don hang");
      XLSX.writeFile(workbook, `orders_${Date.now()}.xlsx`);
    } catch (err) {
      console.error("EXPORT ORDERS ERROR:", err);
      alert("Lỗi khi xuất file Excel");
    }
  };

  // ================= GLOBAL STATS =================
  const [globalStats, setGlobalStats] = useState({
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const fetchGlobalStats = useCallback(async () => {
    try {
      const response = await orderService.getOrders({ size: 100 });
      const allOrders = Array.isArray(response)
        ? response
        : response.content || [];

      setGlobalStats({
        pending: allOrders.filter((o: any) => o.status === "PENDING").length,
        confirmed: allOrders.filter((o: any) => o.status === "CONFIRMED")
          .length,
        shipping: allOrders.filter((o: any) => o.status === "SHIPPING").length,
        delivered: allOrders.filter((o: any) => o.status === "DELIVERED")
          .length,
        completed: allOrders.filter((o: any) => o.status === "COMPLETED")
          .length,
        cancelled: allOrders.filter((o: any) => o.status === "CANCELLED")
          .length,
        totalRevenue: allOrders.reduce(
          (sum: number, o: any) =>
            o.status === "DELIVERED" || o.status === "COMPLETED"
              ? sum + o.totalAmount
              : sum,
          0,
        ),
      });
    } catch (err) {
      console.error("Error fetching global stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats, data]); // Refresh stats when data changes (e.g. after approval)

  return {
    // Data
    orders: paginatedOrders,
    totalOrders: safeOrders.length,
    totalPages,
    currentPage: page,
    pageSize: size,
    loading,
    error,

    // Stats
    pendingCount: globalStats.pending,
    confirmedCount: globalStats.confirmed,
    shippingCount: globalStats.shipping,
    deliveredCount: globalStats.delivered,
    completedCount: globalStats.completed,
    cancelledCount: globalStats.cancelled,
    totalRevenue: globalStats.totalRevenue,

    // Controls
    setPage,
    setSize,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,

    // Actions
    handleApprove,
    handleUpdateStatus,
    handleExport,
    refresh: fetchOrders,
    allowedTransitions: ALLOWED_TRANSITIONS,
  };
};
