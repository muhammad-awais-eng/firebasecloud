import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <input type="search" placeholder="Search" />
            <div className="date">
                <p>Monday, 6th March</p>
            </div>
            <button className="view-toggle">Card</button>
            <button className="view-toggle">List</button>
        </header>
    );
};

export default Header;