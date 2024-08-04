const CheckPermission = async (setPermissionsGranted) => {
  const storedPermission = localStorage.getItem('cameraPermission');
  if (storedPermission === 'granted') {
    setPermissionsGranted(true);
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setPermissionsGranted(true);
        localStorage.setItem('cameraPermission', 'granted');
      }
    } catch (err) {
      localStorage.setItem('cameraPermission', 'denied');
      setPermissionsGranted(true);
    }
  }
};

export default CheckPermission;