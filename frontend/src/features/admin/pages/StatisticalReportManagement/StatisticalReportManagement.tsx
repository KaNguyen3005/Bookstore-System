import { useState } from "react";
import "./StatisticalReportManagement.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// 👇 import component bạn đã tách
import BigCard from "./BigCard";
import SmallCard from "./SmallCard";
import FilterBar from "./FilterBar";

export default function StatisticalReport() {
  const filters = [
    "Hôm nay",
    "Hôm qua",
    "3 ngày qua",
    "7 ngày",
    "Tháng trước",
  ];

  const [active, setActive] = useState("Hôm nay");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleQuickFilter = (type: string) => {
    setActive(type);

    const today = new Date();
    let from = new Date();

    switch (type) {
      case "Hôm nay":
        from = today;
        break;
      case "Hôm qua":
        from = new Date(today);
        from.setDate(today.getDate() - 1);
        break;
      case "3 ngày qua":
        from.setDate(today.getDate() - 3);
        break;
      case "7 ngày":
        from.setDate(today.getDate() - 7);
        break;
      case "Tháng trước":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        today.setDate(0);
        break;
    }

    setFromDate(from.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  };

  const handleFilter = () => {
    if (fromDate && toDate && fromDate > toDate) {
      alert("Ngày không hợp lệ");
      return;
    }
    console.log("Filter:", fromDate, toDate);
  };

  const topBooks = [
    { id: "S001", name: "Doraemon tập 1", category: "Thiếu nhi", sold: 150, revenue: "15.000.000đ" },
    { id: "S002", name: "Thám tử Conan tập 10", category: "Trinh thám", sold: 120, revenue: "18.000.000đ" },
    { id: "S003", name: "Harry Potter tập 1", category: "Fantasy", sold: 90, revenue: "27.000.000đ" },
    { id: "S004", name: "Nhà giả kim", category: "Tiểu thuyết", sold: 70, revenue: "14.000.000đ" },
  ];

  const chartData = [
    { name: "Thứ 2", value: 350 },
    { name: "Thứ 3", value: 230 },
    { name: "Thứ 4", value: 360 },
    { name: "Thứ 5", value: 410 },
    { name: "Thứ 6", value: 510 },
    { name: "Thứ 7", value: 570 },
    { name: "CN", value: 350 },
  ];

  const handleExportExcel = () => {
    const data = topBooks.map((item) => ({
      "Mã sách": item.id,
      "Tên sách": item.name,
      "Thể loại": item.category,
      "Số lượng": item.sold,
      "Doanh thu": item.revenue,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Top sách");

    const file = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([file]), "bao-cao.xlsx");
  };

  return (
    <div>
      <h2>Báo cáo, xem chi tiết và xuất dữ liệu thống kê</h2>

      <div className="report-container">
      <h3> Tổng quan thống kế </h3>
            <FilterBar
              filters={filters}
              active={active}
              fromDate={fromDate}
              toDate={toDate}
              onQuickFilter={handleQuickFilter}
              onFromDateChange={(v) => {
                setFromDate(v);
                setActive("");
              }}
              onToDateChange={(v) => {
                setToDate(v);
                setActive("");
              }}
              onFilter={handleFilter}
            />
        <div className="box">
          <BigCard title="Doanh thu" count="391 hóa đơn" value="680.973.324đ" trend="12%" trendType="up" />
          <BigCard title="Tiền trả hàng" count="24 hóa đơn" value="5.673.671đ" trend="10%" trendType="down" />
          <BigCard title="Giảm giá" count="391 hóa đơn" value="15.673.671đ" trend="5%" trendType="down" />
        </div>

        <div className="box">
          <SmallCard title="Đơn đã giao" value={391} />
          <SmallCard title="Đơn chưa giao" value={35} />
          <SmallCard title="Đơn bị hủy" value={7} />
        </div>


        <div className="table-wrapper">
          <h3>Top sách bán chạy</h3>

          <table className="product-table">
            <thead>
              <tr>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Thể loại</th>
                <th>Số lượng đã bán</th>
                <th>Doanh thu</th>
                <th>Quản lý</th>
              </tr>
            </thead>

            <tbody>
              {topBooks.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.sold}</td>
                  <td className="revenue">{item.revenue}</td>
                  <td>
                    <button className="button-card">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== CHART DOANH THU ===== */}
        <div className="chart-container">
          <h3>Biểu đồ doanh thu</h3>

          <FilterBar
            filters={filters}
            active={active}
            fromDate={fromDate}
            toDate={toDate}
            onQuickFilter={handleQuickFilter}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onFilter={handleFilter}
            onExport={handleExportExcel}
          />

          <div className="chart-box">
            <BarChart width={1000} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2c6f7b" />
            </BarChart>
          </div>
        </div>

        {/* ===== CHART KHÁC ===== */}
        <div className="chart-container">
          <h3>Biểu đồ đơn hàng</h3>

          <FilterBar
            filters={filters}
            active={active}
            fromDate={fromDate}
            toDate={toDate}
            onQuickFilter={handleQuickFilter}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onFilter={handleFilter}
          />

          <div className="chart-box">
            <BarChart width={1000} height={300} data={chartData}>
              <Bar dataKey="value" fill="#2c6f7b" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}