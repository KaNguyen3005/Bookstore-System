import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/Profile.css";
import Sidebar from "./Sidebar";
import { UserService } from "../../services/UserService";

export default function Profile() {

  const [user,setUser] = useState<any>(null);
  const [edit,setEdit] = useState(false);
  const [avatar,setAvatar] = useState("");


useEffect(() => {
  const fetchUser = async () => {
    const data = await UserService.getUserById(1);
    if (data) {
      setUser(data);
      setAvatar(data.avatar || "");
    }
    setAvatar(data?.avatar || "");
  };

  fetchUser();
}, []);

  const handleAvatar = (e:any)=>{

    const file = e.target.files[0];

    if(file){

      const url = URL.createObjectURL(file);

      setAvatar(url);

      const updatedUser = {
        ...user,
        avatar: url
      };

      setUser(updatedUser);

      localStorage.setItem("user",JSON.stringify(updatedUser));

    }

  };

  const handleChange = (e:any)=>{

    const {name,value} = e.target;

    setUser((prev:any)=>({

      ...prev,
      [name]:value

    }));

  };

const handleSave = async () => {

  const updated = await UserService.updateUser(user);

  setUser(updated);
  localStorage.setItem("user", JSON.stringify(updated));

  setEdit(false);

  alert("Đã lưu thông tin");
};

  return (

    <div className="account-page">

      <Sidebar />

      <div className="content">

        <Outlet
          context={{
            user,
            edit,
            setEdit,
            avatar,
            handleAvatar,
            handleChange,
            handleSave
          }}
        />

      </div>

    </div>

  );

}