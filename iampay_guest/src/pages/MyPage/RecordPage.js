import { React, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import styles from "../../css/RecordPage.module.css";
import axios from "axios";
import hostURL from "../../hostURL";

const RecordPage = () => {
  const output = useLocation().state;
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    // payment 정보 가져오기
    axios
      .get(`${hostURL}/api/payments`)
      .then((response) => {
        setResult(response.data);
        setIsLoading(false);
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
        return payment.user_name === output.username;
      });
  }

  return (
    <div>
      <Header logoLink="/mypage" />

      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className={styles.welcomeText}>
            {output.username}님, 안녕하세요
          </div>
          <div className={styles.paymentRecordBox}>
            <div className={styles.paymentRecordLine}>
              <div>주문 일시</div>
              <div>금액</div>
            </div>
            <hr />
            <div className={styles.paymentRecordBody}>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
              <div className={styles.paymentRecordRow}>
                <div className={styles.left}>
                  <span>08</span>.<span>05</span>&nbsp;
                  <span>14:30</span>
                </div>
                <div className={styles.right}>2,000&nbsp;원</div>
              </div>
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
          <Button
            buttonLink="/mypage"
            buttonColor="#FF5555"
            buttonText="돌아가기"
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RecordPage;
