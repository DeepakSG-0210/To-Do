import React, { useState } from 'react';

function App() {
    const [todoList, setTodoList] = useState([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Task 3' },
        { id: 4, title: 'Task 4' }
    ]);
    const [doingList, setDoingList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupTimer, setPopupTimer] = useState(null);
    const [previousState, setPreviousState] = useState(null); // Store the previous state for undo functionality

    const showPopupMessage = (message) => {
        setPopupMessage(message);
        clearTimeout(popupTimer);
        const timer = setTimeout(() => {
            setPopupMessage('');
        }, 2000);
        setPopupTimer(timer);
    };

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData("task", JSON.stringify(item));
        // Capture the current state before making changes
        setPreviousState({
            todoList: [...todoList],
            doingList: [...doingList],
            doneList: [...doneList]
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e, newListName) => {
        e.preventDefault(); // This is necessary to allow for the drop to happen
        const item = JSON.parse(e.dataTransfer.getData("task"));

        // Remove the item from all lists to then re-add it to the target list
        const updateList = (list, action) => {
            return list.filter(task => task.id !== item.id).concat(action === newListName ? [item] : []);
        };

        setTodoList(list => updateList(list, 'todo'));
        setDoingList(list => updateList(list, 'doing'));
        setDoneList(list => updateList(list, 'done'));

        showPopupMessage(`Task "${item.title}" moved to ${newListName}.`);
    };

    const handleUndo = () => {
        if (previousState) {
            setTodoList(previousState.todoList);
            setDoingList(previousState.doingList);
            setDoneList(previousState.doneList);
            setPreviousState(null); // Clear the previous state after undoing
            showPopupMessage('Action undone.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-4 pt-16 pb-16">Manage Tasks</h1>
            <div className="w-full flex justify-between">
                {/* Dynamic list rendering */}
                {['todo', 'doing', 'done'].map((listName, index) => (
                    <div key={index}
                        className={`w-1/3 bg-slate-300 opacity-70 mx-8 rounded-lg ${index !== 1 ? 'ml-8 mr-8' : 'mx-8'}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, listName)}>
                        <h2 className="text-2xl mt-4 font-bold mb-2 ml-48">{listName.charAt(0).toUpperCase() + listName.slice(1)}</h2>
                        <ul>
                            {(listName === 'todo' ? todoList : listName === 'doing' ? doingList : doneList).map(item => (
                                <li key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    className="cursor-pointer mb-2 font-semibold p-4 rounded-lg mx-8 my-4 hover:font-bold"
                                    style={{ backgroundColor: listName === 'todo' ? '#fca5a5' : listName === 'doing' ? '#fde047' : '#86efac' }}>
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {popupMessage && (
                <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg">
                    <span>{popupMessage}</span>
                    {previousState && (
                        <button onClick={handleUndo} className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg">
                            Undo
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;