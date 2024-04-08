import React, { useState } from "react";

function App() {
  const [todoList, setTodoList] = useState([
    { id: 1, title: "Task 1" },
    { id: 2, title: "Task 2" },
    { id: 3, title: "Task 3" },
    { id: 4, title: "Task 4" },
  ]);
  const [doingList, setDoingList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTimer, setPopupTimer] = useState(null);
  const [previousState, setPreviousState] = useState(null);

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    clearTimeout(popupTimer);
    const timer = setTimeout(() => {
      setPopupMessage("");
    }, 2000);
    setPopupTimer(timer);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("task", JSON.stringify(item));
    setPreviousState({
      todoList: [...todoList],
      doingList: [...doingList],
      doneList: [...doneList],
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetList) => {
    e.preventDefault();

    const item = JSON.parse(e.dataTransfer.getData("task"));

    const newTodoList = [...todoList];
    const newDoingList = [...doingList];
    const newDoneList = [...doneList];

    const filteredTodoList = newTodoList.filter((task) => task.id !== item.id);
    const filteredDoingList = newDoingList.filter(
      (task) => task.id !== item.id
    );
    const filteredDoneList = newDoneList.filter((task) => task.id !== item.id);

    switch (targetList) {
      case "todo":
        filteredTodoList.push(item);
        break;
      case "doing":
        filteredDoingList.push(item);
        break;
      case "done":
        filteredDoneList.push(item);
        break;
      default:
        console.error("Unknown target list:", targetList);
        return; 
    }

    setTodoList(filteredTodoList);
    setDoingList(filteredDoingList);
    setDoneList(filteredDoneList);

    showPopupMessage(`${item.title} moved successfully`);
  };

  const handleUndo = () => {
    if (previousState) {
      setTodoList(previousState.todoList);
      setDoingList(previousState.doingList);
      setDoneList(previousState.doneList);
      setPreviousState(null);
      showPopupMessage("Action undone");
    }
  };

  const handleSwapAll = () => {
    setPreviousState({
      todoList: [...todoList],
      doingList: [...doingList],
      doneList: [...doneList],
    });

    setDoneList(doneList.concat(todoList));
    setTodoList([]);

    showPopupMessage("All tasks moved from To-do to Done.");
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center mb-4 pt-16 pb-16">
        Manage Tasks
      </h1>
      <div className="w-full flex justify-between">
        <div
          className="w-1/3 bg-slate-300 opacity-70 rounded-lg mx-8"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          <h2 className="text-2xl mt-4 font-bold mb-2 ml-36">To-do</h2>
          <ul>
            {todoList.map((item) => (
              <li
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="cursor-pointer mb-2 font-semibold bg-red-300 p-4 rounded-lg mx-8 my-4 hover:bg-red-400"
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="w-1/3 bg-slate-300 opacity-70 mx-8 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "doing")}
        >
          <h2 className="text-2xl mt-4 font-bold mb-2 ml-36">Doing</h2>
          <ul>
            {doingList.map((item) => (
              <li
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="cursor-pointer mb-2 font-semibold bg-yellow-200 p-4 rounded-lg mx-8 my-4 hover:bg-yellow-300"
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="w-1/3 bg-slate-300 opacity-70 mx-8 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
        >
          <h2 className="text-2xl mt-4 font-bold mb-2 ml-36">Done</h2>
          <ul>
            {doneList.map((item) => (
              <li
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="cursor-pointer mb-2 font-semibold bg-green-300 p-4 rounded-lg mx-8 my-4 hover:bg-green-400"
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {popupMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg">
          <span>{popupMessage}</span>
          {previousState && (
            <button
              onClick={handleUndo}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg"
            >
              Undo
            </button>
          )}
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={handleSwapAll}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded-lg"
        >
          Swap All
        </button>
      </div>
    </div>
  );
}

export default App;
