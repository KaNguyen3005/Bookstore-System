import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./features/cart/context/CartContext";
import { PendingActionGuard } from "./features/auth/components/PendingActionGuard";
import ScrollToTop from "./shared/components/ScrollToTop/ScrollToTop";
import { ToastProvider } from "./shared/components/Toast/ToastProvider";

function App() {
  return (
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
  );
}

export default App;
