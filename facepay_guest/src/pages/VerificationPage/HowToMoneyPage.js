import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../css/HowToMoneyPage.module.css";
import Header from "../../components/Header";

const HowToMoneyPage = () => {
  const output = useLocation().state;
  const navigate = useNavigate();

  const [fadeInStep, setFadeInStep] = useState(0); // 애니메이션 단계 추적

  useEffect(() => {
    if (!output) {
      navigate("/");
      return;
    }

    const timeouts = [];

    // 1초마다 단계별로 애니메이션 실행
    for (let i = 1; i <= 3; i++) {
      const timeout = setTimeout(() => {
        setFadeInStep(i);
      }, i * 800); // i * 1000ms로 순차적으로 나타남
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div>
      <Header logoLink="/" />
      <div className={styles.modalTitle}>정산 방법</div>

      {/* 첫 번째 가이드 */}
      <div className={styles.firstGuideBox}>
        <div className={styles.guide}>
          <span>계좌/카드</span> 추후 연동 예정
        </div>
      </div>

      {/* 두 번째 가이드 */}
      <div
        className={`${styles.guideBox} ${fadeInStep >= 1 ? styles.fadeIn : ""}`}
      >
        <div className={styles.guide}>
          <span>이번 달</span> 주문한 내역들은
        </div>
        <div className={styles.guide}>
          <span>다음 달 1일</span>에 일괄 <span>청구</span> 예정
        </div>
      </div>

      {/* 세 번째 가이드 */}
      <div
        className={`${styles.guideBox} ${fadeInStep >= 2 ? styles.fadeIn : ""}`}
      >
        <div className={styles.guide}>
          문자를 통해 <span>청구 금액</span>과
        </div>
        <div className={styles.guide}>
          <span>계좌 정보</span> 전송 예정
        </div>
      </div>

      {/* 마지막 버튼 */}
      <div
        className={`${styles.nextBox} ${fadeInStep >= 3 ? styles.fadeIn : ""}`}
      >
        <div className={styles.buttonBox}>
          <button
            onClick={() => {
              navigate("/notipayment", { state: output });
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

export default HowToMoneyPage;
