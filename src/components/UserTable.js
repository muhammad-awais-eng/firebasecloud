import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Assuming you've already set up Firebase
import { collection, getDocs } from 'firebase/firestore';

const UserTable = () => {
    const [users, setUsers] = useState([]);

   
        useEffect(() => {
            const fetchUsers = async () => {
                const querySnapshot = await getDocs(collection(db, 'users'));
                setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            };
            fetchUsers();
        }, []);

    return (
        <div className="user-table">
            <h2>Last Tasks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Admin</th>
                        <th>Members</th>
                        <th>Status</th>
                        <th>Run Time</th>
                        <th>Finish Date</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.admin}</td>
                            <td>{user.members}</td>
                            <td>{user.status}</td>
                            <td>{user.runTime}</td>
                            <td>{user.finishDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;