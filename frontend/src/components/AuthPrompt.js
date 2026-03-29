import React from "react";

export default function AuthPrompt(props) {
  return (
    <div className="flex justify-center p-2">
      <a
        className="rounded-md bg-sky-500 px-2 py-1 text-white no-underline hover:bg-sky-600"
        id="login-button"
        href={props.url}
      >
        Login
      </a>
    </div>
  );
}
