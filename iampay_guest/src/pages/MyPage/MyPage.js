import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import axios from "axios";
import hostURL from "../../hostURL";
import styles from "../../css/MyPage.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyText from "../../images/copyText.png";
import Loading from "../../components/Loading";

const MyPage = () => {
  const [isCharging, setIsCharging] = useState(false);
  const [buttonText, setButtonText] = useState("충전하기");
  const [buttonLink, setButtonLink] = useState("/mypage/charge");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`${hostURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        if (Number(response.data.charging_money) > 0) {
          setIsCharging(true);
        } else if (Number(response.data.charging_money) === 0) {
          setIsCharging(false);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          {isCharging && (
            <div className={styles.paymentWaitingBox}>
              <div className={styles.paymentWaitingText}>입금 확인 중</div>
              <div className={styles.paymentWaitingAmount}>
                {Number(userData.charging_money).toLocaleString()}원
              </div>
              <div className={styles.paymentWaitingDetail}>
                <span><span className={styles.boldText}>• 예금주</span>: 레빌스</span>
                <br />
                <span>
                  <span className={styles.boldText}>• 계좌번호</span>:{" "}
                  <CopyToClipboard
                    text="100037074410"
                    onCopy={() => alert("계좌가 복사되었습니다")}
                  >
                    <span>
                      <span className={styles.accountInfo}>
                        신한은행 100037074410
                      </span>
                      <img
                        src={copyText}
                        alt="copy"
                        width={13}
                        className={styles.copyImg}
                      />
                    </span>
                  </CopyToClipboard>
                </span>
                <br />
                <span><span className={styles.boldText}>• 입금자명</span>: {userData.username}</span>
                <br />
                <span className={styles.alertSign}>
                  30분 내 미입금 시 충전취소 됩니다
                </span>
              </div>
            </div>
          )}

          <div className={styles.balanceBox}>
            <div className={styles.balanceText}>보유잔액</div>
            <div className={styles.balanceNumber}>
              {Number(userData.balance).toLocaleString()}원
            </div>
          </div>

          {!isCharging && (
            <Button
              buttonLink={buttonLink}
              buttonColor="#FF5555"
              buttonText={buttonText}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MyPage;
