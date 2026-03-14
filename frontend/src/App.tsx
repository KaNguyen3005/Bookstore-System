import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";

import Profile from "./pages/User/Profile";
import ProfileContent from "./pages/User/ProfileContent";
import ChangePassword from "./pages/User/ChangePassword";
import PersonalInfor from "./pages/User/PersonalInfor";
import Voucher from "./pages/User/Voucher";
import MemberRank from "./pages/User/MemberRank";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />

          {/* Category */}
          <Route path="category" element={<CategoryPage />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />}>
            <Route index element={<ProfileContent />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="info" element={<PersonalInfor />} />
            <Route path="voucher" element={<Voucher />} />
            <Route path="member" element={<MemberRank />} />
          </Route>

          {/* Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
