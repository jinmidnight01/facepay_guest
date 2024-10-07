import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import blackArrow from "../../images/blackArrow.png";
import styles from "../../css/HowToOrderPage.module.css";

const HowToOrderPage = () => {
  const output = useLocation().state;
  const navigate = useNavigate();

  const [fadeInStep, setFadeInStep] = useState(0); // 애니메이션 단계 추적

  useEffect(() => {
    const timeouts = [];

    // 1초마다 단계별로 애니메이션 실행
    for (let i = 1; i <= 8; i++) {
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
      <div className={styles.modalTitle}>이용 방법</div>

      {/* 첫 번째 가이드 */}
      <div className={styles.firstGuideBox}>
        <div className={styles.guide}>
          <span>계산대</span> 앞에서 주문
        </div>
      </div>
      <div
        className={`${styles.arrowBox} ${fadeInStep >= 1 ? styles.fadeIn : ""}`}
      >
        <img src={blackArrow} alt="blackArrow" className={styles.blackArrow} />
      </div>

      {/* 두 번째 가이드 */}
      <div
        className={`${styles.guideBox} ${fadeInStep >= 2 ? styles.fadeIn : ""}`}
      >
        <div className={styles.guide}>
          직원에게 <span>얼굴 결제</span> 요청하기
        </div>
      </div>
      <div
        className={`${styles.arrowBox} ${fadeInStep >= 3 ? styles.fadeIn : ""}`}
      >
        <img src={blackArrow} alt="blackArrow" className={styles.blackArrow} />
      </div>

      {/* 세 번째 가이드 */}
      <div
        className={`${styles.guideBox} ${fadeInStep >= 4 ? styles.fadeIn : ""}`}
      >
        <div className={styles.guide}>
          매장 <span>태블릿/카메라</span>에 얼굴 인식
        </div>
      </div>
      <div
        className={`${styles.arrowBox} ${fadeInStep >= 5 ? styles.fadeIn : ""}`}
      >
        <img src={blackArrow} alt="blackArrow" className={styles.blackArrow} />
      </div>

      {/* 네 번째 가이드 */}
      <div
        className={`${styles.guideBox} ${fadeInStep >= 6 ? styles.fadeIn : ""}`}
      >
        <div className={styles.guide}>결제 완료</div>
      </div>

      {/* 마지막 버튼 */}
      <div
        className={`${styles.nextBox} ${fadeInStep >= 7 ? styles.fadeIn : ""}`}
      >
        <div className={styles.buttonBox}>
          <button
            onClick={() => {
              navigate("/howtomoney", {state : output});
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

export default HowToOrderPage;
