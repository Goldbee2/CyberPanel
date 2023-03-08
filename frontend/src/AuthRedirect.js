import React from "react";
import Cookies from 'universal-cookie';


// "Needs: success state, failed state, store cookies on success, prompt user to close window."


export default function AuthRedirect(){
    const queryParameters = new URLSearchParams(window.location.search);
    const cookies = new Cookies();
    cookies.set('googleAuthToken', queryParameters.get('googleAuthToken'), {secure:true, sameSite:"Strict"});
    console.log(queryParameters);

    return(<p>This page should redirect you. If it doesn't, click <a href="https://localhost:3000">here</a> to be redirected.</p>)
}