import React from "react";
import styles from "../css/Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className={styles.footer}>
        <div className={styles.footerText}>
          <Link
            to="https://san9min.notion.site/af2c40e08cfa42e28360260661ee60f3?pvs=4"
            className={styles.footerLink}
          >
            서비스 안내
          </Link>
        </div>
        <div className={styles.footerText}>
          <Link
            to="https://google.com"
            className={styles.footerLink}
          >
            고객 센터
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
