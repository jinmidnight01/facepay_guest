const InputValidation = (user_face_img, cameraLogo, flagPhoneNumber, flagPassword, flagUserName, refPhoneNumber, refPassword, refUserName) => {
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
}

export default InputValidation;