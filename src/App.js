import './App.css';
import AdminDashboard from './AdminDashboard';
import Side from './components/Side';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AddCategory from './pages/AddCategory';
import Categories from './pages/Categories';

function App() {
  return (
    <div className="App">
      {/* <Side />
      <AdminDashboard /> */}
      <Router>
        <Routes>
          <Route path="/add-category" element={<AddCategory />} />    {/* Add New Category */}
          <Route path="/categories" element={<Categories />} />

                   404 Not Found
        </Routes>
      </Router>
    </div>
  );
}

export default App;
