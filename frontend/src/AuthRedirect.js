import React from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

// "Needs: success state, failed state, store cookies on success, prompt user to close window."

export default function AuthRedirect() {
  const queryParameters = new URLSearchParams(window.location.search);
  const cookies = new Cookies();
  const token = queryParameters.get("googleAuthToken");
  if (token) {
    cookies.set("googleAuthToken", token, {
      secure: window.location.protocol === "https:",
      sameSite: "strict",
      path: "/",
    });
  }

  return (
    <>
      <Navigate to="/" />
      <p className="p-4 text-ink">
        This page should redirect you. If it doesn&apos;t, click{" "}
        <a
          className="text-sky-600 underline hover:text-sky-700 dark:text-sky-400"
          href={`${window.location.origin}/`}
        >
          here
        </a>{" "}
        to be redirected.
      </p>
    </>
  );
}
