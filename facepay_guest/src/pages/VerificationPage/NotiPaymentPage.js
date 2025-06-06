import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import styles from "../../css/NotiPaymentPage.module.css";

const NotiPaymentPage = () => {
  const output = useLocation().state;
  const navigate = useNavigate();

  const [fadeInStep, setFadeInStep] = useState(0); // 애니메이션 단계 추적

  useEffect(() => {
    const timeouts = [];

    // 1초마다 단계별로 애니메이션 실행
    for (let i = 1; i <= 1; i++) {
      const timeout = setTimeout(() => {
        setFadeInStep(i);
      }, i * 500); // i * 1000ms로 순차적으로 나타남
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div>
      <Header logoLink="/" />
      <div className={styles.modalTitle}>결제 알림</div>

      {/* 첫 번째 가이드 */}
      <div className={styles.firstGuideBox}>
        <div className={styles.guide}>
          <span>문자</span>를 통해
        </div>
        <div className={styles.guide}>
          <span>결제/할인</span> 내역 발송 예정
        </div>
      </div>

      {/* 마지막 버튼 */}
      <div
        className={`${styles.nextBox} ${fadeInStep >= 1 ? styles.fadeIn : ""}`}
      >
        <div className={styles.buttonBox}>
          <button
            onClick={() => {
              navigate("/serviceplace", { state : output});
            }}
            className={styles.button}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotiPaymentPage;
