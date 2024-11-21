import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Assuming you've set up firebase.js with Firestore configuration
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

function BranchManagement() {
    const [branchName, setBranchName] = useState('');
    const [branches, setBranches] = useState([]);

    // Fetch branches from Firestore
    useEffect(() => {
        const fetchBranches = async () => {
            const querySnapshot = await getDocs(collection(db, 'branches'));
            setBranches(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchBranches();
    }, []);

    // Add branch to Firestore
    const handleAddBranch = async (e) => {
        e.preventDefault();
        if (branchName.trim()) {
            await addDoc(collection(db, 'branches'), { name: branchName });
            setBranchName('');
            // Refresh branches
            const querySnapshot = await getDocs(collection(db, 'branches'));
            setBranches(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
    };

    // Delete branch from Firestore
    const handleDeleteBranch = async (id) => {
        await deleteDoc(doc(db, 'branches', id));
        setBranches(branches.filter(branch => branch.id !== id));
    };

    return (
        <div>
            <h2>Branch Management</h2>
            <form onSubmit={handleAddBranch}>
                <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Enter branch name"
                    required
                />
                <button type="submit">Add Branch</button>
            </form>
            <ul>
                {branches.map(branch => (
                    <li key={branch.id}>
                        {branch.name} 
                        <button onClick={() => handleDeleteBranch(branch.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BranchManagement;
