import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.Sidebar.css";

import Sidebar from "./Sidebar";
import { userApi } from "../../../../services/userApi";
import { useAuth } from "../../../auth/hooks/useAuth";

type User = {
  id?: string | number;
  userId?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  dob?: Date | string | null;
  gender?: string;
  role?: string;
  avatarUrl?: string;
};

type EditableProfileField = "name" | "phone" | "dob";

export default function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(() => authUser);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        if (authUser) {
          setUser((prev) => prev ?? authUser);
        }

        const data = await userApi.getMe();

        if (!isMounted) return;

        if (data) {
          setUser(data);
          return;
        }

        if (authUser) {
          setUser(authUser);
        }
      } catch (error) {
        console.error("FETCH USER ERROR:", error);

        if (isMounted && authUser) {
          setUser(authUser);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const handleSaveField = async (
    field: EditableProfileField,
    value: string
  ) => {
    if (!user) return null;

    const updated = await userApi.updateMe({
      [field]: value,
    });

    setUser(updated);

    updateUser({
      name: updated.name,
      phone: updated.phone,
      avatarUrl: updated.avatarUrl,
    });

    return updated;
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-page">
      <Sidebar />

      <div className="content">
        <Outlet
          context={{
            user,
            handleSaveField,
          }}
        />
      </div>
    </div>
  );
}
