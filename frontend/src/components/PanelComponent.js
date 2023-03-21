import React from "react";
import { NavLink } from "react-router-dom";

function PanelComponent(props) {
  const panelHeight = 0;
  const panelWidth = 0;

  return <div id={props.id}  className="panel-component">
    {/* <p className = "corner-symbol">&#8945;</p> */}
    <h2 className="component-title">{props.title}</h2>
    {props.children}
    </div>;
}

export default PanelComponent;
