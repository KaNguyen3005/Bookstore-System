import React from "react";
import { LayoutDashboard, BookOpen, ShoppingBag, DollarSign, Users } from "lucide-react";
import StatsCard from "../components/StatsCard/StatsCard";
import RevenueChart from "../components/RevenueChart/RevenueChart";
import RecentOrdersTable from "../components/RecentOrdersTable/RecentOrdersTable";
import BestSellersList from "../components/BestSellersList/BestSellersList";
import { useDashboardData } from "../hooks/useDashboardData";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { summary, recentOrders, revenueData, topBooks, loading, error } = useDashboardData();

  if (loading) return <div className="loading-state">Đang tải dữ liệu dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!summary) return null;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <LayoutDashboard size={24} color="#72a9a3" />
        <h1 className="dashboard-title">Dashboard</h1>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          icon={BookOpen}
          label="Tổng sách"
          value={summary.totalBooks}
          change="12%"
          iconBg="#eff6ff"
        />
        <StatsCard
          icon={ShoppingBag}
          label="Đơn hàng"
          value={summary.totalOrders}
          change="5%"
          iconBg="#fff7ed"
        />
        <StatsCard
          icon={DollarSign}
          label="Doanh thu"
          value={summary.revenue.toLocaleString() + "đ"}
          change="3%"
          bgColor="#82b170"
          textColor="white"
          iconBg="rgba(255,255,255,0.2)"
        />
        <StatsCard
          icon={Users}
          label="Khách hàng"
          value={summary.customers}
          change="2%"
          isPositive={true}
          bgColor="#55858b"
          textColor="white"
          iconBg="rgba(255,255,255,0.2)"
        />
      </div>

      {/* Charts & Tables */}
      <div className="charts-orders-container">
        <RevenueChart data={revenueData} />
        <RecentOrdersTable orders={recentOrders} />
      </div>

      {/* Best Sellers */}
      <BestSellersList books={topBooks} />
    </div>
  );
};

export default Dashboard;
