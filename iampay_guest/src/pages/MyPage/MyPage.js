import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import axios from "axios";
import hostURL from "../../hostURL";
import rolling from "../../images/rolling.gif";
import styles from "../../css/MyPage.module.css";

const MyPage = () => {
  const userData = useLocation().state;
  console.log(userData);

  return (
    <div>
      <Header logoLink="/mypage" />

      <div className={styles.main}>
        {/* <div className={styles.welcomeText}>{userData.username}님, 안녕하세요</div> */}
        <div className={styles.welcomeText}>박찬솔님, 안녕하세요</div> 
        <div className={styles.balanceBox}>
          <div className={styles.balanceText}>보유잔액</div>
          {/* <div className={styles.balanceNumber}>{Number(userData.balance).toLocaleString()}원</div> */}
          <div className={styles.balanceNumber}>2,000원</div>
        </div>
      </div>

      <Button
        buttonLink="/charge"
        buttonColor="#FF5555"
        buttonText="충전하기"
      />
    </div>
  );
};

export default MyPage;
