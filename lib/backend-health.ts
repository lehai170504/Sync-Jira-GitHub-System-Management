import axios from "axios";

/** Lỗi gateway / BE tạm ngưng — không coi là 401, không đẩy user sang 404 */
export function isBackendUnavailable(err: unknown): boolean {
  if (axios.isAxiosError(err)) {
    const s = err.response?.status;
    if (s === 502 || s === 503 || s === 504) return true;
    if (!err.response && (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED"))
      return true;
    if (!err.response && err.message === "Network Error") return true;
  }
  if (err && typeof err === "object" && "message" in err) {
    const m = String((err as { message?: string }).message || "");
    if (m.includes("Network Error")) return true;
  }
  return false;
}
