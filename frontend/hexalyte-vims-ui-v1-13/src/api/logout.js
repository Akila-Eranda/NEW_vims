import axios from "axios";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

async function handleUserLogout() {

  try {
    const response = await axios.post(`${BASE_URL}auth/logout`);
  } catch (error) {
    console.error(error);
  }
}

export default handleUserLogout;