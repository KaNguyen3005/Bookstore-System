import { Routes, Route } from "react-router-dom";

import Layout from "../layout/layoutUser/MainLayout/Layout";

import Home from "../features/home/pages/Home/Home";
import CategoryPage from "../features/category/pages/CategoryPage/CategoryPage";
import ProductDetailPage from "../features/product/pages/ProductDetailPage/ProductDetailPage";
import Cart from "../features/cart/pages/Cart/Cart";
import ProtectedRoute from "../features/auth/routes/ProtectedRoute";
import CheckoutPage from "../features/checkout/pages/CheckoutPage/CheckoutPage";
import Profile from "../features/UserProfile/pages/ProfileUser/Profile";
import ProfileContent from "../features/UserProfile/components/ProfileDetail/ProfileContent";

import ChangePassword from "../features/UserProfile/components/ChangePassword/ChangePassword";
import PersonalInfor from "../features/UserProfile/components/PersonalInfor/PersonalInfor";
import PurchaseOrder from "../features/UserProfile/components/PurchaseOrder/PurchaseOrder";
import Address from "../features/UserProfile/components/Address/Address";
import Voucher from "../features/UserProfile/components/Voucher/Voucher";
import MemberRank from "../features/UserProfile/components/MemberRank/MemberRank";

import Login from "../features/auth/pages/Login/Login";
import Register from "../features/auth/pages/Register/Register";
import Otp from "../features/auth/pages/Otp/Otp";

import LayoutAdmin from "../layout/layoutAdmin/MainLayout/LayoutAdmin";
import CustomerManagement from "../features/admin/pages/CustomerManagement/CustomerManagement";
import StatisticalReportManagement from "../features/admin/pages/StatisticalReportManagement/StatisticalReportManagement";
import SearchPage from "../features/Search/pages/SearchPage/SearchPage";

import AdminHome from "../features/admin/pages/AdminHome/AdminHome";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        <Route path="category" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="search" element={<SearchPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileContent />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="info" element={<PersonalInfor />} />
          <Route path="address" element={<Address />} />
          <Route path="purchaseorder" element={<PurchaseOrder />} />
          <Route path="voucher" element={<Voucher />} />
          <Route path="member" element={<MemberRank />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="otp" element={<Otp />} />

      </Route>


      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >
        <Route element={<AdminHome />}>
          <Route index element={<div>Dashboard Admin</div>} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="statistical_report" element={<StatisticalReportManagement/>} />
        </Route>


      </Route>

    </Routes>
  );
}