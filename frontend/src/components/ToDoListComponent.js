// Checklist vector by Qaisir Mehmood via vecteezy


import { React, useState, useEffect } from "react";
import Cookies from "universal-cookie";

export default function ToDoList() {
  const [toDoList, setToDoList] = useState(getListFromCookie());
  const [currID, setID] = useState(
    toDoList.length > 0 ? toDoList[toDoList.length - 1].id + 1 : 0
  );
  const [summary, setSummary] = useState("");

  useEffect(() => {
    saveListToCookie(toDoList);
  });

  const toDoListDOMElement = <ul>{toDoList.map((task) => (
    <li className="todo-entry" key={task.id}>
      <input
        className="todo-checkbox"
        type="checkbox"
        defaultChecked={task.completed}
        onChange={() => changeStatus(task.id)}
      />
      <p className="todo-summary">{task.summary}</p>
      <button className="todo-delete" onClick={() => removeEntry(task.id)}>
        Delete
      </button>
    </li>
  ))}</ul>;

  const toDoListPlaceholderElement = <div id="to-do-list-placeholder"><img id="to-do-list-placeholder-image" src={process.env.PUBLIC_URL + "/33_Tasks.svg"}/><p id="to-do-list-placeholder-text">Tasks will appear here.</p></div>


  //  Name:         getListFromCookie
  // Returns:
  //  Description:
  function getListFromCookie() {
    var cookies = new Cookies();
    if (typeof cookies.get("ToDoList") === "undefined") {
      return [];
    } else {
      var list = cookies.get("ToDoList");
      return list;
    }
  }

  // Name:          saveListToCookie
  // Parameters:    list -- an Array object.
  // Notes:         Should only be called with toDoList as list
  function saveListToCookie(list) {
    var cookies = new Cookies();
    console.log("Saving To Do List to cookies...");
    cookies.set("ToDoList", list, { sameSite: true, expires: new Date("1/1/3000")});
  }

  // Name:          changeStatus
  // Parameters:    id -- an integer. the id of
  function changeStatus(id) {
    var list = toDoList;
    var thisElement = list.filter((entry) => entry.id == id)[0];
    thisElement.completed = !thisElement.completed;
    setToDoList(list);
    saveListToCookie(toDoList);
  }

  // Name:          addEntry
  // Parameters:    summary -- String. A summary of the new toDoList entry

  function addEntry(summary) {
    const thisEntry = {
      id: currID,
      summary: summary,
      completed: false,
    };
    setToDoList([...toDoList, thisEntry]);
    setID(currID + 1);
    setSummary("");
    saveListToCookie(toDoList);
  }

  // Name:          removeEntry
  // Parameters:    targetID -- the ID of the toDoList element to be deleted
  // Notes:         No error thrown if targetID is not found, the list will not change.

  function removeEntry(targetID) {
    const initialLength = toDoList.length;
    const filteredList = toDoList.filter((item) => item.id !== targetID);
    if (initialLength === filteredList.length) {
      console.log(
        "ToDoList: removeEntry() was called with invalid id " + targetID
      );
    }
    setToDoList(filteredList);
    saveListToCookie(toDoList);
  }

  // Name:          handleSubmit
  // Parameters:    event -- an onSubmit event from the new task form
  // Description:   adds a new entry with the text currently in the input area as the summary.

  function handleSubmit(event) {
    event.preventDefault();

    addEntry(summary);
  }

  // Name:          handleSummaryChange
  // Parameters:    event -- an onChange event from the new task text box
  function handleSummaryChange(event) {
    event.preventDefault();
    setSummary(event.target.value);
  }




  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="to-do-list-input"
          type="text"
          value={summary}
          onChange={handleSummaryChange}
          placeholder="New task..."
        />
      </form>
      {toDoList.length===0 ? toDoListPlaceholderElement : toDoListDOMElement}
    </>
  );
}
