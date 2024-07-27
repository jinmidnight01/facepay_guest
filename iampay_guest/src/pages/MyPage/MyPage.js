import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import hostURL from "../../hostURL";
import styles from "../../css/MyPage.module.css";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import arrow from "../../images/arrow.png";

const MyPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const navigator = useNavigate();
  const onClick = () => {
    navigator("/mypage/record", { state: { username: userData.username, total_price: userData.total_price } });
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
  }, [navigator]);

  return (
    <div>
      <Header logoLink="/mypage" />

      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.main}>
          <div className={styles.welcomeText}>
            {userData.username}님, 안녕하세요
          </div>
          
          <div className={styles.guideText}>
            정산 방식은 아래 서비스 안내를 참고해주세요
          </div>

          <div className={styles.paymentBox}>
            <div className={styles.paymentLine}>
              <div className={styles.paymentTitle}>주문 총액</div>
              <div>{Number(userData.total_price).toLocaleString()}&nbsp;원</div>
            </div>
            <div className={styles.paymentLine}>
              <div className={styles.paymentTitle}>할인 금액</div>
              {Number(userData.discount) !== 0 ? (
                <div>-{Number(userData.discount).toLocaleString()}&nbsp;원</div>
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
      )}

      <Footer />
    </div>
  );
};

export default MyPage;
