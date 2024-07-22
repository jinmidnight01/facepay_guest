import React from "react";
import styles from "../css/Loading.module.css";
import rolling from "../images/rolling.gif";

const Loading = () => {
  return (
    <div className={styles.loadingBox}>
      <img src={rolling} alt="로딩 중" />
    </div>
  );
};

export default Loading;
