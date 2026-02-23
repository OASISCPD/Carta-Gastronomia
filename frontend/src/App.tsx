import { HashRouter } from "react-router-dom";
import { RouterContainer } from "./core/routes/index.routes";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./core/components/ScrollToTop";

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <ToastContainer theme="dark" />
      <RouterContainer />
    </HashRouter>
  );
}

export default App;
