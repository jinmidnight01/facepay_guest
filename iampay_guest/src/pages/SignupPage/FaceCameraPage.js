import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/FaceCameraPage.module.css";
import whiteFaceGuide from "../../images/whiteFaceGuide.png";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import axios from "axios";
import hostURL from "../../hostURL";

const FaceCameraPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const width = 300;
  const height = 300;
  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "user",
  };
  const { webcamRef } = useFaceDetection({
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

  // check camera permission
  const CheckPermission = async (setPermissionsGranted) => {
    const storedPermission = localStorage.getItem("cameraPermission");
    if (storedPermission === "granted") {
      setPermissionsGranted(true);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) {
          setPermissionsGranted(true);
          localStorage.setItem("cameraPermission", "granted");
        }
      } catch (err) {
        localStorage.setItem("cameraPermission", "denied");
      }
    }
  };

  // loading
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
          navigate("/mypage", { state: response.data });
        })
        .catch((error) => {
          console.log(error);
          localStorage.removeItem("accessToken");
          navigate("/");
        });
    }

    CheckPermission(setPermissionsGranted);
    setIsLoading(false);
  }, [navigate]);

  return (
    <div>
      <Header logoLink="/signup" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.modal}>
          <div className={styles.cameraGuide}>
            <span className={styles.cameraGuideTitle}>📌 촬영 가이드</span>
            <div>
              1. 카메라가 안될 경우,{" "}
              <span className={styles.reloadGuide}>새로고침</span> 후{" "}
              <span>재촬영</span>
            </div>
            {/* <div>
              2. 얼굴을 <span>박스에 고정</span> 후 촬영하기
            </div> */}
            <div>
              2. 핸드폰 <span>촬영 높이</span>를 <span>얼굴</span>에 맞추기
            </div>
            {/* <div>
              4. 사진이 <span>흔들리지 않게</span> 촬영하기
            </div> */}
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
                {/* {boundingBox.map((box, index) => (
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
                  ))} */}

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
                          <div className={styles.buttonBox}>
                            <button
                              onClick={() => {
                                const image_Src = getScreenshot();
                                navigate("/signup", {
                                  state: { user_face_img: image_Src },
                                });
                              }}
                              className={styles.button}
                              id="button"
                            >
                              촬영
                            </button>
                          </div>
                        </div>
                      )}
                    </Webcam>
                  )}
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

export default FaceCameraPage;
