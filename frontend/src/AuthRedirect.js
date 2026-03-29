import React from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

// "Needs: success state, failed state, store cookies on success, prompt user to close window."

export default function AuthRedirect() {
  const queryParameters = new URLSearchParams(window.location.search);
  const cookies = new Cookies();
  cookies.set("googleAuthToken", queryParameters.get("googleAuthToken"), {
    secure: true,
    sameSite: "Strict",
  });

  const appHome =
    (process.env.REACT_APP_FRONTEND_ORIGIN || "").replace(/\/$/, "") ||
    window.location.origin;

  return (
    <>
      <Navigate to="/" />
      <p className="p-4 text-ink">
        This page should redirect you. If it doesn&apos;t, click{" "}
        <a
          className="text-sky-600 underline hover:text-sky-700 dark:text-sky-400"
          href={appHome}
        >
          here
        </a>{" "}
        to be redirected.
      </p>
    </>
  );
}
