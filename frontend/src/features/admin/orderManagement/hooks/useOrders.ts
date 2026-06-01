import { useState, useEffect, useCallback, useMemo } from "react";
import type { Order, OrderStatus } from "../types/order";
import { orderService, type OrdersResponse } from "../services/orderService";
import { formatVietnamDateTime, toDateParam } from "../../../../utils/dateTime";

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: [],
  PENDING: ["CONFIRMED"],
  CONFIRMED: [],
  PROCESSING: [],
  SHIPPING: [],
  DELIVERED: [],
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

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "Chờ thanh toán";
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
      case "SUCCESS":
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
        startDate: toDateParam(dateRange.startDate),
        endDate: toDateParam(dateRange.endDate),
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
    const startDate = toDateParam(dateRange.startDate);
    const endDate = toDateParam(dateRange.endDate);

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

        const createdDate = toDateParam(order.createdAt);

        if (startDate && createdDate && createdDate < startDate) return false;
        if (endDate && createdDate && createdDate > endDate) return false;

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

  const escapeHtml = (value: unknown) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const handlePrintInvoice = async (id: number) => {
    const printWindow = window.open("", "_blank", "width=920,height=720");

    if (!printWindow) {
      alert("Trinh duyet dang chan cua so in hoa don");
      return false;
    }

    try {
      printWindow.document.write("<p>Dang tai hoa don...</p>");
      const order = await orderService.getOrderById(id);
      const items = order.items ?? [];
      const itemRows = items
        .map((item, index) => {
          const lineTotal = Number(item.lineTotal ?? Number(item.price || 0) * Number(item.quantity || 0));

          return `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(item.bookTitle)}</td>
              <td class="number">${item.quantity}</td>
              <td class="number">${formatCurrency(Number(item.price || 0))} VND</td>
              <td class="number">${formatCurrency(lineTotal)} VND</td>
            </tr>
          `;
        })
        .join("");
      const invoiceHtml = `
        <!doctype html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Hoa don #${order.orderId}</title>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 32px; color: #17252a; font-family: Arial, Helvetica, sans-serif; }
              .invoice { max-width: 860px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #183b4a; padding-bottom: 18px; }
              .brand { font-size: 24px; font-weight: 800; color: #183b4a; }
              .muted { color: #667780; font-size: 13px; line-height: 1.6; }
              .title { margin: 28px 0 8px; font-size: 26px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 22px 0; }
              .box { border: 1px solid #dde7ea; border-radius: 8px; padding: 16px; }
              .box h2 { margin: 0 0 12px; font-size: 15px; color: #183b4a; }
              .row { display: flex; justify-content: space-between; gap: 16px; margin: 8px 0; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-top: 18px; }
              th { background: #183b4a; color: #fff; text-align: left; padding: 11px; font-size: 13px; }
              td { border-bottom: 1px solid #e6eeee; padding: 11px; font-size: 13px; vertical-align: top; }
              .number { text-align: right; white-space: nowrap; }
              .totals { width: 320px; margin-left: auto; margin-top: 18px; }
              .total { font-size: 18px; font-weight: 800; color: #0f766e; }
              .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e6eeee; }
              @media print { body { padding: 0; } .invoice { max-width: none; } }
            </style>
          </head>
          <body>
            <main class="invoice">
              <section class="header">
                <div>
                  <div class="brand">KATIIA Bookstore</div>
                  <div class="muted">Hoa don ban hang duoc phat hanh tu he thong quan tri</div>
                </div>
                <div class="muted">
                  <strong>Ma don:</strong> #${order.orderId}<br />
                  <strong>Ngay dat:</strong> ${escapeHtml(formatVietnamDateTime(order.createdAt))}<br />
                  <strong>Van don:</strong> ${escapeHtml(order.shipment?.trackingNumber || "Chua co")}
                </div>
              </section>

              <h1 class="title">Hoa don ban hang</h1>
              <div class="grid">
                <section class="box">
                  <h2>Khach hang</h2>
                  <div class="row"><span>Ten</span><strong>${escapeHtml(order.customerName)}</strong></div>
                  <div class="row"><span>Nguoi nhan</span><strong>${escapeHtml(order.shipment?.address?.customerName || order.shipping?.receiverName || order.customerName)}</strong></div>
                  <div class="row"><span>Dien thoai</span><strong>${escapeHtml(order.shipment?.address?.customerPhone || order.shipping?.receiverPhone || "")}</strong></div>
                  <div class="row"><span>Dia chi</span><strong>${escapeHtml(getShippingAddress(order))}</strong></div>
                </section>
                <section class="box">
                  <h2>Thanh toan va xu ly</h2>
                  <div class="row"><span>Phuong thuc</span><strong>${escapeHtml(order.paymentMethod || "")}</strong></div>
                  <div class="row"><span>Trang thai thanh toan</span><strong>${escapeHtml(getPaymentStatusLabel(order.paymentStatus))}</strong></div>
                  <div class="row"><span>Trang thai don</span><strong>${escapeHtml(getStatusLabel(order.status))}</strong></div>
                  <div class="row"><span>Nhan vien</span><strong>${escapeHtml(order.staffName || "Chua phan cong")}</strong></div>
                </section>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>San pham</th>
                    <th class="number">SL</th>
                    <th class="number">Don gia</th>
                    <th class="number">Thanh tien</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>

              <section class="totals">
                <div class="row"><span>Tam tinh</span><strong>${formatCurrency(order.subtotal)} VND</strong></div>
                <div class="row"><span>Giam gia</span><strong>${formatCurrency(order.discountAmount || 0)} VND</strong></div>
                <div class="row"><span>VAT</span><strong>${formatCurrency(order.vatAmount)} VND</strong></div>
                <div class="row total"><span>Tong cong</span><strong>${formatCurrency(order.totalAmount)} VND</strong></div>
              </section>

              <div class="footer muted">Cam on quy khach da mua hang tai KATIIA Bookstore.</div>
            </main>
            <script>
              window.onload = () => {
                window.focus();
                window.print();
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      return true;
    } catch (err) {
      printWindow.close();
      console.error("PRINT INVOICE ERROR:", err);
      alert("Loi khi in hoa don");
      return false;
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
    handlePrintInvoice,
    refresh: fetchOrders,
    allowedTransitions: ALLOWED_TRANSITIONS,
  };
};
