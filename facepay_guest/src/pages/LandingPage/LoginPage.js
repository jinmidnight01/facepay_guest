import { React, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/LoginPage.module.css";
import Header from "../../components/Header";
import tempLogo from "../../images/tempLogo.png";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";

const LoginPage = () => {
  const navigator = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const refPhoneNumber = useRef();
  const refPassword = useRef();
  const refLoginButton = useRef();
  const [inputs, setInputs] = useState({
    phone_number: "",
    password: "",
  });
  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const { phone_number, password } = inputs;

  // REST API: login
  const login = (e) => {
    // prevent page reset
    e.preventDefault();

    // loading
    setIsLoading(true);

    // 로그인 POST
    axios
      .post(`${hostURL}/api/users/log-in`, inputs)
      .then((response) => {
        // 로그인 성공
        const token = response.data.access_token;
        localStorage.setItem("accessToken", token);
        navigator("/mypage");
      })
      .catch((error) => {
        // 등록된 유저가 아닌 경우
        console.log(error);
        setIsLoading(false);
        alert("휴대폰 번호와 비밀번호를 확인해주세요");
      });
  };

  // input focus
  const regPhoneNumber = useMemo(() => /^010[0-9]{8}$/, []);
  const regPassword = useMemo(() => /^[0-9]{4}$/, []);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get(`${hostURL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          navigator("/mypage", { state: response.data });
        })
        .catch((error) => {
          console.log(error);
          localStorage.removeItem("accessToken");
          navigator("/");
        });
    }
    else {
      setIsLoading(false);
    }
  }, [navigator]);
  useEffect(() => {
    if (regPhoneNumber.test(phone_number)) {
      refPassword.current.focus();
    }
  }, [phone_number, regPhoneNumber]);
  useEffect(() => {
    if (regPassword.test(password)) {
      refLoginButton.current.focus();
    }
  }, [password, regPassword]);

  return (
    <div>
      <Header logoLink="/" />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className={styles.logoBox}>
            <img src={tempLogo} alt="tempLogo" className={styles.tempLogo} />
          </div>
          <form className={styles.loginForm}>
            <input
              name="phone_number"
              onChange={onChange}
              type="text"
              inputMode="numeric"
              ref={refPhoneNumber}
              maxLength={11}
              value={phone_number}
              placeholder="휴대폰 번호"
              className={styles.inputBox}
            />
            <input
              name="password"
              onChange={onChange}
              type="password"
              inputMode="numeric"
              ref={refPassword}
              maxLength={4}
              value={password}
              placeholder="비밀번호"
              className={styles.inputBox}
            />
          </form>
          <Link to={"/mypage"} className={styles.buttonLink}>
            <div className={styles.buttonBox}>
              <button
                ref={refLoginButton}
                onClick={login}
                className={styles.button}
              >
                로그인
              </button>
            </div>
          </Link>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default LoginPage;
