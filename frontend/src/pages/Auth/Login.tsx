import "../../styles/Login.css";

const Login =() => {
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
                <p className ="register">Đăng ký tài khoản</p>
            </div>
        </div>
        )
    }

export default Login;