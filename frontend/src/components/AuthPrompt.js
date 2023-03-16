import React from "react";


export default function AuthPrompt(props){


    return(<div className="authPrompt">
    <a id = "login-button" href={props.url}>Login</a>
    </div>);
}