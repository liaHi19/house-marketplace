import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFromData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with registration");
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
              className="nameInput"
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={onChangeForm}
            />
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
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          <OAuth />

          <Link className="registerLink" to="/sign-in">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
};

export default SignUp;
