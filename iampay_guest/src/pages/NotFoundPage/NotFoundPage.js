import React from 'react';
import Header from '../../components/Header';
import Button from '../../components/Button';
import styles from '../../css/NotFoundPage.module.css';
import Footer from '../../components/Footer';

const NotFoundPage = () => {
  let link = "";
  if (localStorage.getItem("token")) {
    link = "/mypage";
  } else {
    link = "/";
  }

  return (
    <div>
      <Header logoLink="/" />
      <div className={styles.content}>
        해당 주소는 <br/> 존재하지 않는 페이지입니다
      </div>
      <Button buttonLink={link} buttonColor="#FF5555" buttonText="홈으로" />
      <Footer />
    </div>
  );
};

export default NotFoundPage;