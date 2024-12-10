import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc,getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate=useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    type: "student",
  });

  const handlechange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const googlelogin = async () => {
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef); 
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            type:"student",
            projects: Math.floor(Math.random() * 10),
            rating: Math.floor(Math.random() * 100),
          });
          toast.success("account created and logged in!",{
            position:"top-center"
          });
        } else {
          toast.success("Welcome back!");
        }
        navigate("/main");
      }
    } catch (error) {
      console.error("Google login error:", error.message);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleregister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = auth.currentUser;
  
      if (user) {
        await sendEmailVerification(user);
        console.log("Verification email sent. Please verify your email.");
        const checkEmailVerified = async () => {
          await user.reload();
          if (user.emailVerified) {
            await setDoc(doc(db, "Users", user.uid), {
              email: data.email,
              name: data.username,
              id: user.uid,
              password: data.password,
              type: data.type,
              rating: Math.floor(Math.random() * 100),
              projects: Math.floor(Math.random() * 10),
            });
            console.log("User added to Firestore after email verification.");
          } else {
            setTimeout(checkEmailVerified, 2000);
          }
        };
        checkEmailVerified();
      }
      setData({
        username: "",
        email: "",
        password: "",
        type: "",
      });
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400">
      <div className="flex flex-col-reverse lg:flex-row items-center bg-white rounded-lg shadow-xl max-w-5xl w-full overflow-hidden">
        {/* Signup Form */}
        <div className="w-full lg:w-1/2 px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">Create Your Account</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Join us and kickstart your journey with personalized learning and growth.
          </p>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="username"
                value={data.username}
                onChange={handlechange}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handlechange}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={data.password}
                onChange={handlechange}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={handleregister}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 transition duration-300"
              >
                Sign Up
              </button>
            </div>
            <div>
              <div className="flex justify-center">
                <GoogleButton onClick={googlelogin}></GoogleButton>
              </div>
            </div>
          </form>
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>

        {/* Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-purple-100 items-center justify-center">
          <img
            src="mobile-login-concept-illustration_114360-83.avif"
            alt="Signup Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
