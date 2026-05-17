import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import Swal from "sweetalert2";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

export default function Register() {

  const [userInfo, setUserInfo] = React.useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const history = useHistory();

  const { setAuth } = useAuth();

  const handleChange = (e) => {
    setUserInfo((u) => ({ ...u, [e.target.name]: e.target.value }));
  };

  async function registerUser(e) {
    e.preventDefault();

    try {
      // Fix: Template literal syntax was incorrect - add proper string interpolation
      // Also ensure withCredentials is true for CORS with credentials
      const res = await axios.post(`${BASE_URL}auth/register`, userInfo, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        }
      });

      if (res.data.message === "Registration successful") {
        Swal.fire({
          title: 'Success',
          text: 'User successfully registered',
          icon: 'success'
        }).then(() => history.push("/auth/login"));
      }
    } catch (e) {

      if (e.status === 500 && e.response.data.error.includes("password must be at least 8 characters")) {
        Swal.fire({
          title: 'Oops',
          text: "Password must contain at least 8 characters"
        })
      } else if (e.status === 500 && e.response.data.error.includes("password must contain at least 1 letter and 1 number")) {
        Swal.fire({
          title: 'Oops',
          text: "Password must contain at least 1 letter and 1 number"
        })
      } else if (e.status === 409 && e.response.data.message === "User already exists") {
        Swal.fire({
          title: 'Oops',
          text: "User already exists"
        })
      } else {
        console.log(e)
      }

    }
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div
              className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                {/* Commented section fixed - was using invalid JSX comment syntax */}
                {/* <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign up with
                  </h6>
                </div> */}
                {/* <div className="btn-wrapper text-center">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={require("assets/img/github.svg").default}
                    />
                    Github
                  </button>
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src={require("assets/img/google.svg").default}
                    />
                    Google
                  </button>
                </div> */}
                {/* <hr className="mt-6 border-b-1 border-blueGray-300" /> */}
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                {/* <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Or sign up with credentials</small>
                </div> */}
                <form onSubmit={(e) => registerUser(e)}>
                  <div className="relative w-50 mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="firstname"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Enter First Name"
                      name="firstname"
                      value={userInfo.firstname}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>

                  <div className="relative w-50 mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="lastname"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Enter Last Name"
                      name="lastname"
                      required
                      value={userInfo.lastname}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="relative w-50 mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Enter Username"
                      name="username"
                      required
                      value={userInfo.username}
                      onChange={(e) => handleChange(e)}
                      autoComplete="username"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      required
                      name="email"
                      value={userInfo.email}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      name="password"
                      value={userInfo.password}
                      onChange={(e) => handleChange(e)}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  {/* <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="role"
                    >
                      User Role
                    </label> */}
                  {/* Fixed comment syntax in input section */}
                  {/* <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      name="password"
                      value={userInfo.password}
                      onChange={(e) => handleChange(e)}
                      required
                      autoComplete="new-password"
                    /> */}
                  {/* <select name="role" id=""
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            onChange={(e) => handleChange(e)}
                            required
                            value={userInfo.role}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select> */}
                  {/* </div> */}

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        required
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}