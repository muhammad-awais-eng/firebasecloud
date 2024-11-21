import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firebase setup
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getFirestore ,getDoc } from 'firebase/firestore';
import axios from 'axios'; // Import Axios for Cloudinary API requests
import { getFunctions, httpsCallable } from 'firebase/functions';

function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // Array to hold multiple image files
  const [editId, setEditId] = useState(null);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, 'categories');
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle image file input
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Limit to 10 images
    // if (files.length > 10) {
    //   alert('You can only select up to 10 images.');
    //   return;
    // }
    setImageFiles(files);
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async (imageFiles, folderName) => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dzqj176rt/image/upload`;
    
    const uploadedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my_present'); // Your upload preset
        formData.append('folder', folderName); // Specify the folder for Cloudinary images
  
        const response = await axios.post(cloudinaryUrl, formData);
        return {
          publicId: response.data.public_id, // Store the public_id for deletion
          url: response.data.secure_url,     // URL for the image
        };
      })
    );
  
    return uploadedImages; // Return array of image objects containing public_id and url
  };

  // Handle form submission to add or update a category
  const handleSubmit = async () => {
    if (!name || !description || imageFiles.length === 0) {
      return alert('Please fill in all fields and select at least one image');
    }
  
    try {
      // Upload images to Cloudinary and get public_id and URL
      const uploadedImages = await uploadImagesToCloudinary(imageFiles, "category");
  
      if (uploadedImages.length === 0) return; // Abort if image upload fails
  
      const categoryData = { 
        name, 
        description, 
        images: uploadedImages // Save both the URL and public_id of each image
      };
  
      if (editId) {
        // Update existing category in Firestore
        const categoryDoc = doc(db, 'categories', editId);
        await updateDoc(categoryDoc, categoryData);
        setEditId(null); // Reset editId after updating
      } else {
        // Add a new category to Firestore
        await addDoc(collection(db, 'categories'), categoryData);
      }
  
      // Reset form fields after submission
      setName('');
      setDescription('');
      setImageFiles([]);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    }
  };

  // Handle edit button click
  const handleEdit = (category) => {
    setEditId(category.id);
    setName(category.name);
    setDescription(category.description);
    setImageFiles([]); // Reset image files for editing
  };

  // Handle delete button click
  // const handleDelete = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, 'categories', id));
  //     setCategories(categories.filter((category) => category.id !== id));
  //   } catch (error) {
  //     console.error('Error deleting category:', error);
  //     alert('Error deleting category. Please try again.');
  //   }
  // };

  
  
  // Assuming db is already initialized
  const db = getFirestore();
  
  const handleDelete = async (id) => {
    try {
      // 1. Get the category document from Firestore to retrieve the publicId
      const categoryDoc = await getDoc(doc(db, 'categories', id));
  
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        
        // 2. Retrieve the publicId from the first image in the 'images' array
        const publicId = categoryData.images[0]?.publicId;
  
        if (publicId) {
          // 3. Call Firebase Function to delete the image from Cloudinary
          const functions = getFunctions();
          const deleteImageFromCloudinary = httpsCallable(functions, 'deleteImageFromCloudinary');
          
          await deleteImageFromCloudinary({ publicId });
  
          // 4. Delete the category from Firestore
          await deleteDoc(doc(db, 'categories', id));
  
          // Optionally update the local state if you're storing the categories in state
          setCategories(categories.filter((category) => category.id !== id));
  
          console.log('Category and image deleted successfully!');
        } else {
          console.log('No image found for this category');
        }
      } else {
        console.log('Category not found');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };
  
  return (
    <div>
      <h2>Category Management</h2>
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" multiple onChange={handleImageChange} />
      <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'} Category</button>

      <h3>Categories List</h3>
      {categories.map((category) => (
        <div key={category.id}>
          <h4>{category.name}</h4>
          <p>{category.description}</p>
          {category.images &&
            category.images.map((image, index) => (
              <img key={index} src={image} alt={`${category.name} ${index}`} width="100" />
            ))}
          <button onClick={() => handleEdit(category)}>Edit</button>
          <button onClick={() => handleDelete(category.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default CategoryScreen;
