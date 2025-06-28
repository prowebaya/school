import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchAllCategories,
  createCategory,
  deleteCategory,
} from '../../redux/StudentAddmissionDetail/categoryHandle';
import {
  setNewCategory,
  setSearch,
  resetCategory,
} from '../../redux/StudentAddmissionDetail/categorySlice';
import { RootState, AppDispatch } from '../../redux/store';

const CategoryManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, newCategory, search, loading, error, status } = useSelector(
    (state: RootState) => state.category
  );
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAllCategories(adminID));
    } else {
      toast.error('Please log in to manage categories', { position: 'top-right', autoClose: 3000 });
    }

    return () => {
      dispatch(resetCategory());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const addCategory = () => {
    if (!newCategory.trim()) {
      toast.warn('Category name cannot be empty!', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (categories.some((cat) => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.warn('Category already exists!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(createCategory(adminID, newCategory.trim())).then(() => {
      toast.success('Category added successfully', { position: 'top-right', autoClose: 3000 });
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(adminID, categoryId)).then(() => {
        toast.success('Category deleted successfully', { position: 'top-right', autoClose: 3000 });
      });
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <ToastContainer />
        {/* Left Side - Create Category Form */}
        <div
          style={{
            width: '40%',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
            Create Category
          </h2>
          <label style={{ fontWeight: 'bold' }}>Category Name *</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => dispatch(setNewCategory(e.target.value))}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          <button
            onClick={addCategory}
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Right Side - Category List */}
        <div
          style={{
            width: '55%',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
            Category List
          </h2>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          {loading && (
            <div style={{ textAlign: 'center', color: '#34495e' }}>Loading...</div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Category ID</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{cat.name}</td>
                    <td style={{ padding: '10px' }}>{cat.id}</td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        disabled={loading}
                        style={{
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: '10px', textAlign: 'center', color: '#999' }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CategoryManager;