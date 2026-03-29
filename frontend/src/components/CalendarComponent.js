import React, { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";
import AuthPrompt from "./AuthPrompt";
import Error from "./Error";
import Cookies from "universal-cookie";

const backendOrigin = (
  process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

/** Tailwind arbitrary border colors — must be static strings for JIT. */
const CALENDAR_LEFT_BORDER = {
  "1": "[border-left-color:var(--Lavender)]",
  "2": "[border-left-color:var(--Sage)]",
  "3": "[border-left-color:var(--Grape)]",
  "4": "[border-left-color:var(--Flamingo)]",
  "5": "[border-left-color:var(--Banana)]",
  "6": "[border-left-color:var(--Tangerine)]",
  "7": "[border-left-color:var(--Peacock)]",
  "8": "[border-left-color:var(--Graphite)]",
  "9": "[border-left-color:var(--Blueberry)]",
  "10": "[border-left-color:var(--Basil)]",
  "11": "[border-left-color:var(--Tomato)]",
};

export default function CalendarComponent() {
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
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    const leftBorder =
      CALENDAR_LEFT_BORDER[object.colorId] ||
      "[border-left-color:var(--Peacock)]";
    return (
      <li
        key={object.id || object.summary + date}
        className={`my-2.5 flex list-none justify-between rounded-lg border-l-8 border-solid bg-surface-3 py-0.5 pl-4 pr-4 text-ink-secondary ${leftBorder}`}
      >
        <p className="text-left">{object.summary}</p>
        <p className="w-40 text-left"> {date}</p>
      </li>
    );
  }

  useEffect(() => {
    const cookies = new Cookies();

    setComponentState("loading");

    const storedToken = cookies.get("googleAuthToken");
    if (storedToken) {
      setComponentState("loading");
      fetch(`${backendOrigin}/calendar`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) {
            cookies.remove("googleAuthToken");
            setComponentState("authPrompt");
            return null;
          }
          return res.json();
        })
        .then((resJson) => {
          if (!resJson) return;
          setCalendarData(resJson);
          setComponentState("displayEvents");
        })
        .catch((err) => {
          console.error("Error:", err);
          setComponentState("error");
        });
    } else {
      fetch(`${backendOrigin}/oauth2/getRedirect`)
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
        <PanelComponent id="calendar" title="Calendar">
          <p className="text-ink-tertiary">Loading...</p>
        </PanelComponent>
      );
    case "error":
      return (
        <PanelComponent id="calendar" title="Calendar">
          <Error />
        </PanelComponent>
      );
    case "authPrompt":
      return (
        <PanelComponent id="calendar" title="Calendar">
          <AuthPrompt url={authURL} />
        </PanelComponent>
      );
    case "displayEvents":
      const listItems = calendarData.items.map((item) => createChildHTML(item));
      return (
        <PanelComponent id="calendar" title="Calendar">
          <ul className="list-none p-0">{listItems}</ul>
        </PanelComponent>
      );
    default:
      return (
        <PanelComponent id="calendar" title="Calendar">
          <p className="text-ink-tertiary">Loading...</p>
        </PanelComponent>
      );
  }
}
