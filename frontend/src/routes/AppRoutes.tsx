import { Routes, Route } from "react-router-dom";

//home user
import Layout from "../layout/layoutUser/MainLayout/Layout";

import Home from "../features/home/pages/Home/Home";
import CategoryPage from "../features/book-category/pages/CategoryPage";
import VoucherPage from "../features/voucher/pages/VoucherPage/VoucherPage";
import EbookPage from "../features/ebook/pages/EbookPage/EbookPage"
import ProductDetailPage from "../features/product/pages/ProductDetailPage/ProductDetailPage";
import Cart from "../features/cart/pages/Cart/Cart";
import BlogPage from "../features/blog/pages/BlogPage/BlogPage";
import CommunityPage from "../features/community/pages/CommunityPage/CommunityPage";
import CompaniesPage from "../features/companies/pages/CompaniesPage/CompaniesPage";
import MemberPage from "../features/member/pages/MemberPage/memberPage";

import ProtectedRoute from "../features/auth/routes/ProtectedRoute";

//thanhtoan dat hang
import CheckoutPage from "../features/checkout/pages/CheckoutPage/CheckoutPage";

import PaymentCallbackPage from "../features/checkout/pages/PaymentCallbackPage/PaymentCallbackPage";
import PaymentSuccessPage from "../features/checkout/pages/PaymentSuccessPage/PaymentSuccessPage";
import PaymentFailPage from "../features/checkout/pages/PaymentFailPage/PaymentFailPage";
import OrderSuccessPage from "../features/checkout/pages/OrderSuccessPage/orderSuccessPage";

/*UserProflie*/
import Profile from "../features/UserProfile/pages/ProfileUser/Profile";
import ProfileContent from "../features/UserProfile/components/ProfileDetail/ProfileContent";

import ResetPassword from "../features/UserProfile/components/ResetPassword/ResetPassword";
import PersonalInfor from "../features/UserProfile/components/PersonalInfor/PersonalInfor";
import PurchaseOrder from "../features/UserProfile/components/PurchaseOrder/PurchaseOrder";
import Address from "../features/UserProfile/components/Address/Address";
import Voucher from "../features/UserProfile/components/Voucher/Voucher";
import MemberRank from "../features/UserProfile/components/MemberRank/MemberRank";

/*auth*/
import Login from "../features/auth/pages/Login/Login";
import Register from "../features/auth/pages/Register/Register";
import Otp from "../features/auth/pages/Otp/Otp";

/*admin*/
import LayoutAdmin from "../layout/layoutAdmin/MainLayout/LayoutAdmin";
import AdminHome from "../layout/layoutAdmin/AdminHome/AdminHome";
import { CustomerManagement } from "../features/admin/customerManagement";
import { StatisticalReportManagement } from "../features/admin/reportManagement";
import { AuthorManagement } from "../features/admin/authorManagement";
import { ProductManagement } from "../features/admin/productManagement";
import { Dashboard } from "../features/admin/dashboardManagement";
import { OrderManagement } from "../features/admin/orderManagement";
import { VoucherManagement } from "../features/admin/voucherManagement";
import { CategoryManagement } from "../features/admin/categoryManagement";
import { PublisherManagement } from "../features/admin/publisherManagement";

/*search*/
import SearchPage from "../features/Search/pages/SearchPage/SearchPage";


export default function AppRoutes() {

  return (

    <Routes>

      {/* ========================= USER LAYOUT ========================= */}

      <Route
        path="/"
        element={<Layout />}
      >

        {/* HOME */}

        <Route
          index
          element={<Home />}
        />

        {/* PRODUCT */}

        <Route
          path="category"
          element={<CategoryPage />}
        />

        <Route path ="voucherPage" element ={<VoucherPage/>} />
        <Route path ="ebookPage" element ={<EbookPage/> } />
         <Route path="blogPage" element={<BlogPage />} />
         <Route path="communityPage" element={<CommunityPage />} />
         <Route path="companiesPage" element={<CompaniesPage />} />
         <Route path="memberPage" element={<MemberPage/>} />
        <Route
          path="product/:id"
          element={<ProductDetailPage />}
        />

        {/* SEARCH */}

        <Route
          path="search"
          element={<SearchPage />}
        />

        {/* CART */}

        <Route
          path="cart"
          element={<Cart />}
        />

        {/* ========================= CHECKOUT ========================= */}

        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* ========================= PAYMENT ========================= */}

        <Route
          path="payment/callback"
          element={<PaymentCallbackPage />}
        />

        <Route
          path="payment/success"
          element={<PaymentSuccessPage />}
        />

        <Route
          path="payment/fail"
          element={<PaymentFailPage />}
        />

        {/* ========================= COD SUCCESS ========================= */}

        <Route
          path="order-success"
          element={<OrderSuccessPage />}
        />

        {/* ========================= PROFILE ========================= */}

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<ProfileContent />}
          />

          <Route
            path="password"
            element={<ResetPassword />}
          />

          <Route
            path="info"
            element={<PersonalInfor />}
          />

          <Route
            path="address"
            element={<Address />}
          />

          <Route
            path="purchaseorder"
            element={<PurchaseOrder />}
          />

          <Route
            path="voucher"
            element={<Voucher />}
          />

          <Route
            path="member"
            element={<MemberRank />}
          />

        </Route>

        {/* ========================= AUTH ========================= */}

        <Route
          path="login"
          element={<Login />}
        />

        <Route
          path="register"
          element={<Register />}
        />

        <Route
          path="otp"
          element={<Otp />}
        />

      </Route>

      {/* ========================= ADMIN ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >

        <Route element={<AdminHome />}>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<ProductManagement />}
          />

          <Route
            path="categories"
            element={<CategoryManagement />}
          />

          <Route
            path="orders"
            element={<OrderManagement />}
          />

          <Route
            path="customers"
            element={<CustomerManagement />}
          />

          <Route
            path="statistical_report"
            element={
              <StatisticalReportManagement />
            }
          />

          <Route
            path="author"
            element={<AuthorManagement />}
          />

          <Route
            path="publishers"
            element={<PublisherManagement />}
          />

          <Route
            path="vouchers"
            element={<VoucherManagement />}
          />

        </Route>

      </Route>

    </Routes>
  );
}
