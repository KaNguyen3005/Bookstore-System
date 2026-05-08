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
                <p className = "subtitle">Nhập mã xác nhận</p>

                <form className ="otp-form">
                    <input
                    type ="text"
                    placeholder ="Mã xác nhận "
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