import { React, useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import styles from "../../css/ChargePage.module.css";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import axios from "axios";
import hostURL from "../../hostURL";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const ChargePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [charging_money, setChargingMoney] = useState(0);
  const chargeRef = useRef();
  const navigator = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`${hostURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.charging_money > 0) {
          navigator("/mypage");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        navigator("/");
      });
    chargeRef.current.focus();
  }, [navigator]);

  const onChange = (e) => {
    let money = e.target.value;
    money = Number(money.replaceAll(",", ""));
    if (isNaN(money)) {
      setChargingMoney(0);
    } else {
      setChargingMoney(money.toLocaleString());
    }
  };

  const onClick = () => {
    // loading
    setIsLoading(true);

    // 충전 금액이 0원인 경우
    if (charging_money === 0) {
      setIsLoading(false);
      alert("충전할 금액을 입력해주세요");
      return;
    }

    // 충전 금액 PATCH
    axios
      .patch(
        `${hostURL}/api/users/charging`,
        {
          charging_money: charging_money.replaceAll(",", ""),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        navigator("/mypage");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Header logoLink="/mypage" />

      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.main}>
          <div className={styles.welcomeText}>충전할 금액을 입력해주세요</div>

          <div className={styles.chargeBox}>
            <div className={styles.chargeText}>금액</div>
            <div className={styles.wonText}>원</div>
            <input
              type="text"
              inputMode="numeric"
              value={charging_money}
              onChange={onChange}
              ref={chargeRef}
              className={styles.chargeInput}
            />
          </div>

          <Button onClick={onClick} buttonColor="#FF5555" buttonText="완료" />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ChargePage;
