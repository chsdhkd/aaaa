import React, { useState } from "react";
import useFirestoreCrud from "../../utils/useFirestoreCrud";
import "./index.css";

const TodoView = () => {
    const { data: tasks, remove, loading } = useFirestoreCrud("tasks");

    const calculateDDay = (targetDateStr) => {
        const today = new Date();
        const target = new Date(targetDateStr);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "D-Day";
        if (diffDays > 0) return `D-${diffDays}`;
        return `D+${Math.abs(diffDays)}`;
    };

    return (
        <div className="todo-container">
            <h1>전체 할 일</h1>
            {loading ? (
                <p>불러오는 중...</p>
            ) : (
                <ul className="todo-list">
                    {tasks.length === 0 && <li>할 일이 없습니다.</li>}
                    {tasks.map((task) => (
                        <li key={task.id} className="todo-item">
                            <div className="todo-text">
                                <strong>{task.title}</strong>
                                <span className="d-day">
                                    {calculateDDay(task.date)}
                                </span>
                            </div>
                            <button
                                onClick={() => remove(task.id)}
                                className="delete-button"
                            >
                                완료 (삭제)
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TodoView;
