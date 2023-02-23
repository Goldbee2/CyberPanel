import React from "react";
import Cookies from 'universal-cookie';


// "Needs: success state, failed state, store cookies on success, prompt user to close window."


export default function AuthRedirect(){
    const queryParameters = new URLSearchParams(window.location.search);
    const cookies = new Cookies();
    cookies.set('googleAuthToken', queryParameters.get('code'), {secure:true, sameSite:"Strict"});
    console.log(queryParameters);
}