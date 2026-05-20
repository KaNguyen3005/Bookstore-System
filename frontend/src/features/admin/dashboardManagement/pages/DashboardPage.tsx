import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./DashboardPage.module.css";

import {
  getDashboard,
  getRevenueChart,
  getTopSellingBooks,
  getTopRatedBooks,
  getRecentOrders,
} from "../../../../services/dashboardApi";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";


export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("today");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const lastOrderRef = useRef<number | null>(null);

  // ================= FETCH =================
  const fetchDashboardData = async (rangeValue = range) => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, chart, topSelling, topRated, recent] =
        await Promise.all([
          getDashboard({ range: rangeValue, limit: 10 }),
          getRevenueChart(rangeValue),
          getTopSellingBooks("month", 5),
          getTopRatedBooks(5),
          getRecentOrders(5),
        ]);

      setData({ dashboard, chart, topSelling, topRated, recent });
    } catch (err) {
      console.error(err);
      setError("Không thể tải dashboard");
    } finally {
      setLoading(false);
    }
  };

  // initial + range change
  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  // ================= REALTIME SAFE =================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const recent = await getRecentOrders(5);

        setData((prev: any) => {
          if (!prev) return prev;
          return { ...prev, recent };
        });

        const latestId = recent?.[0]?.orderId;

        if (latestId && latestId !== lastOrderRef.current) {
          lastOrderRef.current = latestId;
          console.log("🆕 New order:", latestId);
        }
      } catch {
        console.log("Realtime error");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ================= MEMO SAFE =================
  const dashboard = data?.dashboard ?? {};
  const chartData = data?.chart ?? [];
  const recent = data?.recent ?? [];
  const topSelling = data?.topSelling ?? [];
  const topRated = data?.topRated ?? [];

  const growth = (v: number) => `+${Math.min(25, v % 30)}%`;

  const aiInsight = useMemo(() => {
    const revenue = dashboard.totalRevenue || 0;
    const orders = dashboard.totalOrders || 1;

    const avg = revenue / orders;

    let status = "Ổn định";
    if (avg > 500000) status = "Tăng trưởng mạnh";
    else if (avg < 200000) status = "Cần tối ưu";

    return { avg, status };
  }, [dashboard]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return styles.pending;
      case "DONE":
      case "COMPLETED":
        return styles.success;
      case "CANCELLED":
        return styles.danger;
      default:
        return styles.default;
    }
  };

  // ================= LOADING =================
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

      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>

        <div className={styles.actions}>
          <select value={range} onChange={(e) => setRange(e.target.value)} className={styles.select}>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
          </select>

          <button className={styles.refreshBtn} onClick={() => fetchDashboardData()}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiHeader}><DollarSign size={18} /> Doanh thu</div>
          <h2>{dashboard.totalRevenue?.toLocaleString?.() || 0} đ</h2>
          <span className={styles.growth}>{growth(dashboard.totalRevenue || 0)}</span>
        </div>

        <div className={styles.card}>
          <div className={styles.kpiHeader}><ShoppingCart size={18} /> Đơn hàng</div>
          <h2>{dashboard.totalOrders || 0}</h2>
          <span className={styles.growth}>{growth(dashboard.totalOrders || 0)}</span>
        </div>

        <div className={styles.card}>
          <div className={styles.kpiHeader}><Users size={18} /> Khách hàng</div>
          <h2>{dashboard.totalCustomers || 0}</h2>
          <span className={styles.growth}>{growth(dashboard.totalCustomers || 0)}</span>
        </div>

        <div className={styles.cardDanger}>
          <div className={styles.kpiHeader}><AlertTriangle size={18} /> Tồn kho</div>
          <h2>{dashboard.lowStockProducts || 0}</h2>
        </div>
      </div>

      {/* AI */}
      <div className={styles.panel}>
        <h3 className={styles.aiTitle}>
          AI Insight
          <a>
            <img
              src="https://img.icons8.com/fluency/48/robot-2.png"
              alt="AI Robot"
              className={styles.robotIcon}
            />
          </a>
        </h3>
        <p>Giá trị đơn trung bình: <b>{aiInsight.avg.toLocaleString()} đ</b></p>
        <p>Phân tích: <b>{aiInsight.status}</b></p>
      </div>

      {/* CHART */}
      <div className={styles.panel}>
        <h3>Doanh thu</h3>

        <div style={{ height: 340 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Area dataKey="revenue" stroke="#325863" fill="rgba(50,88,99,0.2)" />
              <Area dataKey="orders" stroke="#f59e0b" fill="rgba(245,158,11,0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STATUS */}
      <div className={styles.panel}>
        <h3>Trạng thái đơn hàng</h3>

        {(dashboard.ordersByStatus || []).map((item: any) => (
          <div key={item.status} className={styles.row}>
            <span>{item.status}</span>
            <b className={`${styles.badge} ${getStatusBadge(item.status)}`}>
              {item.count}
            </b>
          </div>
        ))}
      </div>

      {/* RECENT */}
      <div className={styles.panel}>
        <h3>Đơn hàng gần đây</h3>

        {recent.map((o: any) => (
          <div key={o.orderId} className={styles.row}>
            <span>#{o.orderId} - {o.customerName}</span>
            <b>{o.totalAmount?.toLocaleString?.() || 0} đ</b>
          </div>
        ))}
      </div>

      {/* TOP */}
      <div className={styles.grid2}>
        <div className={styles.panel}>
          <h3>Bán chạy</h3>
          {topSelling.map((b: any) => (
            <div key={b.bookId} className={styles.row}>
              <span>{b.title}</span>
              <b>{b.totalQuantitySold}</b>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <h3>Đánh giá cao</h3>
          {topRated.map((b: any) => (
            <div key={b.bookId} className={styles.row}>
              <span>{b.title}</span>
              <b>{b.avgRating}</b>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}