import "./otp.css";
import { Link } from "react-router-dom";

const OTP =() => {

      const scrollToTop = () => {
        window.scrollTo(0, 0);
      };

    return (
        <div className ="otp-page">
            <div className ="otp-container" >
                <h1 className ="logo-otp"> KATIIA BOOKSTORE </h1>
                <p className = "subtitle">Đăng ký tài khoản </p>

                <form className ="otp-form">
                    <input
                    type ="text"
                    placeholder ="Nhập mã xác nhận "
                    />

                    <button type ="submit">
                    Xác nhận
                    </button>
                </form>

            </div>
        </div>
        )
    }

export default OTP;