import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import hostURL from "../../hostURL";
import styles from "../../css/MyPage.module.css";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import arrow from "../../images/arrow.png";
import Button from "../../components/Button";

const MyPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUserData] = useState({});
  const navigator = useNavigate();
  const onClick = () => {
    navigator("/mypage/record", {
      state: { username: userData.username, total_price: userData.total_price },
    });
  };

  useEffect(() => {
    // user 정보 가져오기
    const token = localStorage.getItem("accessToken");
    axios
      .get(`${hostURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        navigator("/");
      });

    if (userData.verified === true) {
      setIsVerified(true);
    }
  }, [navigator, userData.verified]);

  return (
    <div>
      <Header logoLink="/mypage" />

      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {isVerified ? (
            <div>
              <div className={styles.welcomeText}>
                {userData.username}님, 안녕하세요
              </div>
              <div className={styles.guideText}>
                정산 방식은 아래 서비스 안내를 참고해주세요
              </div>
              <div className={styles.paymentBox}>
                <div className={styles.paymentLine}>
                  <div className={styles.paymentTitle}>주문 총액</div>
                  <div>
                    {Number(userData.total_price).toLocaleString()}&nbsp;원
                  </div>
                </div>
                <div className={styles.paymentLine}>
                  <div className={styles.paymentTitle}>할인 금액</div>
                  {Number(userData.discount) !== 0 ? (
                    <div>
                      -{Number(userData.discount).toLocaleString()}&nbsp;원
                    </div>
                  ) : (
                    <div>0&nbsp;원</div>
                  )}
                </div>
                <hr />
                <div className={styles.paymentLine}>
                  <div className={styles.paymentTitle}>정산 금액</div>
                  <div>
                    {Number(userData.net_price) >= 0 ? (
                      <span className={styles.paymentWaiting}>
                        {Number(userData.net_price).toLocaleString()}
                      </span>
                    ) : (
                      <span className={styles.paymentWaiting}>0</span>
                    )}
                    &nbsp;원
                  </div>
                </div>
              </div>
              <div onClick={onClick} className={styles.recordLinkBox}>
                <div className={styles.recordLinkLine}>
                  <div>주문 내역 보기</div>
                  <img src={arrow} alt="이동" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.googleformGuide}>
                <span>30초</span> 만에 고객 조건 인증하기
              </div>

              <div className={styles.afterGuideText}>
                  고객 조건이 확인되면<br/><span>가입 확정 문자</span>를 보내드릴 예정입니다
              </div>

              <div className={styles.googleformLinkBox}>
                <span className={styles.googleformLinkTitle}>📌 고객 조건</span>
                <div>
                  1. <span>연세대학교</span> 대학생/대학원생
                </div>
                <div>
                  2. (카페서문) <span>평균 주 2회</span> 이상 방문
                </div>
              </div>

              <Button
                buttonLink="https://forms.gle/UF9H5vX8M5A2kRRv5"
                buttonText="인증하기"
                buttonColor="#FF5555"
              />
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyPage;
