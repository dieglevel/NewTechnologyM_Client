import axios from "axios";

export const getIpDeviceApi = async () => {
   try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
   } catch (e) {
      console.error("Error Ip Device", e);
      return e;
   }
}