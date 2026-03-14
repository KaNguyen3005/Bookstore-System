import "../../styles/Login.css";
import { Link } from "react-router-dom";

const Login =() => {

      const scrollToTop = () => {
        window.scrollTo(0, 0);
      };

    return (
        <div className ="login-page">
            <div className ="login-container" >
                <h1 className ="logo"> KATIIA BOOKSTORE </h1>
                <p className = "subtitle">Đăng nhập tài khoản </p>

                <form className ="login-form">
                    <input
                    type ="text"
                    placeholder ="Email hoặc số di động"
                    />

                    <input
                    type ="password"
                    placeholder="Mật khẩu"
                    />

                    <button type ="submit">
                    Đăng nhập
                    </button>
                </form>

                <p className ="forgot ">Quên mật khẩu</p>

                <Link to="/register" className="register" onClick={scrollToTop}>
                  Đăng ký tài khoản
                </Link>
            </div>
        </div>
        )
    }

export default Login;