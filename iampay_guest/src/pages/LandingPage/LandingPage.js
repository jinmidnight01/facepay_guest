import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../css/LandingPage.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";
import Button from "../../components/Button";

const LandingPage = () => {
  const navigator = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
          navigator("/mypage", { state: response.data });
        })
        .catch((error) => {
          console.log(error);
          localStorage.removeItem("accessToken");
          navigator("/");
        });
    } else {
      setIsLoading(false);
    }
  }, [navigator]);

  return (
    <div>
      <Header logoLink="/" />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className={styles.homeTitle}>서비스 소개</div>

          <div className={styles.serviceGuideBox}>
            <div className={styles.serviceGuide}>
              <span>나는</span>
              <span>PAY</span>는 <span>오프라인 얼굴 결제 서비스</span>로,
              일부 고객들을 대상으로 현재{" "}
              <Link
                to="https://www.instagram.com/cafeseomoon"
                className={styles.cafeSeomoonLink}
              >
                카페서문
              </Link>
              에서 <span>서비스</span>를 운영 중입니다.
            </div>
            {/* <div className={styles.newSignup}>
              ❗<span>신규 가입자</span>에게 <span>1만원 포인트</span> 제공❗
            </div>
            <br />
            <div className={styles.serviceGuide}>
              <span>1만원</span>이 소진되고 나서도, <span>서비스</span>를 계속 이용할 수 있습니다.
            </div> */}
            <div className={styles.contentBox}>
              <span className={styles.contentTitle}>📌 <span className={styles.redTitle}>1만원 포인트</span> 제공</span>
              {/* <div>
                1. <span>연세대학교</span> 대학생/대학원생 (재휴학)
              </div> */}
              <div>
                1. <span>조건</span>: (카페서문) <span>주 1회</span> 이상 방문
              </div>
              <div>
                2. <span className={styles.redTitle}>1만원</span>이 소진되고 나서도, <span>서비스</span>를 계속 이용할 수 있습니다.
              </div>
            </div>
            <div className={styles.contentBox}>
              <span className={styles.contentTitle}>📌 결제/정산 방식</span>
              <div>
                1. <span>선 주문</span> : 매장 <span>태블릿</span>으로{" "}
                <span>얼굴결제</span> 진행
              </div>
              <div>
                2. <span>후 정산</span> : <span>매달 1일, 16일</span>에{" "}
                <span>정산</span> 진행
              </div>
              <div>
                (문자 전송될 <span>계좌</span>로 <span>누적 정산금액</span> 이체)
              </div>
            </div>
            {/* <div className={styles.contentBox}>
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
            </div> */}
          </div>

          {/* <div className={styles.loginLinkBox}>
            <Link to="/login" className={styles.loginLink}>
              이미 가입하셨나요?
            </Link>
          </div> */}

          <Button
            buttonLink="/signup"
            buttonText="포인트 받기"
            buttonColor="#FF5555"
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default LandingPage;
