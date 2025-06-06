import React from "react";
import SubjectCard from "../../components/SubjectCard";

const subjects = [
    { name: "수학", icon: "math.png" },
    { name: "물리", icon: "physics.png" },
    { name: "화학", icon: "chemical.png" },
    { name: "생명", icon: "biology.png" },
    { name: "지구", icon: "earth.png" },
];

const SubjectNoteView = () => {
    return (
        <div>
            <h2>과목을 선택하세요</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {subjects.map((s) => (
                    <SubjectCard key={s.name} subject={s.name} icon={s.icon} />
                ))}
            </div>
        </div>
    );
};

export default SubjectNoteView;
