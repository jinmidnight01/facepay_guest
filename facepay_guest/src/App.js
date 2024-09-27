import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import MyPage from "./pages/MyPage/MyPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import RecordPage from "./pages/MyPage/RecordPage";
import LoginPage from "./pages/LandingPage/LoginPage";
import FaceCameraPage from "./pages/SignupPage/FaceCameraPage";
import SelfiSignupPage from "./pages/NewSignupPage/SelfiSignupPage";
import PhoneNumberPage from "./pages/NewSignupPage/PhoneNumberPage";
import HowToOrderPage from "./pages/VerificationPage/HowToOrderPage";
import HowToMoneyPage from "./pages/VerificationPage/HowToMoneyPage";
import NotiPaymentPage from "./pages/VerificationPage/NotiPaymentPage";
import ServicePlacePage from "./pages/VerificationPage/ServicePlacePage";
import EventPage from "./pages/VerificationPage/EventPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/signup" element={<SignupPage />} /> */}
      {/* <Route path="/signup/facecamera" element={<FaceCameraPage />} /> */}
      {/* <Route path="/mypage" element={<MyPage />} /> */}
      {/* <Route path="/mypage/record" element={<RecordPage />} /> */}
      <Route path="/selfi" element={<SelfiSignupPage />} />
      <Route path="/phone" element={<PhoneNumberPage />} />
      <Route path="/howtoorder" element={<HowToOrderPage />} />
      <Route path="/howtomoney" element={<HowToMoneyPage />} />
      <Route path="/notipayment" element={<NotiPaymentPage />} />
      <Route path="/serviceplace" element={<ServicePlacePage />} />
      <Route path="/event" element={<EventPage />} />
      <Route path={"*"} element={<NotFoundPage />}/>
    </Routes>
  );
}

export default App;
