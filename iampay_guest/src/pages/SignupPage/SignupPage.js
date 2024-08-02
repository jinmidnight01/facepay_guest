import { React, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import styles from "../../css/SignupPage.module.css";
import Button from "../../components/Button";
import Webcam from "react-webcam";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import Footer from "../../components/Footer";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";
import MirrorImage from "../../components/MirrorImage";
import InputValidation from "../../components/InputValidation";
import CheckPermission from "../../components/CheckPermission";
import whiteFaceGuide from "../../images/whiteFaceGuide.png";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignupPage = () => {
  // 텍스트 박스 입력값 상태 관리
  const navigate = useNavigate();
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
  const [checked, setChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  // 웹캠 설정
  const [user_face_img, setUserFaceImg] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const width = 300;
  const height = 300;
  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "user",
  };
  const { webcamRef, boundingBox } = useFaceDetection({
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

  // REST API: post user data
  const handleSubmit = async (e) => {
    // prevent page reset
    e.preventDefault();

    // input validation
    if (
      InputValidation(
        user_face_img,
        checked,
        regPhoneNumber.test(phone_number),
        regPassword.test(password),
        regUserName.test(username),
        refPhoneNumber,
        refPassword,
        refUserName
      ) === false
    ) {
      return;
    }

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
                navigate("/mypage");
              })
              .catch((error) => {
                if (error.response.data.detail === "Risky Password") {
                  alert("유출 위험이 있는 비밀번호입니다. 다시 입력해주세요");
                } else {
                  alert("회원가입에 실패했습니다. 다시 시도해주세요");
                }
                setIsLoading(false);
              });
          })
          .catch((error) => {
            if (error.response.data.detail === "Risky Password") {
              alert("유출 위험이 있는 비밀번호입니다. 다시 입력해주세요");
            } else {
              alert("회원가입에 실패했습니다. 다시 시도해주세요");
            }
            setIsLoading(false);
          });
      });
    };
  };

  // camera permission check & input focus
  const regPhoneNumber = useMemo(() => /^010[0-9]{8}$/, []);
  const regPassword = useMemo(() => /^[0-9]{4}$/, []);
  const regUserName = useMemo(() => /^[가-힣]{2,4}$/, []);
  useEffect(() => {
    CheckPermission(setPermissionsGranted);
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
            <div className={styles.signupGuide}>
              <span>30초</span> 만에 회원가입하기
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
                placeholder="ID로 쓰일 전화번호를 입력해주세요"
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
              />
              <label className={styles.cameraBox}>
                <div>얼굴 정면 사진을 찍어주세요</div>
                {hasPhoto ? (
                  <img
                    src={user_face_img}
                    onClick={handleModal}
                    alt="camera"
                    className={styles.camera}
                  />
                ) : (
                  <div className={styles.faCameraBox} onClick={handleModal}>
                    <FaCamera
                      className={styles.faCamera}
                      color="#999999"
                      alt="camera"
                    />
                  </div>
                )}
              </label>
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
                buttonText="다음"
              />
            </form>
          </div>

          <div className={styles.modal} id="modal">
            <div className={styles.cameraGuide}>
              <span className={styles.cameraGuideTitle}>📌 촬영 가이드</span>
              <div>
                1. 얼굴을 <span>박스에 고정</span> 후 촬영하기
              </div>
              <div>
                2. 핸드폰 <span>촬영 높이</span>를 <span>얼굴</span>에 맞추기
              </div>
              <div>
                3. 사진이 <span>흔들리지 않게</span> 촬영하기
              </div>
            </div>
            <div className={styles.screenBox}>
              <img
                src={whiteFaceGuide}
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
                      // onChange={handleChange(
                      //   box.yCenter,
                      //   box.xCenter,
                      //   box.width,
                      //   box.height
                      // )}
                    />
                  ))}

                  <div className={styles.webcamBox}>
                    {permissionsGranted && (
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
                                setHasPhoto(true);
                                handleModal();
                              }}
                              id="button"
                              buttonColor="#FF5555"
                              buttonText="촬영"
                            />
                          </div>
                        )}
                      </Webcam>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SignupPage;
