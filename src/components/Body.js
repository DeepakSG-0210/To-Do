import React, { useEffect, useState } from 'react';

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
    const [selectedTask, setSelectedTask] = useState(null);
    const [previousLists, setPreviousLists] = useState(null); // Store previous lists state
    const [originalLengths, setOriginalLengths] = useState(null); // Store original lengths of lists

    useEffect(() => {
        return () => {
            clearTimeout(popupTimer); // Cleanup the timer when the component unmounts
        };
    }, [popupTimer]);

    const showPopupMessage = (message) => {
        setPopupMessage(message);
        clearTimeout(popupTimer);
        const timer = setTimeout(() => {
            setPopupMessage('');
        }, 2000);
        setPopupTimer(timer);
    };

    const handleUndo = () => {
        const lastAction = popupMessage.includes('Swap') ? 'swapAll' : 'move';
        if (lastAction === 'move') {
            if (previousLists) {
                setTodoList(previousLists.todoList);
                setDoingList(previousLists.doingList);
                setDoneList(previousLists.doneList);
                setPopupMessage('');
                setPreviousLists(null); // Reset previous lists state after undo
            }
        } else if (lastAction === 'swapAll') {
            if (originalLengths) {
                const { originalDoneLength, originalDoingLength, originalTodoLength } = originalLengths;
                const originalDone = doneList.slice(0, originalDoneLength);
                const originalDoing = doneList.slice(originalDoneLength, originalDoneLength + originalDoingLength);
                const originalTodo = doneList.slice(originalDoneLength + originalDoingLength);
                setTodoList(originalTodo);
                setDoingList(originalDoing);
                setDoneList(originalDone);
                setOriginalLengths(null); // Reset original lengths after undoing "Swap All"
            }
        }
        setPopupMessage('');
        clearTimeout(popupTimer);
    };

    const handleSwapAll = () => {
        const originalDoneLength = doneList.length;
        const originalDoingLength = doingList.length;
        const originalTodoLength = todoList.length;
        setOriginalLengths({ originalDoneLength, originalDoingLength, originalTodoLength }); // Store original lengths
        setDoneList([...doneList, ...doingList, ...todoList]);
        setDoingList([]);
        setTodoList([]);
        showPopupMessage('Swap All completed successfully');
    };

    const handleOpenDropdown = (item) => {
        setSelectedTask(item);
    };

    const handleMoveTask = (targetList) => {
        const item = selectedTask;
        if (item) {
            const previousState = { todoList, doingList, doneList }; // Store previous state
            if (todoList.includes(item)) {
                setTodoList(todoList.filter(task => task !== item));
            } else if (doingList.includes(item)) {
                setDoingList(doingList.filter(task => task !== item));
            } else if (doneList.includes(item)) {
                setDoneList(doneList.filter(task => task !== item));
            }
            targetList === 'todo' && setTodoList([...todoList, item]);
            targetList === 'doing' && setDoingList([...doingList, item]);
            targetList === 'done' && setDoneList([...doneList, item]);
            setSelectedTask(null);
            showPopupMessage('List Item moved successfully');

            // Store previous state to enable undo
            setPreviousLists(previousState);
        }
    };


    return (
        <div className="">
            <h1 className="text-3xl font-bold text-center mb-4 pt-16 pb-16">Manage Tasks</h1>
            <div className="w-full flex justify-between">
                <div className="w-1/3 bg-slate-300 opacity-70 rounded-lg mx-8">
                    <h2 className="text-2xl mt-4 font-bold mb-2 items-center ml-48">To-do</h2>
                    <ul>
                        {todoList.map(item => (
                            <li key={item.id} className="cursor-pointer mb-2 font-semibold bg-red-300 p-4 rounded-lg mx-8 my-4 hover:bg-gray-15 hover:font-bold relative hover:bg-red-400">
                                <div className="flex justify-between">
                                    <span>{item.title}</span>
                                    <div className="kebab-bar" onClick={() => handleOpenDropdown(item)}>
                                        <span className="hover:text-lg">➡️</span>
                                    </div>
                                </div>
                                {selectedTask === item && (
                                    <div className="absolute right-0 top-0 mt-6 mr-6 bg-white rounded-md shadow-lg z-20">
                                        <button onClick={() => handleMoveTask('doing')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">Move to Doing</button>
                                        <button onClick={() => handleMoveTask('done')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">Move to Done</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-1/3 border-black bg-slate-300 opacity-70 mx-8 rounded-lg">
                    <h2 className="text-2xl mt-4 font-bold mb-2 ml-48">Doing</h2>
                    <ul>
                        {doingList.map(item => (
                            <li key={item.id} className="cursor-pointer mb-2 font-semibold bg-yellow-200 p-4 rounded-lg mx-8 my-4 hover:bg-gray-15 hover:font-bold relative hover:bg-yellow-300">
                                <div className="flex justify-between">
                                    <span>{item.title}</span>
                                    <div className="kebab-bar" onClick={() => handleOpenDropdown(item)}>
                                        <span className="hover:text-lg">➡️</span>
                                    </div>
                                </div>
                                {selectedTask === item && (
                                    <div className="absolute right-0 top-0 mt-6 mr-6 bg-white rounded-md shadow-lg">
                                        <button onClick={() => handleMoveTask('todo')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">Move to To-do</button>
                                        <button onClick={() => handleMoveTask('done')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">Move to Done</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-1/3 border-black bg-slate-300 opacity-70 mx-8 rounded-lg">
                    <h2 className="text-2xl mt-4 font-bold mb-2 ml-48">Done</h2>
                    <ul>
                        {doneList.map(item => (
                            <li key={item.id} className="cursor-pointer mb-2 font-semibold bg-green-300 p-4 rounded-lg mx-8 my-4 hover:bg-gray-15 hover:font-bold relative hover:bg-green-400">
                                <div className="flex justify-between">
                                    <span>{item.title}</span>
                                    <div className="kebab-bar" onClick={() => handleOpenDropdown(item)}>
                                        <span className="hover:text-lg">➡️</span>
                                    </div>
                                </div>
                                {selectedTask === item && (
                                    <div className="absolute right-0 top-0 mt-6 mr-6 bg-white rounded-md shadow-lg">
                                        <button onClick={() => handleMoveTask('todo')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">Move to To-do</button>
                                        <button onClick={() => handleMoveTask('doing')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">Move to Doing</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button
                onClick={handleSwapAll}
                className="fixed left-1/2 transform -translate-x-1/2 mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                style={{ zIndex: 9999 }}
            >
                Swap All
            </button>

            {popupMessage && (
                <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg">
                    <span>{popupMessage}</span>
                    <button onClick={handleUndo} className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg">
                        Undo
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
