import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import MyPage from "./pages/MyPage/MyPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import RecordPage from "./pages/MyPage/RecordPage";
import LoginPage from "./pages/LandingPage/LoginPage";
import FaceCameraPage from "./pages/SignupPage/FaceCameraPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/facecamera" element={<FaceCameraPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/record" element={<RecordPage />} />
      <Route path={"*"} element={<NotFoundPage />}/>
    </Routes>
  );
}

export default App;
