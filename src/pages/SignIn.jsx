import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad User Credentials");
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <main>
          <form onSubmit={onSubmitForm}>
            <input
              className="emailInput"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={onChangeForm}
            />
            <div className="passwordInputDiv">
              <input
                className="passwordInput"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChangeForm}
              />
              <img
                className="showPassword"
                src={visibilityIcon}
                alt="show password"
                onClick={onShowPassword}
              />
            </div>
            <Link className="forgotPasswordLink" to="/forgot-password">
              Forgot Password
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          <OAuth />

          <Link className="registerLink" to="/sign-up">
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
};

export default SignIn;
