export function downloadBase64File(base64Data: string, fileName: string) {
  // 1. Convert Base64 sang Blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  
  // 2. Xác định MIME type dựa trên extension
  const extension = fileName.split(".").pop()?.toLowerCase();
  let mimeType = "application/octet-stream";
  
  if (extension === "xlsx") {
    mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (extension === "docx") {
    mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  
  const blob = new Blob([byteArray], { type: mimeType });

  // 3. Tạo thẻ <a> ảo để kích hoạt download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // 4. Dọn dẹp
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
