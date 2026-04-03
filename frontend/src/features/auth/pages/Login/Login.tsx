import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import users from "../../../../data/user1";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");

    const from = location.state?.from || "/";

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();

      const user = users.find(
        (u) =>
          (u.email === account || u.phone === account) &&
          u.password === password
      );

      if (user) {
        login({
          id: user.user_id,
          email: user.email,
          phone: user.phone,
          username: user.username,
          fullname: `${user.first_name} ${user.last_name}`,
          role_id: user.role_id,
        }); 

        if (user.role_id === 2) {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
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