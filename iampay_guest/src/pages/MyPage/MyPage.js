import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import hostURL from "../../hostURL";
import styles from "../../css/MyPage.module.css";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";

const MyPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [result, setResult] = useState([]);
  const navigator = useNavigate();

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

    // payment 정보 가져오기
    axios
      .get(`${hostURL}/api/payments`)
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigator]);

  // user의 payment 정보만 가져와서 정렬
  let filteredResult = [];
  if (result.length !== 0) {
    filteredResult = [...result.payments]
      .sort((a, b) => {
        if (a.payments_date > b.payments_date) return -1;
        if (a.payments_date < b.payments_date) return 1;
        return 0;
      })
      .filter((payment) => {
        return payment.user_name === userData.username;
      });
  }

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
              <div>{Number(userData.balance).toLocaleString()}&nbsp;원</div>
            </div>
            <div className={styles.paymentLine}>
              <div className={styles.paymentTitle}>할인 금액</div>
              <div>-{Number(userData.balance).toLocaleString()}&nbsp;원</div>
            </div>
            <hr />
            <div className={styles.paymentLine}>
              <div className={styles.paymentTitle}>정산 금액</div>
              <div>
                {userData.balance - userData.balance >= 0 ? (
                  <span className={styles.paymentWaiting}>
                    {Number(
                      userData.balance - userData.balance
                    ).toLocaleString()}
                  </span>
                ) : (
                  <span className={styles.paymentWaiting}>0</span>
                )}
                &nbsp;원
              </div>
            </div>
          </div>

          <div className={styles.paymentRecordBox}>
            <div className={styles.paymentRecordLine}>
              <div>주문 일시</div>
              <div>금액</div>
            </div>
            <hr />
            {filteredResult.map((payment) => (
              <div
                className={styles.paymentRecordRow}
                key={payment.payments_id}
              >
                <div className={styles.left}>
                  <span>{payment.payments_date.substr(5, 2)}</span>.
                  <span>{payment.payments_date.substr(8, 2)}</span>&nbsp;
                  <span>{payment.payments_date.substr(11, 5)}</span>
                </div>
                <div className={styles.right}>
                  {Number(payment.price).toLocaleString()}&nbsp;원
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyPage;
