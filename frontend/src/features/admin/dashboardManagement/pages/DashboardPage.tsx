import { useEffect, useState } from "react";
import {
  getDashboard,
  getOrderStatus,
} from "../../../../services/dashboardApi";

import styles from "./DashboardPage.module.css";

type DashboardData = {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  totalProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
};

type OrderStatus = {
  status: string;
  count: number;
};

const formatPrice = (value: number) => {
  return Number(value || 0).toLocaleString("vi-VN") + " ₫";
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardRes = await getDashboard();
        const statusRes = await getOrderStatus();

        setDashboard(dashboardRes.result);
        setOrderStatus(statusRes.result);
      } catch (error) {
        console.error("ERROR FETCH DASHBOARD:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Đang tải dashboard...</div>;
  }

  if (!dashboard) {
    return <div className={styles.loading}>Không có dữ liệu</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* ================= OVERVIEW ================= */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Tổng đơn hàng</h3>
          <p>{dashboard.totalOrders}</p>
        </div>

        <div className={styles.card}>
          <h3>Doanh thu tổng</h3>
          <p>{formatPrice(dashboard.totalRevenue)}</p>
        </div>

        <div className={styles.card}>
          <h3>Doanh thu tháng</h3>
          <p>{formatPrice(dashboard.monthlyRevenue)}</p>
        </div>

        <div className={styles.card}>
          <h3>Doanh thu hôm nay</h3>
          <p>{formatPrice(dashboard.dailyRevenue)}</p>
        </div>

        <div className={styles.card}>
          <h3>Tổng sản phẩm</h3>
          <p>{dashboard.totalProducts}</p>
        </div>

        <div className={styles.card}>
          <h3>Sắp hết hàng</h3>
          <p>{dashboard.lowStockProducts}</p>
        </div>

        <div className={styles.card}>
          <h3>Hết hàng</h3>
          <p>{dashboard.outOfStockProducts}</p>
        </div>
      </div>

      {/* ================= ORDER STATUS ================= */}
      <div className={styles.statusSection}>
        <h2>Trạng thái đơn hàng</h2>

        <div className={styles.statusGrid}>
          {orderStatus.map((item, index) => (
            <div key={index} className={styles.statusCard}>
              <span>{item.status}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}