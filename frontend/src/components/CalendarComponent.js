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

  const googleCalendarColors = {
    "1": "Lavender",
    "2": "Sage",
    "3": "Grape",
    "4": "Flamingo",
    "5": "Banana",
    "6": "Tangerine",
    "7": "Peacock",
    "8": "Graphite",
    "9": "Blueberry",
    "10": "Basil",
    "11": "Tomato",
  };

  function createChildHTML(object) {
    console.log(googleCalendarColors[object.colorId]);
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
    return (
      <li className="calendar-event" style={{borderColor: "var(--" + googleCalendarColors[object.colorId] + ")"}}>
        <p className="calendar-summary">{object.summary}</p>
        <p className="calendar-date"> {date}</p>
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
