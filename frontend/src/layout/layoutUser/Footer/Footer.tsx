import React from "react";
import "./Footer.css";
import logo from "../../../assets/images/logo.png";

import { MdOutlineEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { AiFillTikTok } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer: React.FC = () => {

    const scrollToTop = () => {
      window.scrollTo(0,0);
    };

  return (
    <footer className="footer">

      {/* TOP MESSAGE */}
      <div className="footer-feedback">
        Nếu bạn có bất kỳ phản hồi nào về trang này, KaTiIa rất mong nhận được ý kiến đóng góp của bạn.
       <a
       href="https://forms.gle/FBgRFddiqnzb9aBb9"
       target="_blank"
       rel="noopener noreferrer"
       className="link"
       >
       Vui lòng gửi phản hồi của bạn tại đây.
       </a>
      </div>

      {/* BACK TO TOP */}
      <div className="back-top" onClick={scrollToTop}>
      Trở lại đầu trang
      </div>

      {/* MAIN FOOTER */}
      <div className="footer-main">

        {/* LEFT */}
        <div className="footer-col logo-col">
          <h1 className="logo-footer">
                    <Link to="/" className="logo-header" onClick={scrollToTop}>
                      <img src={logo} alt="logo" className="logo-img" />
                    </Link>
          </h1>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Nhà sách số 1 Việt Nam
          </p>

          <div className="contact">
            <h4>Liên hệ </h4>
           <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
             <FaMapMarkerAlt />
             Trụ sở chính: 97 Man Thiện, TP. Thủ Đức, TP. Hồ Chí Minh
           </p>
            <p style={{ display: "flex", alignItems: "center", gap: "6px" }}> <MdOutlineEmail /> Email: Katilaskh@gmail.com</p>
            <p style={{ display: "flex", alignItems: "center", gap: "6px" }}> 📞 Hotline khách hàng: 0299 868 799</p>
          </div>

          <h4>Hệ thống cửa hàng KaTiIa</h4>
          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaMapMarkerAlt /> Cơ sở 1: 123 Ngọc Thị, Tp Thủ Đức, Tp Hồ Chí Minh</p>
          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaMapMarkerAlt /> Cơ sở 2: 345 Khánh Huyền, Quận 5, Tp Hồ Chí Minh</p>
          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaMapMarkerAlt /> Cơ sở 3: 678 Baka, Q1, Tp Hồ Chí Minh</p>
        </div>

        {/* PAYMENT */}
        <div className="footer-col">
          <h4>Hỗ trợ thanh toán</h4>
          <p>MoMo</p>
          <p>VN Pay</p>
          <p>Nạp tiền vào tài khoản KaTiIa</p>
          <p>Thẻ tín dụng</p>
        </div>

        {/* ABOUT */}
        <div className="footer-col">
          <h4>Tìm hiểu về KATIIA</h4>
          <p>Thành lập</p>
          <p>Nhà đầu tư</p>
          <p>Cộng đồng</p>
          <p>KaTiIa Payment</p>
        </div>

        {/* HELP */}
        <div className="footer-col">
          <h4>KaTiIa giúp bạn</h4>
          <p>Tài khoản của bạn</p>
          <p>Đơn hàng của bạn</p>
          <p>Chính sách vận chuyển</p>
          <p>Chính sách đổi trả hàng</p>
          <p>Giúp đỡ</p>
        </div>

      </div>


            {/* SOCIAL */}
           <div className="social-icon">
             <div className="footer-social">

               <a href="https://facebook.com" target="_blank" rel="noreferrer">
                 <FaFacebookSquare />
               </a>

               <a href="https://instagram.com" target="_blank" rel="noreferrer">
                 <FaInstagram />
               </a>

               <a href="https://zalo.me" target="_blank" rel="noreferrer">
                 <SiZalo />
               </a>

               <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                 <AiFillTikTok />
               </a>

               <a href="https://youtube.com" target="_blank" rel="noreferrer">
                 <FaYoutube />
               </a>

             </div>
           </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
              <p>
                Thông báo bản quyền | Điều khoản & Điều kiện | Chính sách bảo mật | Chính sách cookie
              </p>
              <p>KaTiIa.com</p>
              <p>Gửi phản hồi tại thông liên hệ KaTiIa</p>
            </div>

    </footer>
  );
};

export default Footer;