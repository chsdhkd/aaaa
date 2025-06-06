import React, { useState, useEffect } from "react";
import useFirestoreCrud from "../../utils/useFirestoreCrud"; // 경로는 상황에 맞게 조절

import "./index.css";

const TaskPanel = ({ date }) => {
    const {
        data: tasks,
        create,
        update,
        remove,
        loading,
    } = useFirestoreCrud("tasks");
    const [newTask, setNewTask] = useState("");

    // date에 해당하는 task만 필터링
    const filteredTasks = tasks.filter((task) => task.date === date);

    const handleAddTask = async () => {
        if (!newTask.trim()) return;

        await create({
            date,
            title: newTask,
            done: false,
        });
        setNewTask("");
    };

    const toggleTask = async (id, done) => {
        await update(id, { done: !done });
    };

    const deleteTask = async (id) => {
        await remove(id);
    };

    return (
        <div className="task-panel">
            <h3>{date}의 할 일</h3>

            <div className="task-add">
                <input
                    type="text"
                    placeholder="할 일 입력"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={handleAddTask}>추가</button>
            </div>

            {loading && <div>로딩중...</div>}

            <ul className="task-list">
                {filteredTasks.length === 0 && !loading && (
                    <li className="task-empty">할 일이 없습니다.</li>
                )}
                {filteredTasks.map((task) => (
                    <li
                        key={task.id}
                        className={`task-item ${task.done ? "done" : ""}`}
                    >
                        <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(task.id, task.done)}
                        />
                        <span>{task.title}</span>
                        <button onClick={() => deleteTask(task.id)}>
                            삭제 버튼
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskPanel;
