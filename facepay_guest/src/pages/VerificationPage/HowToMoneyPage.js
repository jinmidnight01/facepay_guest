import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../css/HowToMoneyPage.module.css";
import Header from "../../components/Header";

const HowToMoneyPage = () => {
  const output = useLocation().state;
  const navigate = useNavigate();

  const [fadeInStep, setFadeInStep] = useState(0); // 애니메이션 단계 추적

  useEffect(() => {
    const timeouts = [];

    // 1초마다 단계별로 애니메이션 실행
    for (let i = 1; i <= 3; i++) {
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
      <div className={styles.modalTitle}>정산 방법</div>

      {/* 첫 번째 가이드 */}
      <div className={styles.firstGuideBox}>
        {/* <div className={styles.guide}>
          <span>시범 서비스</span> 단계이므로
        </div>

        <div className={styles.guide}>
          <span>계좌/카드</span>는 추후 연동 예정
        </div> */}
                <div className={styles.guide}>
          <span>매달 1일</span>에 이전 달
        </div>
        <div className={styles.guide}>
          주문 내역 일괄 <span>청구</span>
        </div>

      </div>

      {/* 두 번째 가이드 */}
      <div
        className={`${styles.guideBox} ${fadeInStep >= 1 ? styles.fadeIn : ""}`}
      >
        <div className={styles.guide}>
          <span>주문/청구 내역</span>은
        </div>
        <div className={styles.guide}>
          <span>문자</span>를 통해 알림
        </div>
      </div>

      {/* 세 번째 가이드 */}
      <div
        className={`${styles.guideBox} ${fadeInStep >= 2 ? styles.fadeIn : ""}`}
      >
        <div className={styles.guide}>
          <span>계좌이체</span> 방식으로 정산
        </div>
      </div>

      {/* 마지막 버튼 */}
      <div
        className={`${styles.nextBox} ${fadeInStep >= 3 ? styles.fadeIn : ""}`}
      >
        <div className={styles.buttonBox}>
          <button
            onClick={() => {
              navigate("/serviceplace", { state: output });
            }}
            className={styles.button}
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToMoneyPage;
