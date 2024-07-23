import { React, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import styles from "../../css/SignupPage.module.css";
import tempLogo from "../../images/tempLogo.png";
import Button from "../../components/Button";
import Webcam from "react-webcam";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import faceGuide from "../../images/faceGuide.png";
import Footer from "../../components/Footer";
import cameraThumbnail from "../../images/cameraThumbnail.png";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";

const SignupPage = () => {
  const navigator = useNavigate();
  const refPhoneNumber = useRef();
  const refPassword = useRef();
  const refUserName = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    phone_number: "",
    password: "",
    username: "",
  });
  const [user_face_img, setUserFaceImg] = useState(cameraThumbnail);
  const videoConstraints = {
    width: "1500",
    height: "2000",
    facingMode: "user",
  };
  const { webcamRef, boundingBox, facesDetected } = useFaceDetection({
    faceDetectionOptions: {
      model: "short",
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }) =>
      new Camera(mediaSrc, {
        onFrame,
      }),
  });
  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const { phone_number, password, username } = inputs;

  // color change(top: 37~44, right: 24~33, width: 35~45, height: 28~35)
  const handleChange = (yCenter, xCenter, width, height) => {
    if (
      yCenter >= 0.37 &&
      yCenter <= 0.44 &&
      xCenter >= 0.24 &&
      xCenter <= 0.33 &&
      width >= 0.35 &&
      width <= 0.45 &&
      height >= 0.28 &&
      height <= 0.35 &&
      facesDetected === 1
    ) {
      document.getElementById("faceGuide").style.opacity = 1;
      document.getElementById("button").style.backgroundColor = "#FF5555";
      document.getElementById("button").removeAttribute("disabled");
    } else {
      document.getElementById("faceGuide").style.opacity = 0.5;
      document.getElementById("button").style.backgroundColor = "#6e6e6e99";
      document.getElementById("button").setAttribute("disabled", "disabled");
    }
  };

  // Modal control: display
  const handleModal = () => {
    if (
      document.getElementById("main").style.display === "" ||
      document.getElementById("main").style.display === "block"
    ) {
      document.getElementById("main").style.display = "none";
      document.getElementById("modal").style.display = "flex";
      return;
    }
    document.getElementById("main").style.display = "block";
    document.getElementById("modal").style.display = "none";
  };

  // input focus
  const regPhoneNumber = useMemo(() => /^010[0-9]{8}$/, []);
  const regPassword = useMemo(() => /^[0-9]{4}$/, []);
  const regUserName = useMemo(() => /^[가-힣]{2,4}$/, []);
  useEffect(() => {
    refPhoneNumber.current.focus();
  }, []);
  useEffect(() => {
    if (regPhoneNumber.test(phone_number)) {
      refPassword.current.focus();
    }
  }, [phone_number, regPhoneNumber]);
  useEffect(() => {
    if (regPassword.test(password)) {
      refUserName.current.focus();
    }
  }, [password, regPassword]);

  // REST API: post user data
  const handleSubmit = async (e) => {
    const flagPhoneNumber = regPhoneNumber.test(phone_number);
    const flagPassword = regPassword.test(password);
    const flagUserName = regUserName.test(username);

    // prevent page reset
    e.preventDefault();

    // input validation
    if (user_face_img === cameraThumbnail) {
      alert("얼굴 사진을 등록해주세요");
      return;
    }
    if (!flagPhoneNumber) {
      if (!flagPassword) {
        if (!flagUserName) {
          alert(
            "전화번호, 비밀번호, 이름 정보를 재입력 해주세요\n• 전화번호 형식: 01012345678\n• 비밀번호 형식: 4자리 숫자\n• 이름 형식: 2~4글자 한글"
          );
        } else {
          alert(
            "전화번호, 비밀번호 정보를 재입력 해주세요\n• 전화번호 형식: 01012345678\n• 비밀번호 형식: 4자리 숫자"
          );
        }
      } else {
        if (!flagUserName) {
          alert(
            "전화번호, 이름 정보를 재입력 해주세요\n• 전화번호 형식: 01012345678\n• 이름 형식: 2~4글자 한글"
          );
        } else {
          alert(
            "전화번호 정보를 재입력 해주세요\n• 전화번호 형식: 01012345678"
          );
        }
      }
      refPhoneNumber.current.focus();
      return;
    } else {
      if (!flagPassword) {
        if (!flagUserName) {
          alert(
            "비밀번호, 이름 정보를 재입력 해주세요\n• 비밀번호 형식: 4자리 숫자\n• 이름 형식: 2~4글자 한글"
          );
        } else {
          alert("비밀번호 정보를 재입력 해주세요\n• 비밀번호 형식: 4자리 숫자");
        }
        refPassword.current.focus();
        return;
      } else {
        if (!flagUserName) {
          alert("이름 정보를 재입력 해주세요\n• 이름 형식: 2~4글자 한글");
          refUserName.current.focus();
          return;
        }
      }
    }

    // loading
    setIsLoading(true);

    // create form data
    const formData = new FormData();
    const response = await fetch(user_face_img);
    const blob = await response.blob();
    formData.append("user_face_img", blob);
    formData.append("phone_number", phone_number);
    formData.append("password", password);
    formData.append("username", username);

    // Sign up user data
    axios
      .post(`${hostURL}/api/users/sign-up`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        // log-in
        axios
        .post(`${hostURL}/api/users/log-in`, {
          phone_number: phone_number,
          password: password,
        })
        .then((response) => {
          const token = response.data.access_token;
          localStorage.setItem("accessToken", token);
          navigator("/mypage");
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Header logoLink="/"  />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className={styles.main} id="main">
            <div className={styles.logoBox}>
              <img src={tempLogo} alt="tempLogo" className={styles.tempLogo} />
            </div>

            <form
              onSubmit={(e) => handleSubmit(e)}
              className={styles.loginForm}
              encType="multipart/form-data"
            >
              <input
                name="phone_number"
                onChange={onChange}
                type="text"
                inputMode="numeric"
                ref={refPhoneNumber}
                maxLength={11}
                value={phone_number}
                placeholder="ID로 사용될 전화번호를 입력해주세요"
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
                placeholder="4자리의 비밀번호를 설정해주세요"
                className={styles.inputBox}
              />
              <input
                name="username"
                onChange={onChange}
                type="text"
                ref={refUserName}
                maxLength={4}
                value={username}
                placeholder="이름을 입력해주세요 (금액 충전 시 필요)"
                className={styles.inputBox}
              />
              <label className={styles.cameraBox}>
                <div>얼굴 정면 사진을 찍어주세요</div>
                <img
                  src={user_face_img}
                  onClick={handleModal}
                  alt="camera"
                  className={styles.camera}
                />
              </label>
              <Button
                type="submit"
                onClick={handleSubmit}
                buttonColor="#FF5555"
                buttonText="완료"
              />
            </form>

            <Footer />
          </div>

          <div className={styles.modal} id="modal">
            <div className={styles.modalText}>얼굴을 정면에 고정 해주세요</div>
            <div className={styles.screenBox}>
              <img
                src={faceGuide}
                alt="faceGuide"
                className={styles.faceGuide}
                id="faceGuide"
              />
              <div className={styles.screen}>
                <div className={styles.boundingBox}>
                  {boundingBox.map((box, index) => (
                    <div
                      key={`${index}`}
                      style={{
                        border: "0px solid #FF5555",
                        borderRadius: "50%",
                        position: "absolute",
                        top: `${box.yCenter * 100}%`,
                        right: `${box.xCenter * 100}%`,
                        width: `${box.width * 100}%`,
                        height: `${box.height * 100}%`,
                        zIndex: 1,
                      }}
                      onChange={handleChange(
                        box.yCenter,
                        box.xCenter,
                        box.width,
                        box.height
                      )}
                    />
                  ))}
                  <div className={styles.webcamBox}>
                    <Webcam
                      ref={webcamRef}
                      videoConstraints={videoConstraints}
                      mirrored={true}
                      width="300px"
                      height="400px"
                      className={styles.webcam}
                    >
                      {({ getScreenshot }) => (
                        <div className={styles.buttonBox}>
                          <Button
                            onClick={() => {
                              const imageSrc = getScreenshot();
                              setUserFaceImg(imageSrc);
                              handleModal();
                            }}
                            id="button"
                            buttonColor="#6e6e6e99"
                            buttonText="촬영"
                          />
                        </div>
                      )}
                    </Webcam>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
