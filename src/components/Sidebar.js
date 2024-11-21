import React from 'react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>BRESS</h2>
            <nav>
                <ul>
                    <li>Dashboard</li>
                    <li>Projects</li>
                    <li>Task List</li>
                    <li>Services</li>
                    <li>Notifications</li>
                    <li>Chat</li>
                </ul>
            </nav>
            <div className="user">
                <img src="/user-avatar.png" alt="User Avatar" />
                <p>Emily Jonson</p>
                <p>jonson@bress.com</p>
            </div>
        </div>
    );
};

export default Sidebar;
