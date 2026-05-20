import { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";

import {
  getDashboard,
  getRevenueChart,
  getTopSellingBooks,
  getTopRatedBooks,
  getRecentOrders,
} from "../../../../services/dashboardApi";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dashboard, chart, topSelling, topRated, recent] =
          await Promise.all([
            getDashboard({ range: "today", limit: 10 }),
            getRevenueChart("today"),
            getTopSellingBooks("month", 5),
            getTopRatedBooks(5),
            getRecentOrders(5),
          ]);

        setData({
          dashboard,
          chart,
          topSelling,
          topRated,
          recent,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  if (!data) return <div className={styles.error}>No data</div>;

  const d = data.dashboard;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>📊 Admin Dashboard</h1>

      {/* ================= KPI ================= */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <p>Revenue</p>
          <h2>{d.totalRevenue.toLocaleString()} đ</h2>
        </div>

        <div className={styles.card}>
          <p>Orders</p>
          <h2>{d.totalOrders}</h2>
        </div>

        <div className={styles.card}>
          <p>Customers</p>
          <h2>{d.totalCustomers}</h2>
        </div>

        <div className={styles.cardDanger}>
          <p>Low Stock</p>
          <h2>{d.lowStockProducts}</h2>
        </div>
      </div>

      {/* ================= ORDERS STATUS ================= */}
      <div className={styles.panel}>
        <h3>📦 Order Status</h3>

        {d.ordersByStatus.map((s: any) => (
          <div key={s.status} className={styles.row}>
            <span>{s.status}</span>
            <b>{s.count}</b>
          </div>
        ))}
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div className={styles.panel}>
        <h3>🧾 Recent Orders</h3>

        {data.recent.map((o: any) => (
          <div key={o.orderId} className={styles.row}>
            <span>
              #{o.orderId} - {o.customerName}
            </span>
            <b>{o.totalAmount.toLocaleString()} đ</b>
          </div>
        ))}
      </div>

      {/* ================= TOP BOOKS ================= */}
      <div className={styles.grid2}>
        <div className={styles.panel}>
          <h3>🔥 Top Selling</h3>
          {data.topSelling.map((b: any) => (
            <div key={b.bookId} className={styles.row}>
              <span>{b.title}</span>
              <b>{b.totalQuantitySold}</b>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <h3>⭐ Top Rated</h3>
          {data.topRated.map((b: any) => (
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