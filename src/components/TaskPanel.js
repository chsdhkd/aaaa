import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import './TaskPanel.css';

const TaskPanel = ({ date }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (!date) return;

    const q = query(collection(db, 'tasks'), where('date', '==', date));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    });

    return () => unsubscribe(); 
  }, [date]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    await addDoc(collection(db, 'tasks'), {
      date,
      title: newTask,
      done: false
    });
    setNewTask('');
  };

  const toggleTask = async (id, done) => {
    const ref = doc(db, 'tasks', id);
    await updateDoc(ref, { done: !done });
  };

  const deleteTask = async (id) => {
    const ref = doc(db, 'tasks', id);
    await deleteDoc(ref);
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

      <ul className="task-list">
        {tasks.length === 0 && <li className="task-empty">할 일이 없습니다.</li>}
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id, task.done)}
            />
            <span>{task.title}</span>
            <button onClick={() => deleteTask(task.id)}>삭제 버튼</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPanel;
