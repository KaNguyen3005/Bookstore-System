import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./DashboardPage.module.css";

import {
  getDashboard,
  getRevenueChart,
  getTopSellingBooks,
  getTopRatedBooks,
  getRecentOrders,
  getOutOfStockBooks,
} from "../../../../services/dashboardApi";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AlertTriangle,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

type DashboardData = {
  dashboard: any;
  chart: any[];
  topSelling: any[];
  topRated: any[];
  recent: any[];
  outOfStock: any[];
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn thành",
  DONE: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const formatCurrency = (value: number | string | null | undefined) =>
  `${Number(value ?? 0).toLocaleString("vi-VN")} đ`;

const formatNumber = (value: number | string | null | undefined) =>
  Number(value ?? 0).toLocaleString("vi-VN");

const normalizeStatus = (status: string | null | undefined) =>
  String(status ?? "").trim().toUpperCase();

const getStatusLabel = (status: string | null | undefined) => {
  const normalized = normalizeStatus(status);
  return STATUS_LABELS[normalized] ?? status ?? "Không rõ";
};

const shortenTitle = (title: string | null | undefined, maxLength = 22) => {
  const safeTitle = title?.trim() || "Không có tên";
  return safeTitle.length > maxLength
    ? `${safeTitle.slice(0, maxLength - 1)}...`
    : safeTitle;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("today");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const lastOrderRef = useRef<number | null>(null);

  const fetchDashboardData = useCallback(
    async (rangeValue: string, manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const [dashboard, chart, topSelling, topRated, recent, outOfStock] =
          await Promise.all([
            getDashboard({ range: rangeValue, limit: 10 }),
            getRevenueChart(rangeValue),
            getTopSellingBooks(rangeValue, 5),
            getTopRatedBooks(5),
            getRecentOrders(5),
            getOutOfStockBooks(10),
          ]);

        setData({
          dashboard,
          chart: chart ?? dashboard?.revenueChart ?? [],
          topSelling: topSelling ?? dashboard?.topSellingBooks ?? [],
          topRated: topRated ?? dashboard?.topRatedBooks ?? [],
          recent: recent ?? dashboard?.recentOrders ?? [],
          outOfStock: outOfStock ?? dashboard?.outOfStockBooks ?? [],
        });
      } catch (err) {
        console.error(err);
        setError("Không thể tải dashboard");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchDashboardData(range);
  }, [fetchDashboardData, range]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const recent = await getRecentOrders(5);

        setData((prev) => {
          if (!prev) return prev;
          return { ...prev, recent: recent ?? [] };
        });

        const latestId = recent?.[0]?.orderId;

        if (latestId && latestId !== lastOrderRef.current) {
          lastOrderRef.current = latestId;
          console.log("New order:", latestId);
        }
      } catch {
        console.log("Realtime error");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const dashboard = data?.dashboard ?? {};
  const recent = data?.recent ?? [];
  const outOfStock = data?.outOfStock ?? [];
  const topSelling = data?.topSelling ?? [];
  const topRated = data?.topRated ?? [];

  const chartData = useMemo(
    () =>
      (data?.chart ?? []).map((point) => ({
        period: point.period ?? point.label ?? "",
        revenue: Number(point.revenue ?? 0),
        orderCount: Number(point.orderCount ?? point.orders ?? 0),
      })),
    [data?.chart]
  );

  const topSellingChartData = useMemo(
    () =>
      topSelling.map((book) => ({
        ...book,
        shortTitle: shortenTitle(book.title),
        totalQuantitySold: Number(book.totalQuantitySold ?? 0),
      })),
    [topSelling]
  );

  const topRatedChartData = useMemo(
    () =>
      topRated.map((book) => ({
        ...book,
        shortTitle: shortenTitle(book.title),
        avgRating: Number(book.avgRating ?? 0),
      })),
    [topRated]
  );

  const quickInsight = useMemo(() => {
    const revenue = Number(dashboard.totalRevenue ?? 0);
    const orders = Number(dashboard.totalOrders ?? 0);
    const avg = orders > 0 ? revenue / orders : 0;

    let status = "Ổn định";
    if (avg > 500000) status = "Tăng trưởng mạnh";
    else if (avg > 0 && avg < 200000) status = "Cần tối ưu";

    return { avg, status };
  }, [dashboard.totalOrders, dashboard.totalRevenue]);

  const getStatusBadge = (status: string) => {
    switch (normalizeStatus(status)) {
      case "PENDING":
        return styles.pending;
      case "CONFIRMED":
        return styles.confirmed;
      case "SHIPPING":
        return styles.shipping;
      case "DELIVERED":
      case "DONE":
      case "COMPLETED":
        return styles.success;
      case "CANCELLED":
        return styles.danger;
      default:
        return styles.default;
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>

        <div className={styles.actions}>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className={styles.select}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
            <option value="all">Toàn bộ thời gian</option>
          </select>

          <button
            className={styles.refreshBtn}
            onClick={() => fetchDashboardData(range, true)}
            disabled={refreshing}
            aria-label="Làm mới dashboard"
          >
            <RefreshCw
              size={16}
              className={refreshing ? styles.spin : undefined}
            />
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiHeader}>
            <DollarSign size={18} />
            <span className={styles.kpiLabelRevenue}>Doanh thu</span>
          </div>
          <h2>{formatCurrency(dashboard.totalRevenue)}</h2>
        </div>

        <div className={styles.card}>
          <div className={styles.kpiHeader}>
            <ShoppingCart size={18} />
            <span className={styles.kpiLabelOrders}>Đơn hàng</span>
          </div>
          <h2>{formatNumber(dashboard.totalOrders)}</h2>
        </div>

        <div className={styles.card}>
          <div className={styles.kpiHeader}>
            <Users size={18} />
            <span className={styles.kpiLabelCustomers}>Khách hàng</span>
          </div>
          <h2>{formatNumber(dashboard.totalCustomers)}</h2>
        </div>

        <div className={styles.cardDanger}>
          <div className={styles.kpiHeader}>
            <AlertTriangle size={18} />
            <span className={styles.kpiLabelStock}>Tồn kho thấp</span>
          </div>
          <h2>{formatNumber(dashboard.lowStockProducts)}</h2>
        </div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.insightTitle}>
          <TrendingUp size={18} />
          Phân tích nhanh
        </h3>
        <div className={styles.insightGrid}>
          <div className={styles.insightItem}>
            <span>Giá trị đơn trung bình</span>
            <b>{formatCurrency(quickInsight.avg)}</b>
          </div>
          <div className={styles.insightItem}>
            <span>Nhận định</span>
            <b>{quickInsight.status}</b>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <h3>Doanh thu</h3>

        {chartData.length === 0 ? (
          <p className={styles.empty}>Chưa có dữ liệu doanh thu trong khoảng này.</p>
        ) : (
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid opacity={0.2} />
                <XAxis dataKey="period" />
                <YAxis
                  yAxisId="revenue"
                  tickFormatter={(value) => `${Number(value) / 1000}k`}
                />
                <YAxis yAxisId="orders" orientation="right" allowDecimals={false} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Doanh thu") return formatCurrency(Number(value));
                    return [formatNumber(Number(value)), name];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="revenue"
                  type="monotone"
                  name="Doanh thu"
                  dataKey="revenue"
                  stroke="#325863"
                  fill="rgba(50, 88, 99, 0.18)"
                  strokeWidth={2}
                />
                <Area
                  yAxisId="orders"
                  type="monotone"
                  name="Đơn hàng"
                  dataKey="orderCount"
                  stroke="#f59e0b"
                  fill="rgba(245, 158, 11, 0.16)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className={styles.panel}>
        <h3>Trạng thái đơn hàng</h3>

        <div className={styles.statusList}>
          {(dashboard.ordersByStatus || []).map((item: any) => (
            <div key={item.status} className={styles.row}>
              <span className={styles.statusLabel}>
                {getStatusLabel(item.status)}
              </span>
              <b className={`${styles.badge} ${getStatusBadge(item.status)}`}>
                {formatNumber(item.count)}
              </b>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <h3>Đơn hàng gần đây</h3>

        {recent.length === 0 ? (
          <p className={styles.empty}>Chưa có đơn hàng gần đây.</p>
        ) : (
          recent.map((order: any) => (
            <div key={order.orderId} className={styles.row}>
              <span>
                #{order.orderId} - {order.customerName || "Khách hàng"}
              </span>
              <b>{formatCurrency(order.totalAmount)}</b>
            </div>
          ))
        )}
      </div>

      <div className={styles.panel}>
        <h3>Sách hết hàng</h3>

        {outOfStock.length === 0 ? (
          <p className={styles.empty}>Không có sách nào hết hàng.</p>
        ) : (
          outOfStock.map((book: any) => (
            <div key={book.bookId} className={styles.row}>
              <span>{book.title}</span>
              <b className={styles.dangerText}>Hết hàng</b>
            </div>
          ))
        )}
      </div>

      <div className={styles.grid2}>
        <div className={styles.panel}>
          <h3>Bán chạy</h3>
          {topSellingChartData.length === 0 ? (
            <p className={styles.empty}>Chưa có dữ liệu bán chạy.</p>
          ) : (
            <div className={styles.compactChartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingChartData}>
                  <CartesianGrid opacity={0.15} vertical={false} />
                  <XAxis dataKey="shortTitle" interval={0} tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.title ?? "Sách"
                    }
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      "Đã bán",
                    ]}
                  />
                  <Bar
                    dataKey="totalQuantitySold"
                    name="Đã bán"
                    fill="#325863"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <h3>Đánh giá cao</h3>
          {topRatedChartData.length === 0 ? (
            <p className={styles.empty}>Chưa có dữ liệu đánh giá.</p>
          ) : (
            <div className={styles.compactChartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRatedChartData}>
                  <CartesianGrid opacity={0.15} vertical={false} />
                  <XAxis dataKey="shortTitle" interval={0} tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.title ?? "Sách"
                    }
                    formatter={(value) => [Number(value).toFixed(1), "Điểm"]}
                  />
                  <Bar
                    dataKey="avgRating"
                    name="Điểm"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
