import React from "react";

function PanelComponent(props) {
  return (
    <div
      id={props.id}
      className={[
        "relative overflow-hidden px-4 pb-4 pt-0 text-[length:var(--component-font-size)] text-ink-secondary",
        props.id === "to-do-list" ? "min-h-[41rem]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {props.title != null && props.title !== "" && (
        <h2 className="-mx-4 mb-4 -mt-0 py-1.5 pl-4 pr-4 text-left text-xs font-light text-ink-tertiary">
          {props.title.toUpperCase()}
        </h2>
      )}
      {props.children}
    </div>
  );
}

export default PanelComponent;
