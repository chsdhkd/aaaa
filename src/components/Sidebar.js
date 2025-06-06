import React from 'react';
import {Link} from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className = "sidebar">
            <h2><ul><Link to = "/">홈 화면</Link></ul></h2>
            
            <ul>
                <li><Link to = "/calendar">달력</Link></li>
                <li><Link to = "/todos">할 일 </Link></li>
                <li><Link to = "/notes">노트</Link></li>
                
                
            </ul>
        </div>
    )
}


export default Sidebar;


