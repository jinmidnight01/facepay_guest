import { React, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import styles from "../../css/PhoneNumberPage.module.css";
import axios from "axios";
import hostURL from "../../hostURL";
import Loading from "../../components/Loading";
import emailjs from "@emailjs/browser";
import MirrorImage from "../../components/MirrorImage";

const PhoneNumberPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const output = location.state;
  const [phoneNumber1] = useState("010"); // 첫 번째 박스는 고정값
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [phoneNumber3, setPhoneNumber3] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef2 = useRef(null); // 두 번째 입력 박스에 대한 ref 생성
  const inputRef3 = useRef(null); // 세 번째 입력 박스에 대한 ref 생성
  const buttonRef = useRef(null); // 버튼에 대한 ref 생성

  useEffect(() => {
    if (!output) {
      navigate("/");
      return;
    }
    inputRef2.current.focus(); // 두 번째 박스로 포커스 이동
  }, [output, navigate]);

  const handlePhoneNumber2Change = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      // 숫자 4자리 입력 확인
      setPhoneNumber2(value);

      // 두 번째 박스가 4자리일 경우 세 번째 박스로 포커스 이동
      if (value.length === 4) {
        inputRef3.current.focus(); // 세 번째 박스로 포커스 이동
      }
    }
  };

  const handlePhoneNumber3Change = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      // 숫자 4자리 입력 확인
      setPhoneNumber3(value);

      // 두 번째와 세 번째 박스 모두 4자리일 때 버튼으로 포커스 이동
      if (phoneNumber2.length === 4 && value.length === 4) {
        buttonRef.current.focus(); // 버튼으로 포커스 이동
      }
    }
  };

  const handleFocusInput2 = () => {
    inputRef2.current.style.borderColor = "#ff5555"; // 두 번째 박스 테두리 색 변경
  };

  const handleFocusInput3 = () => {
    inputRef3.current.style.borderColor = "#ff5555"; // 세 번째 박스 테두리 색 변경
  };

  const handleBlurInput2 = () => {
    inputRef2.current.style.borderColor = "#ccc"; // 기본 색상으로 되돌리기
  };

  const handleBlurInput3 = () => {
    inputRef3.current.style.borderColor = "#ccc"; // 기본 색상으로 되돌리기
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    // prevent page reset
    setIsLoading(true);

    // 전화번호 포맷팅
    const finalPhoneNumber = `${phoneNumber1}${phoneNumber2}${phoneNumber3}`;

    // create form data
    const response = await fetch(output.user_face_img);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      MirrorImage(reader.result, (mirroredBlob) => {
        const formData = new FormData();
        formData.append("user_face_img", mirroredBlob);
        formData.append("phone_number", finalPhoneNumber); // 포맷팅된 전화번호

        // Sign up user data
        axios
          .post(`${hostURL}/api/users/sign-up`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            navigate("/howtoorder", { state: { userID: res.data.id } });
            setIsLoading(false);

            // 가입 이메일 전송 코드
            emailjs
              .send(
                "service_6g5nqbz", // emailjs 서비스 ID
                "template_w5am9p7", // emailjs 템플릿 ID
                {
                  phone_number: finalPhoneNumber, // 메일로 보낼 정보
                },
                "PMOXW53I5xdi2VZbO" // emailjs 공용 API 키
              )
              .then(
                () => {},
                (error) => {
                  console.error("메일 전송 실패...", error);
                }
              );
          })
          .catch((error) => {
            alert("회원가입에 실패했습니다. 다시 시도해주세요");
            setIsLoading(false);
          });
      });
    };
  };

  return (
    <div>
      <Header logoLink="/" />
      {isLoading ? (
        <div className={styles.loadingBox}>
          <Loading />
          <div className={styles.signupLoadingBox}>
            <div className={styles.signupLoading}>로딩 중 ...</div>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.modalTitle}>휴대폰 번호를 입력해주세요</div>
          <div className={styles.phoneInputContainer}>
            <input
              type="text"
              value={phoneNumber1}
              readOnly
              className={styles.fixedInput}
            />
            <span className={styles.hyphen}>-</span>
            <input
              type="text"
              value={phoneNumber2}
              onChange={handlePhoneNumber2Change}
              onFocus={handleFocusInput2}
              onBlur={handleBlurInput2}
              maxLength={4}
              ref={inputRef2} // 두 번째 박스에 ref 추가
              className={styles.phoneInput}
              inputMode="numeric"
            />
            <span className={styles.hyphen}>-</span>
            <input
              type="text"
              value={phoneNumber3}
              onChange={handlePhoneNumber3Change}
              onFocus={handleFocusInput3}
              onBlur={handleBlurInput3}
              maxLength={4}
              ref={inputRef3} // 세 번째 박스에 ref 추가
              className={styles.phoneInput}
              inputMode="numeric"
            />
          </div>
          <div className={styles.buttonLink}>
            <div className={styles.buttonBox}>
              <button
                ref={buttonRef} // 버튼에 ref 추가
                onClick={handleSubmit}
                className={styles.button}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberPage;
