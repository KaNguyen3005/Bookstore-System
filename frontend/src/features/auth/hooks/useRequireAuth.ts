import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export interface PendingAction {
  type: string;
  payload: any;
  timestamp: number;
}

export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleProtectedAction = (
    action: () => void,
    pendingMetadata?: { type: string; payload: any }
  ) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để tiếp tục");

      // lưu action đang làm
      if (pendingMetadata) {
        const pendingAction: PendingAction = {
          ...pendingMetadata,
          timestamp: Date.now(),
        };

        sessionStorage.setItem(
          "pendingAction",
          JSON.stringify(pendingAction)
        );
      }

      // redirect login + nhớ trang trước
      navigate("/login", {
        state: { from: location },
        replace: true,
      });

      return;
    }

    action();
  };

  return { handleProtectedAction };
};