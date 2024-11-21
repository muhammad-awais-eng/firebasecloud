// AddCategory.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [categoryPic, setCategoryPic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryPic) {
      setError('Both fields are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Add category to Firestore
      await addDoc(collection(db, 'categories'), {
        name: categoryName,
        pic: categoryPic,
      });

      // Reset the form
      setCategoryName('');
      setCategoryPic('');
      alert('Category added successfully!');
    } catch (err) {
      setError('Error adding category: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Category</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category Image URL:</label>
          <input
            type="text"
            value={categoryPic}
            onChange={(e) => setCategoryPic(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding Category...' : 'Add Category'}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default AddCategory;
