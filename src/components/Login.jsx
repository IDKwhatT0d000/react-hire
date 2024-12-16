import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import GoogleButton from "react-google-button";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Google Login function
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
            type: "student", // Default type as 'student'
            projects: Math.floor(Math.random() * 10),
            rating: Math.floor(Math.random() * 100),
          });
          toast.success("Account created and logged in!", {
            position: "top-center",
          });
        } else {
          toast.success("Welcome back!");
        }
        const userData = userDoc.data();
        if (userData.type === "student") {
          navigate("/main/landing");
          toast.success("Welcome, Student!");
        } else if (userData.type === "admin") {
          navigate("/admin/landing");
          toast.success("Welcome, Admin!");
        } else {
          toast.error("Invalid user type");
        }
      }
    } catch (error) {
      console.error("Google login error:", error.message);
      toast.error("Login failed. Please try again.");
    }
  };

  // Handle input changes
  const handlechange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // Email/password login function
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (user) {
        // Fetch user details from Firestore
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Navigate based on user type
          if (userData.type === "student") {
            navigate("/main/landing");
            toast.success("Welcome, Student!");
          } else if (userData.type === "admin") {
            navigate("/admin/landing");
            toast.success("Welcome, Admin!");
          } else {
            toast.error("Invalid user type");
          }
        } else {
          toast.error("User details not found.");
        }
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-green-400">
      <div className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-xl max-w-5xl w-full overflow-hidden">
        {/* Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-100 items-center justify-center">
          <img
            src="login-concept-illustration_114360-739.jpg"
            alt="Login Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">Welcome Back!</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Log in to access your account and continue your journey with us.
          </p>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your email"
                onChange={handlechange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={data.password}
                className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your password"
                onChange={handlechange}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleClick}
                className="w-1/2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition duration-300"
              >
                Log In
              </button>
            </div>
            <div className="flex justify-center">
              <GoogleButton onClick={googlelogin}></GoogleButton>
            </div>
          </form>
          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
