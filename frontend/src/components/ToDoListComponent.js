import {React, useState} from "react";
import Cookies from "universal-cookie";

export default function ToDoList(){
    const cookies = new Cookies();
    const getListFromCookie = () => {
        var list = cookies.get("ToDoList");
        return list;
    }

    const [toDoList, setToDoList] = useState(getListFromCookie);


    function addEntry(summary){
        const thisEntry = {
            id: "",
            summary: summary,
            completed: false
        }

        setToDoList([...toDoList, thisEntry]);
    }

    function removeEntry(id){}



    return(<div id="to-do-list">{toDoList}</div>);

}