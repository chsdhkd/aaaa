import React, {useEffect, useState} from 'react';
import './CalendarView.css'
import TaskPanel from '../components/TaskPanel'; 

import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CalendarView = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [taskDates, setTaskDates]= useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year,month-1,+1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month+1,1));
    setSelectedDate(null);
  };
  
  const isToday = (day) => {
    return(
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day 

    );
  };

  useEffect(() => {
    const fetchTaskDates = async() => {
      const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

      const q = query(
        collection(db, 'tasks'),
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth)
      );
      const snapshot = await getDocs(q);

      const datesSet = new Set();
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();

        datesSet.add(data.date);
      });

      setTaskDates(Array.from(datesSet));
    };


    fetchTaskDates();
  }, [year,month,daysInMonth]);




  const handleDateClick = (day) => {
    const dateString = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    setSelectedDate(dateString);
  }


  const renderCalendarCells = () => {
  const cells = [];




  
  // 1일 전 빈 셀
  for (let i = 0; i < firstDay; i++) {
    
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty" />);
  }

  // 날짜 셀
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSelected = selectedDate ===dateString;
    const hasTask = taskDates.includes(dateString);
    
    cells.push(
      <div
        key={dateString}
        className={`calendar-cell 
          ${isToday(day) ? 'today' : ''} 
          ${isSelected ? 'selected' : ''}
          ${hasTask ? 'has-task' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }

  // ✨ 셀 개수를 7의 배수로 맞춰주기 위해 추가 빈칸 넣기
  const totalCells = cells.length;
  const remainder = totalCells % 7;
  const extra = remainder === 0 ? 0 : 7 - remainder;



  
  for (let i = 0; i < extra; i++) {
    cells.push(<div key={`pad-${i}`} className="calendar-cell empty" />);
  }

  return cells;
};


  return (
    
    
    <div className="calendar-container">
  
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h2>
          {year}년 {month + 1}월
        </h2>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-weekdays">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">{renderCalendarCells()}</div>

      {selectedDate && (
        <div className='task-panel-wrapper'>
          <TaskPanel date = {selectedDate} />
        </div>
      )}
    </div>

    

    
  );
};
  

  

export default CalendarView;
