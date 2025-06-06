import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import './TodoView.css';

const TodoView = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('date'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(list);
    });

    return () => unsubscribe();
  }, []);

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const calculateDDay = (targetDateStr) => {
    const today = new Date();
    const target = new Date(targetDateStr);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  return (
    <div className="todo-container">
      <h1>전체 할 일</h1>
      <ul className="todo-list">
        {tasks.length === 0 && <li>할 일이 없습니다.</li>}
        {tasks.map((task) => (
          <li key={task.id} className="todo-item">
            <div className="todo-text">
              <strong>{task.title}</strong>
              <span className="d-day">{calculateDDay(task.date)}</span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="delete-button">
              완료 (삭제)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoView;
