import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import { AuthProvider } from "./features/auth/context/AuthContext";
import { CartProvider } from "./features/cart/context/CartContext";

import { PendingActionGuard } from "./features/auth/components/PendingActionGuard";

import ScrollToTop from "./shared/components/ScrollToTop/ScrollToTop";
import { ToastProvider } from "./shared/components/Toast/ToastProvider";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />

            <PendingActionGuard>
              <AppRoutes />
            </PendingActionGuard>

          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;