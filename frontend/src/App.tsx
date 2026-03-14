import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import Layout from "./components/layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/category" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;