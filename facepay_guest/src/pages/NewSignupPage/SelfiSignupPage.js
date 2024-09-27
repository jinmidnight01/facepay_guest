import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/SelfiSignupPage.module.css";
import whiteFaceGuide from "../../images/whiteFaceGuide.png";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const SelfiSignupPage = () => {
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
    CheckPermission(setPermissionsGranted);
    setIsLoading(false);
  }, [navigate]);

  return (
    <div className={styles.selfiBody}>
      <Header logoLink="/" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.modal}>
          <div className={styles.modalTitle}>얼굴 정면 사진을 찍어주세요</div>
          <div className={styles.warningTitle}>
            카메라가 안 켜질 경우{" "}
            <span className={styles.reloadGuide}>새로고침</span>
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
                                navigate("/phone", {
                                  state: { user_face_img: image_Src },
                                });
                              }}
                              className={styles.button}
                              id="button"
                            >
                              다음
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
    </div>
  );
};

export default SelfiSignupPage;
