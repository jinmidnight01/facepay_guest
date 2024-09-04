import { React, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import styles from "../../css/SignupPage.module.css";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";
import MirrorImage from "../../components/MirrorImage";
import InputValidation from "../../components/InputValidation";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignupPage = () => {
  // 텍스트 박스 입력값 상태 관리
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const refPhoneNumber = useRef();
  // const refPassword = useRef();
  // const refUserName = useRef();
  const [inputs, setInputs] = useState({
    phone_number: "",
    // password: "",
    // username: "",
  });
  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const { phone_number } = inputs;
  const [checked, setChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  // 웹캠 설정
  const [user_face_img, setUserFaceImg] = useState("");
  const output = useLocation();
  const [hasPhoto, setHasPhoto] = useState(false);
  useEffect(() => {
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   axios
    //     .get(`${hostURL}/api/users`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((response) => {
    //       navigate("/mypage", { state: response.data });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       localStorage.removeItem("accessToken");
    //       navigate("/");
    //     });
    // } else {
    //   setIsLoading(false);
    // }
    // setIsLoading(false);
    if (output.state) {
      setUserFaceImg(output.state.user_face_img);
      setHasPhoto(true);
    }
  }, [output.state, navigate]);

  // 얼굴 초점 위치에 따른 버튼 활성화
  // const handleChange = (yCenter, xCenter, width, height) => {
  //   if (
  //     yCenter >= 0.35 &&
  //     yCenter <= 0.45 &&
  //     xCenter >= 0.25 &&
  //     xCenter <= 0.35 &&
  //     width >= 0.40 &&
  //     width <= 0.50 &&
  //     height >= 0.40 &&
  //     height <= 0.50 &&
  //     facesDetected === 1
  //   ) {
  //     document.getElementById("faceGuide").style.opacity = 1;
  //     document.getElementById("button").style.backgroundColor = "#FF5555";
  //     document.getElementById("button").removeAttribute("disabled");
  //   } else {
  //     document.getElementById("faceGuide").style.opacity = 0.5;
  //     document.getElementById("button").style.backgroundColor = "#6e6e6e99";
  //     document.getElementById("button").setAttribute("disabled", "disabled");
  //   }
  // };

  // REST API: post user data
  const regPhoneNumber = useMemo(() => /^010[0-9]{8}$/, []);
  const handleSubmit = async (e) => {
    // prevent page reset
    e.preventDefault();

    // input validation
    if (
      InputValidation(
        user_face_img,
        checked,
        regPhoneNumber.test(phone_number),
        // regPassword.test(password),
        // regUserName.test(username),
        refPhoneNumber
        // refPassword,
        // refUserName
      ) === false
    ) {
      return;
    }

    // password validation with phone number
    // if (password === phone_number.substring(7, 11)) {
    //   alert("유출 위험이 있는 비밀번호입니다. 다시 입력해주세요");
    //   return;
    // }

    // loading
    setIsLoading(true);

    // create form data
    const response = await fetch(user_face_img);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      MirrorImage(reader.result, (mirroredBlob) => {
        const formData = new FormData();
        formData.append("user_face_img", mirroredBlob);
        formData.append("phone_number", phone_number);
        // formData.append("password", password);
        // formData.append("username", username);

        // Sign up user data
        axios
          .post(`${hostURL}/api/users/sign-up`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(() => {
            navigate("/");
            setIsLoading(false);
            alert(
              "지금부터 얼굴결제를 이용하실 수 있습니다. 감사합니다.\n\n[ 500원 할인 혜택 ]\n1. 결제할 때마다 (1000원 이상 건)\n2. 24년 10월까지 (연장 가능)\n\n[ 다음 달 정산 방식 ]\n1. 계좌/카드 연동 X\n2. 매달 1일에 정산 (전월 분)"
            );

            // // log-in
            // axios
            //   .post(`${hostURL}/api/users/log-in`, {
            //     phone_number: phone_number,
            //     password: password,
            //   })
            //   .then((response) => {
            //     const token = response.data.access_token;
            //     localStorage.setItem("accessToken", token);
            //     navigate("/mypage");
            //   })
            //   .catch((error) => {
            //     if (error.response.data.detail === "Risky Password") {
            //       alert("유출 위험이 있는 비밀번호입니다. 다시 입력해주세요");
            //     } else {
            //       alert("회원가입에 실패했습니다. 다시 시도해주세요");
            //     }
            //     setIsLoading(false);
            //   });
          })
          .catch((error) => {
            // if (error.response.data.detail === "Risky Password") {
            //   alert("유출 위험이 있는 비밀번호입니다. 다시 입력해주세요");
            // } else {
            alert("회원가입에 실패했습니다. 다시 시도해주세요");
            // }
            setIsLoading(false);
          });
      });
    };
  };

  // input focus
  // const regPassword = useMemo(() => /^[0-9]{4}$/, []);
  // const regUserName = useMemo(() => /^[가-힣]{2,4}$/, []);
  // useEffect(() => {
  //   if (regPhoneNumber.test(phone_number)) {
  //     refPassword.current.focus();
  //   }
  // }, [phone_number, regPhoneNumber]);
  // useEffect(() => {
  //   if (regPassword.test(password)) {
  //     refUserName.current.focus();
  //   }
  // }, [password, regPassword]);

  return (
    <div>
      <Header logoLink="/" />
      {isLoading ? (
        <div className={styles.loadingBox}>
          <Loading />
          <div className={styles.signupLoadingBox}>
            <div className={styles.signupLoading}>가입 중 ...</div>
            {/* <div className={styles.signupLoading}>(5초 남음)</div> */}
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.main} id="main">
            <div className={styles.signupGuide}>
              <span>10초</span> 만에 등록하기
            </div>

            <form
              onSubmit={(e) => handleSubmit(e)}
              className={styles.loginForm}
              encType="multipart/form-data"
            >
              <label className={styles.cameraBox}>
                <div>결제에 쓰일 얼굴 정면 사진을 찍어주세요</div>
                {hasPhoto ? (
                  <img
                    src={user_face_img}
                    onClick={() => {
                      navigate("/signup/facecamera");
                    }}
                    alt="camera"
                    className={styles.camera}
                  />
                ) : (
                  <div
                    className={styles.faCameraBox}
                    onClick={() => {
                      navigate("/signup/facecamera");
                    }}
                  >
                    <FaCamera
                      className={styles.faCamera}
                      color="#999999"
                      alt="camera"
                    />
                  </div>
                )}
              </label>
              <input
                name="phone_number"
                onChange={onChange}
                type="text"
                inputMode="numeric"
                ref={refPhoneNumber}
                maxLength={11}
                value={phone_number}
                placeholder="전화번호를 입력해주세요"
                className={styles.inputBox}
              />
              {/* <input
                name="password"
                onChange={onChange}
                type="password"
                inputMode="numeric"
                ref={refPassword}
                maxLength={4}
                value={password}
                placeholder="4자리 비밀번호를 입력해주세요 (주문 시 필요)"
                className={styles.inputBox}
              />
              <input
                name="username"
                onChange={onChange}
                type="text"
                ref={refUserName}
                maxLength={4}
                value={username}
                placeholder="이름을 입력해주세요 (정산 시 필요)"
                className={styles.inputBox}
              /> */}
              <div className={styles.checkBox}>
                <input
                  type="checkbox"
                  id="check1"
                  checked={checked}
                  onChange={handleCheckboxChange}
                />
                <label for="check1"></label>
                <div className={styles.agreementText}>
                  (필수) 개인정보 수집∙이용에 동의합니다.{" "}
                  <Link
                    className={styles.agreementLink}
                    to="https://plip.kr/pcc/0a100b94-05ce-41d9-90d2-8247e675c838/privacy/2.html"
                  >
                    [보기]
                  </Link>
                </div>
              </div>
              <Button
                type="submit"
                onClick={handleSubmit}
                buttonColor="#FF5555"
                buttonText="완료"
              />
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SignupPage;
