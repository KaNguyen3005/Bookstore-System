import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import CategoryPage from "../pages/CategoryPage";
import ProductDetailPage from "../pages/ProductDetailPage";

import ProtectedRoute from "../pages/Auth/ProtectedRoute";
import Profile from "../pages/User/Profile";
import ProfileContent from "../pages/User/ProfileContent";
import ChangePassword from "../pages/User/ChangePassword";
import PersonalInfor from "../pages/User/PersonalInfor";
import PurchaseOrder from "../pages/User/PurchaseOrder";
import Address from "../pages/User/Address";
import Voucher from "../pages/User/Voucher";
import MemberRank from "../pages/User/MemberRank";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Otp from "../pages/Auth/Otp";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        <Route path="category" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />

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
    </Routes>
  );
}