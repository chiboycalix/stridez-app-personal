import Cookies from "js-cookie";

export const fetchToken = async (url: string) => {
  console.log(Cookies.get("accessToken"), "Cookies.get");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Agora-Signature": "stridez@123456789",
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  const jsonResp = await response.json();
  if (!response.ok) {
  } else {
    return jsonResp.data;
  }
};

export const agoraGetAppData = async (channel: string) => {
  const initUrl = `${process.env.NEXT_PUBLIC_BASEURL}/rooms/join-meeting/${channel}`;
  const rtcData = await fetchToken(initUrl);
  return rtcData;
};

export const generateUid = () => {
  const uid = Math.floor(Math.random() * 10000);
  return String(uid);
};
