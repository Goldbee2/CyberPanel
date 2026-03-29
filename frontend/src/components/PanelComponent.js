import React from "react";

function PanelComponent(props) {
    const hasTitle = props.title != null && props.title !== "";
    const scrollable = Boolean(props.scrollable);
    const frameClass = [
        "relative m-0 min-w-0 rounded-none border border-solid border-subtle-accent text-[length:var(--component-font-size)] text-ink-secondary",
        scrollable
            ? "flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
            : "overflow-hidden",
        hasTitle ? "px-5 pb-5 pt-2.5" : "px-5 pb-5 pt-5",
        props.className || "",
    ]
        .filter(Boolean)
        .join(" ");

    const titleClass =
        "float-none px-1 font-mono text-[0.65rem] font-normal uppercase tracking-wider text-ink-tertiary";

    const scrollBody = scrollable ? (
        <div className="scrollbar-panel min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            {props.children}
        </div>
    ) : (
        props.children
    );

    if (hasTitle) {
        return (
            <fieldset id={props.id} className={frameClass}>
                <legend className={titleClass}>
                    {" " + props.title.toUpperCase() + " "}
                </legend>
                {scrollBody}
            </fieldset>
        );
    }

    return (
        <div id={props.id} className={frameClass}>
            {scrollBody}
        </div>
    );
}

export default PanelComponent;
