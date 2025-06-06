import React, { useEffect, useState } from "react";
import "./index.css";
import TaskPanel from "../../components/TaskPanel";

import useFirestoreCrud from "../../utils/useFirestoreCrud";

const CalendarView = () => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
    };

    const { data: tasks, loading } = useFirestoreCrud("tasks");

    const [taskDates, setTaskDates] = useState([]);

    useEffect(() => {
        if (!loading) {
            const startOfMonth = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-01`;
            const endOfMonth = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-${String(daysInMonth).padStart(2, "0")}`;

            const filteredDates = tasks
                .filter(
                    (task) =>
                        task.date >= startOfMonth && task.date <= endOfMonth
                )
                .map((task) => task.date);

            setTaskDates([...new Set(filteredDates)]);
        }
    }, [tasks, loading, year, month, daysInMonth]);

    const isToday = (day) => {
        return (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
        );
    };

    const handleDateClick = (day) => {
        const dateString = `${year}-${String(month + 1).padStart(
            2,
            "0"
        )}-${String(day).padStart(2, "0")}`;
        setSelectedDate(dateString);
    };

    const renderCalendarCells = () => {
        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(
                <div key={`empty-${i}`} className="calendar-cell empty" />
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;
            const isSelected = selectedDate === dateString;
            const hasTask = taskDates.includes(dateString);

            cells.push(
                <div
                    key={dateString}
                    className={`calendar-cell 
          ${isToday(day) ? "today" : ""} 
          ${isSelected ? "selected" : ""}
          ${hasTask ? "has-task" : ""}`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }

        const totalCells = cells.length;
        const remainder = totalCells % 7;
        const extra = remainder === 0 ? 0 : 7 - remainder;

        for (let i = 0; i < extra; i++) {
            cells.push(
                <div key={`pad-${i}`} className="calendar-cell empty" />
            );
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
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className="calendar-weekday">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-grid">{renderCalendarCells()}</div>

            {selectedDate && (
                <div className="task-panel-wrapper">
                    <TaskPanel date={selectedDate} />
                </div>
            )}
        </div>
    );
};

export default CalendarView;
