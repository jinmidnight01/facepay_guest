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
import cameraLogo from "../../images/cameraLogo.png";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";

const SignupPage = () => {
  const navigator = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const refPhoneNumber = useRef();
  const refPassword = useRef();
  const refUserName = useRef();
  const [inputs, setInputs] = useState({
    phone_number: "",
    password: "",
    username: "",
  });
  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const { phone_number, password, username } = inputs;

  // 웹캠 설정
  const [user_face_img, setUserFaceImg] = useState(cameraLogo);
  const width = 300;
  const height = 300;
  const videoConstraints = {
    // width: "1500",
    // height: "2000",
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
        width,
        height,
      }),
  });

  // 얼굴 초점 위치(top: 37~44, right: 24~33, width: 35~45, height: 28~35)
  const handleChange = (yCenter, xCenter, width, height) => {
    if (
      yCenter >= 0.35 &&
      yCenter <= 0.45 &&
      xCenter >= 0.25 &&
      xCenter <= 0.35 &&
      width >= 0.35 &&
      width <= 0.40 &&
      height >= 0.30 &&
      height <= 0.40 &&
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

  // 얼굴 사진 등록 화면 전환
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

  // 좌우 반전 함수
  const mirrorImage = (imageSrc, callback) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      // 좌우 반전
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(callback, "image/jpeg");
    };
  };

  // REST API: post user data
  const handleSubmit = async (e) => {
    const flagPhoneNumber = regPhoneNumber.test(phone_number);
    const flagPassword = regPassword.test(password);
    const flagUserName = regUserName.test(username);

    // prevent page reset
    e.preventDefault();

    // input validation
    if (user_face_img === cameraLogo) {
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
    const response = await fetch(user_face_img);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      mirrorImage(reader.result, async (mirroredBlob) => {
        const formData = new FormData();
        formData.append("user_face_img", mirroredBlob);
        formData.append("phone_number", phone_number);
        formData.append("password", password);
        formData.append("username", username);

        // Sign up user data
        axios
          .post(`${hostURL}/api/users/sign-up`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(() => {
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
      });
    };
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

  return (
    <div>
      <Header logoLink="/" />
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
                        border: "3px solid #FF5555",
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
                      forceScreenshotSourceSize
                      screenshotFormat="image/jpeg"
                      mirrored={true}
                      width="300px"
                      height="300px"
                      className={styles.webcam}
                    >
                      {({ getScreenshot }) => (
                        <div className={styles.buttonBox}>
                          <Button
                            onClick={() => {
                              const image_Src = getScreenshot();
                              setUserFaceImg(image_Src);
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
