import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./features/cart/context/CartContext";
import { PendingActionGuard } from "./features/auth/components/PendingActionGuard";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <PendingActionGuard>
          <AppRoutes />
        </PendingActionGuard>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;