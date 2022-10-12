import React from "react";
import { NavLink } from "react-router-dom";

function PanelComponent(props) {
  const panelHeight = 0;
  const panelWidth = 0;

  return <div className="panel-component">
    <h2 className="component-title">{props.title}</h2>
    {props.children}
    </div>;
}

export default PanelComponent;
