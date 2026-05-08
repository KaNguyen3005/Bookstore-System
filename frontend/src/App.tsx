import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./features/cart/context/CartContext";
import { PendingActionGuard } from "./features/auth/components/PendingActionGuard";
import ScrollToTop from "./shared/components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />

        <PendingActionGuard>
          <AppRoutes />
        </PendingActionGuard>

      </BrowserRouter>
    </CartProvider>
  );
}

export default App;