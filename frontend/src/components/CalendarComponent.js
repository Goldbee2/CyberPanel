import React, { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";
import AuthPrompt from "./AuthPrompt";
import Error from "./Error";
import Cookies from "universal-cookie";

export default function CalendarComponent() {
  //states:
  //Click to sign in
  //Sign-in process
  //Display calendar
  //Errored
  const [calendarData, setCalendarData] = useState({});
  const [componentState, setComponentState] = useState("loading");
  const [authURL, setAuthURL] = useState("");

  useEffect(() => {
    const cookies = new Cookies();

    setComponentState("loading");

    if (cookies.get("googleAuthToken")) {
      setComponentState("loading");
      fetch("https://192.168.1.127:9000/calendar")
        .then((res) => {
          return res.json();
        }).then((resJson)=>{
          setCalendarData(resJson);
          setComponentState("displayEvents");
        })
        .catch((err) => {
          console.error("Error:", err);
          setComponentState("error");
        });
    } else {
      fetch("https://192.168.1.127:9000/oauth2/getRedirect")
        .then((res) => {
          return res.text();
        })
        .then((parsed) => {
          console.log(parsed);
          setAuthURL(parsed);
          setComponentState("authPrompt");
        })
        .catch((err) => {
          console.error("Error:", err);
          setComponentState("error");
        });
    }
  }, []);

  switch (componentState) {
    case "loading":
      return (
        <PanelComponent title="Calendar">
          <p>Loading...</p>
        </PanelComponent>
      );
    case "error":
      return (
        <PanelComponent title="Calendar">
          <Error />
        </PanelComponent>
      );
    case "authPrompt":
      return (
        <PanelComponent title="calendar">
          <AuthPrompt url={authURL} />
        </PanelComponent>
      );
    case "displayEvents":
      console.log("eventData:", calendarData);
      return (
        <PanelComponent>
          {"Events go here"}
          <div id="calendar">
            {/* list of events */}
            
          </div>
        </PanelComponent>
      );
  }

  return (
    <PanelComponent title="Calendar">
      <p>Loading...</p>
    </PanelComponent>
  );
}
