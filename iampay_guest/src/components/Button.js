import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/Button.module.css";

function Button(props) {
  const {buttonLink, buttonColor, buttonText, onClick, type, id} = props;

  return (
    <Link to={buttonLink} className={styles.buttonLink}>
      <div className={styles.buttonBox}>
        <button id={id} onClick={onClick} type={type} className={styles.button} style={{backgroundColor: buttonColor}}>{buttonText}</button>
      </div>
    </Link>
  );
}

export default Button;
