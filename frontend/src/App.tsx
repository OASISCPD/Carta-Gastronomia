import { BrowserRouter } from "react-router-dom"
import { RouterContainer } from "./core/routes/index.routes"
import { ToastContainer } from "react-toastify"

function App() {

  return (

    <BrowserRouter >
      <ToastContainer theme='dark' />
      <RouterContainer />
    </BrowserRouter>
  )
}

export default App
