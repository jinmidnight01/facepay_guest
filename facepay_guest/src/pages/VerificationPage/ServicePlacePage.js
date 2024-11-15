import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../css/ServicePlacePage.module.css";
import Header from "../../components/Header";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";

const ServicePlacePage = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  }, [navigate, output]);

  const handleClick = () => {
    setIsLoading(true);

    axios
      .patch(`${hostURL}/api/users/${output.userID}`, {
        verified: true,
      })
      .then((res) => {
        navigate("/");
        alert("등록이 완료되었습니다");
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Header logoLink="/" />
      {isLoading ? (
        <div className={styles.loadingBox}>
          <Loading />
          <div className={styles.signupLoadingBox}>
            <div className={styles.signupLoading}>로딩 중 ...</div>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.modalTitle}>시범 서비스 매장 목록</div>

          {/* 첫 번째 가이드 */}
          <div className={styles.firstGuideBox}>
            <div className={styles.guide}>아지트</div>
          </div>

          {/* 두 번째 가이드 */}
          <div
            className={`${styles.guideBox} ${
              fadeInStep >= 1 ? styles.fadeIn : ""
            }`}
            style={{ marginBottom: `15px` }}
          >
            <div className={styles.guide}>서문 첫집</div>
          </div>

          {/* 마지막 버튼 */}
          <div
            className={`${styles.nextBox} ${
              fadeInStep >= 2 ? styles.fadeIn : ""
            }`}
          >
            <div className={styles.buttonBox}>
              <button onClick={handleClick} className={styles.button}>
                가입 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePlacePage;
