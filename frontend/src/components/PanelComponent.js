import React from "react";

function PanelComponent(props) {
    const hasTitle = props.title != null && props.title !== "";
    const frameClass = [
        "relative m-0 min-w-0 overflow-hidden rounded-none border border-solid border-subtle-accent px-4 pb-4 text-[length:var(--component-font-size)] text-ink-secondary",
        hasTitle ? "pt-2" : "pt-4",
        props.id === "to-do-list" ? "min-h-[41rem]" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const titleClass =
        "float-none px-1 font-mono text-[0.65rem] font-normal uppercase tracking-wider text-ink-tertiary";

    if (hasTitle) {
        return (
            <fieldset id={props.id} className={frameClass}>
                <legend className={titleClass}>
                    {" " + props.title.toUpperCase() + " "}
                </legend>
                {props.children}
            </fieldset>
        );
    }

    return (
        <div id={props.id} className={frameClass}>
            {props.children}
        </div>
    );
}

export default PanelComponent;
