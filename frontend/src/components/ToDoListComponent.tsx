// Checklist vector by Qaisir Mehmood via vecteezy

import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";

type ToDoListEntry = {
    id: number;
    summary: string;
    completed: boolean;
};

export default function ToDoList() {
    const [toDoList, setToDoList] = useState(getListFromCookie());
    const [currID, setID] = useState(
        toDoList.length > 0 ? toDoList[toDoList.length - 1].id + 1 : 0,
    );
    const [summary, setSummary] = useState("");

    useEffect(() => {
        saveListToCookie(toDoList);
    });

    function toggleCompleted(targetID: number) {
        setToDoList((list: ToDoListEntry[]) =>
            list.map((item: ToDoListEntry) =>
                item.id === targetID
                    ? { ...item, completed: !item.completed }
                    : item,
            ),
        );
    }

    const toDoListRendered = (
        <ul className="p-0">
            {toDoList.map((task: ToDoListEntry) => (
                <ToDoListElement
                    key={task.id}
                    taskId={task.id}
                    description={task.summary}
                    completed={task.completed}
                    onToggleCompleted={() => toggleCompleted(task.id)}
                    onDelete={() => removeEntry(task.id)}
                />
            ))}
        </ul>
    );

    const toDoListPlaceholderElement = (
        <div className="flex min-h-[12rem] flex-col items-center justify-center py-12 text-center align-middle">
            <img
                className="w-24 opacity-10"
                src={process.env.PUBLIC_URL + "/33_Tasks.svg"}
                alt=""
            />
            <p className="text-ink-secondary opacity-60">
                Tasks will appear here.
            </p>
        </div>
    );

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
    function saveListToCookie(list: ToDoListEntry[]) {
        var cookies = new Cookies();
        console.log("Saving To Do List to cookies...");
        cookies.set("ToDoList", list, {
            sameSite: true,
            expires: new Date("1/1/3000"),
        });
    }

    // Name:          addEntry
    // Parameters:    summary -- String. A summary of the new toDoList entry

    function addEntry(summary: string) {
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

    function removeEntry(targetID: number) {
        const initialLength = toDoList.length;
        const filteredList = toDoList.filter((item: ToDoListEntry) => item.id !== targetID);
        if (initialLength === filteredList.length) {
            console.log(
                "ToDoList: removeEntry() was called with invalid id " +
                    targetID,
            );
        }
        setToDoList(filteredList);
        saveListToCookie(toDoList);
    }

    // Name:          handleSubmit
    // Parameters:    event -- an onSubmit event from the new task form
    // Description:   adds a new entry with the text currently in the input area as the summary.

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        addEntry(summary);
    }

    // Name:          handleSummaryChange
    // Parameters:    event -- an onChange event from the new task text box
    function handleSummaryChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setSummary(event.target.value);
    }

    return (
        <div className="flex h-full min-h-0 flex-col font-panel-mono text-todo-mono">
            <form className="shrink-0" onSubmit={handleSubmit}>
                <input
                    className="mb-0 box-border w-full max-w-full rounded border border-ink-ghost bg-surface-1 px-1.5 py-1 text-todo-mono placeholder:text-ink-ghost focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-ink-dim"
                    type="text"
                    value={summary}
                    onChange={handleSummaryChange}
                    placeholder="New task..."
                />
            </form>
            <div className="scrollbar-panel min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
                {toDoList.length === 0
                    ? toDoListPlaceholderElement
                    : toDoListRendered}
            </div>
        </div>
    );
}

function ToDoListElement({
    taskId,
    description,
    completed,
    onToggleCompleted,
    onDelete,
}: {
    taskId: number;
    description: string;
    completed: boolean;
    onToggleCompleted: () => void;
    onDelete: () => void;
}) {
    const toggleId = `todo-toggle-${taskId}`;
    return (
        <li className="my-2.5 flex w-full flex-row items-center justify-between gap-2 px-2 py-0">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <button
                    id={toggleId}
                    type="button"
                    role="checkbox"
                    aria-checked={completed}
                    aria-label={completed ? "Mark task incomplete" : "Mark task complete"}
                    className="shrink-0 select-none rounded px-0.5 font-panel-mono text-sm leading-none text-todo-mono tabular-nums hover:bg-surface-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    onClick={onToggleCompleted}
                >
                    <span aria-hidden className="inline-block w-[3ch] text-center">
                        {completed ? "[▦]" : "[ ]"}
                    </span>
                </button>
                <label
                    htmlFor={toggleId}
                    className={`min-w-0 flex-1 cursor-pointer truncate text-todo-mono ${completed ? "line-through opacity-50" : ""}`}
                >
                    {description}
                </label>
            </div>
            <button
                type="button"
                className="shrink-0 rounded px-1.5 text-lg leading-none text-todo-mono/70 hover:bg-surface-2 hover:text-todo-mono"
                onClick={onDelete}
                aria-label="Delete task"
            >
                ×
            </button>
        </li>
    );
}
