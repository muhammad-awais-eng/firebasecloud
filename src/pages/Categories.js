import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
import AddCategory from './AddCategory'; // Import AddCategory component

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categoriesCollection = collection(db, 'categories');
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
    } catch (err) {
      setError('Error fetching categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle category list refresh after adding a new category
  const handleCategoryAdded = () => {
    fetchCategories();
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>Categories</h1>
      <AddCategory onCategoryAdded={handleCategoryAdded} />
      {categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category.id} style={{ marginBottom: '20px' }}>
              <h3>{category.name}</h3>
              {category.pic ? (
                <img src={category.pic} alt={category.name} width="100" />
              ) : (
                <p>No image available</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories available.</p>
      )}
    </div>
  );
}

export default Categories;
