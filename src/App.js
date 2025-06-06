import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CalendarView from './pages/CalendarView';
import SubjectNoteView from './pages/SubjectNoteView'; 
import SubjectNoteDetail from './pages/SubjectNoteDetail'; 
import TodoView from './pages/TodoView';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/todos" element={<TodoView />} />
            <Route path="/notes" element={<SubjectNoteView />} />
            <Route path="/notes/:subject" element={<SubjectNoteDetail />} /> 
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
