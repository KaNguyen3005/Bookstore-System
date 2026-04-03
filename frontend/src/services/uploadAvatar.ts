export const uploadAvatar = async (formData: FormData) => {
  // chưa có API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: URL.createObjectURL(formData.get("file") as File)
      });
    }, 1000);
  });
}