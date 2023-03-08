import React from "react";


export default function AuthPrompt(props){

    console.log(props);

    return(<div className="authPrompt">
    <a href={props.url}>Login</a>
    </div>);
}