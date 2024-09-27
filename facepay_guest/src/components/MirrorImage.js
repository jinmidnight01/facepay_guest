const MirrorImage = (imageSrc, callback) => {
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

export default MirrorImage;