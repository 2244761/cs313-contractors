import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Login } from "./components/parts/Login";
// import { Register } from "./components/parts/Register";
import { Login } from "./components/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
