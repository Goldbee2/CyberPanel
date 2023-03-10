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

  function createChildHTML(object) {
    var date = "";

    if (object.start.dateTime) {
      date = object.start.dateTime;
    } else if (object.start.date) {
      date = object.start.date;
    }
    
    var dateTime = new Date(date);

    date = dateTime.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      weekday: "long",
      day: "numeric",
    });
    console.log(object.summary);
    return (
      <li>
        <p class="calendar-summary">{object.summary}</p>
        <p class="calendar-date"> {date}</p>
      </li>
    );
  }

  useEffect(() => {
    const cookies = new Cookies();

    setComponentState("loading");

    if (cookies.get("googleAuthToken")) {
      setComponentState("loading");
      fetch("https://192.168.1.127:9000/calendar")
        .then((res) => {
          if (res.status != 200) {
            cookies.remove("googleAuthToken");
            setComponentState("authPrompt");
          }
          return res.json();
        })
        .then((resJson) => {
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
      const listItems = calendarData.items.map((item) => createChildHTML(item));
      return (
        <PanelComponent title="Calendar">
          <div id="calendar">
            <ul>{listItems}</ul>
          </div>
        </PanelComponent>
      );
    default:
      return (
        <PanelComponent title="Calendar">
          <p>Loading...</p>
        </PanelComponent>
      );
  }
}
