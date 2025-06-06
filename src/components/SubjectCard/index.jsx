import React from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

const subjectMap = {
    수학: "math",
    물리: "physics",
    화학: "chemical",
    생명: "biology",
    지구: "earth",
};

const SubjectCard = ({ subject, icon }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        const path = subjectMap[subject] || "unknown";
        navigate(`/notes/${path}`);
    };

    return (
        <div className="subject-card" onClick={handleClick}>
            <img src={`/images/${icon}`} alt={subject} />
            <h3>{subject}</h3>
        </div>
    );
};

export default SubjectCard;
