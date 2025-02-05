import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import HomePage from "./pages/HomePage";
import { ROUTES } from "./Routes.tsx";
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path={ROUTES.HOME} index element={<HomePage />} />
      <Route path={ROUTES.APARTMENTS} element={<Page1 />} />
      <Route path={`${ROUTES.APARTMENTS}/:id`} element={<Page2 />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
