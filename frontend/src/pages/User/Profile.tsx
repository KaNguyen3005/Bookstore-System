import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/Profile.css";
import Sidebar from "./Sidebar";

export default function Profile() {

  const [user,setUser] = useState<any>(null);
  const [edit,setEdit] = useState(false);
  const [avatar,setAvatar] = useState("");

  useEffect(()=>{

    const data = localStorage.getItem("user");

    if(data){

      const parsedUser = JSON.parse(data);

      setUser(parsedUser);
      setAvatar(parsedUser.avatar || "");

    }

  },[]);

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

  const handleSave = ()=>{

    localStorage.setItem("user",JSON.stringify(user));

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