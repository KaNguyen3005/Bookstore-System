import "../../styles/Login.css";

import users from "../../Data/user1.ts";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login =() => {

    const navigate = useNavigate();
        {/*test*/}
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
      e.preventDefault();

      const user = users.find(
        (u) =>
          (u.email === account || u.phone === account) &&
          u.password === password
      );

      if (user) {

        // lưu user
        localStorage.setItem("user", JSON.stringify(user));

        alert("Đăng nhập thành công");

        // chuyển trang home
        navigate("/", { replace: true });

      } else {
        alert("Sai tài khoản hoặc mật khẩu");
      }
    };

     const scrollToTop = () => {
         window.scrollTo(0, 0);
      };

    return (
        <div className ="login-page">
            <div className ="login-container" >
                <h1 className ="logo"> KATIIA BOOKSTORE </h1>
                <p className = "subtitle">Đăng nhập tài khoản </p>

                <form className ="login-form" onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Email hoặc tên đăng nhập"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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