import { BrowserRouter } from "react-router-dom";
import { RouterContainer } from "./core/routes/index.routes";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./core/components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer theme="dark" />
      <RouterContainer />
    </BrowserRouter>
  );
}

export default App;
