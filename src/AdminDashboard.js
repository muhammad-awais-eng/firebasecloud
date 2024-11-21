// src/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserTable from './components/UserTable';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', branch: '' });

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchUsers();
    }, []);

    // Add a new user
    const handleAddUser = async () => {
        await addDoc(collection(db, 'users'), newUser);
        setNewUser({ name: '', email: '', branch: '' });
        // Refresh users
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // Delete a user
    const handleDeleteUser = async (id) => {
        await deleteDoc(doc(db, 'users', id));
        // Refresh users
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        // <div>
            <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Header />
                <UserTable />
            </div>
        {/* </div> */}
            {/* <h1>Admin Dashboard</h1>
            <h2>Add User</h2>
            <input 
                type="text" 
                placeholder="Name" 
                value={newUser.name} 
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
            />
            <input 
                type="text" 
                placeholder="Branch" 
                value={newUser.branch} 
                onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })} 
            />
            <button onClick={handleAddUser}>Add User</button>
            
            <h2>Users List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.branch} 
                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default AdminDashboard;
