import React, { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";
import AuthPrompt from "./AuthPrompt";
import Error from "./Error";
import Cookies from "universal-cookie";

const backendOrigin = (
  process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

/** Tailwind arbitrary text colors — must be static strings for JIT (Google Calendar colorId). */
const CALENDAR_SWATCH_CLASS = {
  "1": "text-[color:var(--Lavender)]",
  "2": "text-[color:var(--Sage)]",
  "3": "text-[color:var(--Grape)]",
  "4": "text-[color:var(--Flamingo)]",
  "5": "text-[color:var(--Banana)]",
  "6": "text-[color:var(--Tangerine)]",
  "7": "text-[color:var(--Peacock)]",
  "8": "text-[color:var(--Graphite)]",
  "9": "text-[color:var(--Blueberry)]",
  "10": "text-[color:var(--Basil)]",
  "11": "text-[color:var(--Tomato)]",
};

function parseYmd(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Google Calendar all-day end.date is exclusive; return inclusive last day. */
function inclusiveAllDayEnd(exclusiveEndDateStr) {
  const d = parseYmd(exclusiveEndDateStr);
  d.setDate(d.getDate() - 1);
  return d;
}

function sameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfLocalDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Local calendar day used for grouping (start of event). */
function getEventStartDay(object) {
  const { start } = object;
  if (start.dateTime) return startOfLocalDay(new Date(start.dateTime));
  if (start.date) return startOfLocalDay(parseYmd(start.date));
  return startOfLocalDay(new Date(0));
}

function dayBucketKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sectionHeadingForDay(dayStart) {
  const today = startOfLocalDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dayStart.getTime() === today.getTime()) return "TODAY";
  if (dayStart.getTime() === tomorrow.getTime()) return "TOMORROW";
  const nowYear = new Date().getFullYear();
  const opts =
    dayStart.getFullYear() !== nowYear
      ? { weekday: "long", month: "long", day: "numeric", year: "numeric" }
      : { weekday: "long", month: "long", day: "numeric" };
  return dayStart.toLocaleDateString("en-US", opts);
}

/** Time / all-day line only — section header carries the date. */
function formatEventTimeRow(object) {
  const { start, end } = object;
  const timeOpts = { hour: "numeric", minute: "2-digit" };

  if (start.dateTime) {
    const s = new Date(start.dateTime);
    const e = end?.dateTime ? new Date(end.dateTime) : s;
    if (sameCalendarDay(s, e)) {
      return `${s.toLocaleTimeString("en-US", timeOpts)} – ${e.toLocaleTimeString("en-US", timeOpts)}`;
    }
    const endWeekday = e.toLocaleDateString("en-US", { weekday: "short" });
    return `${s.toLocaleTimeString("en-US", timeOpts)} → ${endWeekday} ${e.toLocaleTimeString("en-US", timeOpts)}`;
  }

  if (start.date) {
    const s = parseYmd(start.date);
    const inclusiveEnd = end?.date ? inclusiveAllDayEnd(end.date) : s;
    if (s.getTime() === inclusiveEnd.getTime()) {
      return "all day";
    }
    const dayCount =
      Math.round((inclusiveEnd.getTime() - s.getTime()) / 86400000) + 1;
    return `all day · ${dayCount} days`;
  }

  return "Time TBD";
}

function getEventSortTime(object) {
  const { start } = object;
  if (start.dateTime) return new Date(start.dateTime).getTime();
  if (start.date) return parseYmd(start.date).getTime();
  return 0;
}

function groupItemsByStartDay(items) {
  const map = new Map();
  for (const item of items) {
    const dayStart = getEventStartDay(item);
    const key = dayBucketKey(dayStart);
    if (!map.has(key)) {
      map.set(key, { dayStart, items: [] });
    }
    map.get(key).items.push(item);
  }
  for (const g of map.values()) {
    g.items.sort((a, b) => getEventSortTime(a) - getEventSortTime(b));
  }
  const sortedKeys = [...map.keys()].sort();
  return sortedKeys.map((key) => {
    const g = map.get(key);
    return {
      key,
      heading: sectionHeadingForDay(g.dayStart),
      items: g.items,
    };
  });
}

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(str, max) {
  if (!str) return "";
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

export default function CalendarComponent() {
  const [calendarData, setCalendarData] = useState({});
  const [componentState, setComponentState] = useState("loading");
  const [authURL, setAuthURL] = useState("");

  function createChildHTML(object) {
    const summary = object.summary?.trim() || "(No title)";
    const swatchClass =
      CALENDAR_SWATCH_CLASS[object.colorId] ||
      "text-[color:var(--Peacock)]";
    const timeRow = formatEventTimeRow(object);
    const location = object.location?.trim();
    const descPlain = truncate(stripHtml(object.description), 140);
    const organizer =
      object.organizer?.displayName?.trim() ||
      object.organizer?.email?.trim();
    const visibility =
      object.visibility && object.visibility !== "default"
        ? object.visibility
        : null;
    const cancelled = object.status === "cancelled";

    return (
      <li
        key={object.id || object.iCalUID || summary + timeRow}
        className="my-2.5 list-none px-2 py-0 font-panel-mono text-sm leading-snug text-ink-secondary"
      >
        <div className="flex flex-row items-start gap-2">
          <span
            className={`shrink-0 select-none font-panel-mono text-base leading-none ${swatchClass}`}
            aria-hidden
          >
            █
          </span>
          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <p
              className={`m-0 text-ink ${cancelled ? "line-through opacity-60" : ""}`}
            >
              {summary}
            </p>
            <p className="m-0 tabular-nums text-ink-tertiary">{timeRow}</p>
            {location ? (
              <p className="m-0 break-words text-ink-secondary">
                <span className="text-ink-tertiary opacity-70">loc </span>
                {location}
              </p>
            ) : null}
            {organizer ? (
              <p className="m-0 truncate text-ink-tertiary opacity-80">
                <span className="opacity-70">org </span>
                {organizer}
              </p>
            ) : null}
            {descPlain ? (
              <p className="m-0 whitespace-pre-wrap break-words text-ink-tertiary opacity-90">
                {descPlain}
              </p>
            ) : null}
            {visibility ? (
              <p className="m-0 text-xs uppercase tracking-wide text-ink-ghost">
                {visibility}
              </p>
            ) : null}
          </div>
        </div>
      </li>
    );
  }

  useEffect(() => {
    const cookies = new Cookies();

    setComponentState("loading");

    if (cookies.get("googleAuthToken")) {
      setComponentState("loading");
      fetch(`${backendOrigin}/calendar`)
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
        <PanelComponent
          id="calendar"
          title="Calendar"
          scrollable
          className="min-h-0 flex-1"
        >
          <p className="font-panel-mono text-ink-tertiary">Loading...</p>
        </PanelComponent>
      );
    case "error":
      return (
        <PanelComponent
          id="calendar"
          title="Calendar"
          scrollable
          className="min-h-0 flex-1"
        >
          <Error />
        </PanelComponent>
      );
    case "authPrompt":
      return (
        <PanelComponent
          id="calendar"
          title="Calendar"
          scrollable
          className="min-h-0 flex-1"
        >
          <AuthPrompt url={authURL} />
        </PanelComponent>
      );
    case "displayEvents": {
      const items = Array.isArray(calendarData.items) ? calendarData.items : [];
      const sections = groupItemsByStartDay(items);
      return (
        <PanelComponent
          id="calendar"
          title="Calendar"
          scrollable
          className="min-h-0 flex-1"
        >
          <div className="font-panel-mono text-ink-secondary">
            {items.length === 0 ? (
              <p className="text-ink-tertiary">No upcoming events.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {sections.map(({ key, heading, items: dayItems }) => (
                  <section key={key} className="m-0">
                    <h3 className="m-0 mb-2 border-b border-ink-ghost/20 pb-1 text-xs font-normal uppercase tracking-wider text-ink-tertiary">
                      {heading}
                    </h3>
                    <ul className="list-none p-0">
                      {dayItems.map((item) => createChildHTML(item))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </PanelComponent>
      );
    }
    default:
      return (
        <PanelComponent
          id="calendar"
          title="Calendar"
          scrollable
          className="min-h-0 flex-1"
        >
          <p className="font-panel-mono text-ink-tertiary">Loading...</p>
        </PanelComponent>
      );
  }
}
