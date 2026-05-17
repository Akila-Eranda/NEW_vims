// import { getStoredTokens } from "auth/tokenService";
// import axios from "axios";

// async function checkToken() {

//   const BASE_URL = process.env.REACT_APP_BASE_URL;

//   function jsonToBase64(object) {
//     const stringified = JSON.stringify(object)
//     return btoa(String.fromCharCode(...new TextEncoder().encode(stringified)))
//   }

//   if (localStorage.getItem("user")) {
//     // const userObject = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem("user")), c => c.charCodeAt(0))));
//     const userObject = getStoredTokens()
//     // console.log(userObject)

//     const accessTokenExpiry = new Date(userObject.tokens.access.expires);
//     // console.log(`Access Token Expires IN: ${accessTokenExpiry}`)
//     const currentTime = new Date();

//     // async function logOut() {
//     //   const response = await axios.post(`${BASE_URL}auth/logout`, {}, {
//     //     withCredentials: true
//     //   });

//     //   console.log(response)
//     // }

//     if (accessTokenExpiry - currentTime <= 600000) {
//       // console.log("Access token will expire in 10 minutes");

//       try {
//         const response = await axios.post(`${BASE_URL}auth/refresh-tokens`, {}, {
//           withCredentials: true
//         });


//         userObject.tokens = response.tokens
//         localStorage.setItem('user', jsonToBase64(userObject))

//         // console.log("Access token refreshed successfully");

//         return true;

//       } catch (e) {

//         // logOut();

//         // localStorage.removeItem("user");

//         // console.log(e)

//         return false;

//       }

//     } else if (accessTokenExpiry - currentTime <= 0) {
//       return false;
//     } else {

//       // console.log("ACCESS TOKEN STILL VALID");
//       return true;

//     }
//   } else {
//     return false
//   }

// }

// export default checkToken;


// import axios from "axios";

// async function checkToken() {

//   const BASE_URL = process.env.REACT_APP_BASE_URL;

//   if (localStorage.getItem("user")) {

//     const decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem("user")), c => c.charCodeAt(0))));

//     console.log(decoded)

//   }

// }

// export default checkToken;