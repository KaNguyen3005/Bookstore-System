import Test from "./pages/test.tsx";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <Header />
      <main>
            <Test/>
      </main>
      <Footer />
    </>
  );
}

export default App;