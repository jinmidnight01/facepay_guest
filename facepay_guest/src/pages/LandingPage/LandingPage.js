import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../css/LandingPage.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import FacepayImg from "../../images/facepayImg.png";

const LandingPage = () => {
  const navigator = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);
  const [showButton, setShowButton] = useState(false); // 버튼 표시 여부

  // auto login
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get(`${hostURL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // navigator("/mypage", { state: response.data });
          localStorage.removeItem("accessToken");
          navigator("/");
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          localStorage.removeItem("accessToken");
          navigator("/");
        });
    } else {
      setIsLoading(false);
    }

    // 첫 번째 텍스트는 0.5초 후 나타남
    const timer1 = setTimeout(() => setShowText1(true), 300);
    // 두 번째 텍스트는 1초 후 나타남
    const timer2 = setTimeout(() => setShowText2(true), 600);
    // 세 번째 텍스트는 1.5초 후 나타남
    const timer3 = setTimeout(() => setShowText3(true), 1000);
    const timer4 = setTimeout(() => setShowButton(true), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [navigator]);

  return (
    <div>
      <Header logoLink="/" />
      {isLoading ? (
        <div className={styles.loadingBox}>
          <Loading />
          <div className={styles.signupLoadingBox}>
            <div className={styles.signupLoading}>로딩 중 ...</div>
          </div>
        </div>
      ) : (
        <div>
          {/* <div className={styles.homeTitle}>서비스 소개</div>

          <div className={styles.serviceGuideBox}>
            <div className={styles.serviceGuide}>
              <span>FACE</span>
              <span>PAY</span>는 <span>오프라인 얼굴 결제 서비스</span>로, 현재{" "}
              <Link
                to="https://www.instagram.com/cafeseomoon"
                className={styles.cafeSeomoonLink}
              >
                카페서문
              </Link>
              에서 운영 중입니다.
            </div>
            <div className={styles.newSignup}>
              ❗<span>신규 가입자</span>에게 <span>1만원 포인트</span> 제공❗
            </div>
            <br />
            <div className={styles.serviceGuide}>
              <span>1만원</span>이 소진되고 나서도, <span>서비스</span>를 계속 이용할 수 있습니다.
            </div>
            <div className={styles.contentBox}>
              <span className={styles.contentTitle}>
                📌 <span className={styles.redTitle}>500원 할인</span> 혜택
              </span>
              <div>
                1. <span>연세대학교</span> 대학생/대학원생 (재휴학)
              </div>
              <div>
                1. <span>결제할 때마다</span> (1000원 이상 건)
              </div>
              <div>
                2. <span>24년 10월까지</span> (연장 가능)
              </div>
            </div>
            <div className={styles.contentBox}>
              <span className={styles.contentTitle}>
                📌 <span className={styles.redTitle}>다음 달 정산</span> 방식
              </span>
              <div>
                1. <span>계좌/카드</span> 따로 <span>연동하지 않음</span>
              </div>
              <div>
                2. <span>매달 1일</span>에 <span>계좌이체</span> (전월 분)
              </div>
            </div>
            <div className={styles.contentBox}>
              <span className={styles.contentTitle}>📌 기타 사항</span>
              <div>
                1. 전화번호로 <span>현금영수증</span> 발행 가능
              </div>
              <div>
                2. 주문 때마다 <span>결제승인 문자</span> 발송
              </div>
              <div>
                3. 비정상적 결제 확인 시, <span>계정 정지</span> 가능
              </div>
            </div>
          </div> */}

          {/* <div className={styles.loginLinkBox}>
            <Link to="/login" className={styles.loginLink}>
              이미 가입하셨나요?
            </Link>
          </div> */}

          <div className={styles.textBox}>
            <div
              className={`${styles.textNoCard} ${
                showText1 ? styles.fadeIn : ""
              }`}
            >
              카드 없이
            </div>
            <div
              className={`${styles.textFacePayment} ${
                showText2 ? styles.fadeIn : ""
              }`}
            >
              내 얼굴로 결제
            </div>
            <div
              className={`${styles.serviceDescription} ${
                showText3 ? styles.fadeIn : ""
              }`}
            >
              오프라인 얼굴 결제 서비스
            </div>
            <div
              className={`${styles.buttonWrapper} ${
                showButton ? styles.fadeInUp : ""
              }`}
            >
              {showButton && (
                <Button
                  buttonLink="/selfi"
                  buttonText="등록하기"
                  buttonColor="#FF5555"
                />
              )}
            </div>
          </div>

          <div className={styles.footerBox}>
            <div className={styles.footerImgBox}>
              <img
                src={FacepayImg}
                alt="facepay"
                className={styles.facepayImg}
              />
            </div>
          </div>
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;
