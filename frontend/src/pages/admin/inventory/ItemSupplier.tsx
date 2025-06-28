import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, InputAdornment, Snackbar, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllSupplier,//Spelling Mistake
  createSupplier,
  updateSupplier,
  deleteSupplier,
  clearSupplierError
} from '../../../redux/supplierRelated/supplierHandle.js';

const ItemSupplier: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    description: ''
  });

  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;//(DOT. Missing)
  const { suppliersList, loading, error } = useSelector((state) => state.supplier);

  useEffect(() => {
    if (adminID) {
      dispatch(getAllSupplier(adminID));
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearSupplierError());
    }
  }, [error, dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPersonName: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      description: ''
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      setSnack({ open: true, message: 'Supplier Name and Phone are required!', severity: 'warning' });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || '',
      address: formData.address?.trim() || '',
      contactPersonName: formData.contactPersonName?.trim() || '',
      contactPersonPhone: formData.contactPersonPhone?.trim() || '',
      contactPersonEmail: formData.contactPersonEmail?.trim() || '',
      description: formData.description?.trim() || '',
      adminID: adminID || ''
    };

    const exists = suppliersList?.some(
      (supplier) =>
       /*  supplier.name.toLowerCase() === formData.name.trim().toLowerCase() &&
        supplier.phone.trim() === formData.phone.trim() &&
        supplier._id !== editId */
        (supplier.name.toLowerCase() === formData.name.trim().toLowerCase() ||
        supplier.phone.trim() === formData.phone.trim()) &&
        supplier._id !== editId
    );

    if (exists) {
      setSnack({ open: true, message: 'Supplier with same name and phone already exists!', severity: 'warning' });
      return;
    }

    if (editId) {
      dispatch(updateSupplier(editId, payload))
        .then(() => {
          resetForm();
          dispatch(getAllSupplier(adminID));// must be difinde admin

          setSnack({ open: true, message: 'Supplier updated successfully', severity: 'success' });
        })
        .catch((err) => console.error(err));
    } else {
      dispatch(createSupplier(payload))
        .then(() => {
          resetForm();
          dispatch(getAllSupplier(adminID));
          setSnack({ open: true, message: 'Supplier created successfully', severity: 'success' });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEdit = (supplier) => {
    setEditId(supplier._id);
    setFormData({
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      contactPersonName: supplier.contactPersonName || '',
      contactPersonPhone: supplier.contactPersonPhone || '',
      contactPersonEmail: supplier.contactPersonEmail || '',
      description: supplier.description || ''
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteSupplier(id, adminID))
      .then(() => {
        dispatch(getAllSupplier(adminID));
        setSnack({ open: true, message: 'Supplier deleted!', severity: 'info' });
      });
  };

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

/*   const filteredSuppliers = Array.isArray(suppliersList)
    ? suppliersList.filter(supplier =>
        supplier.name &&
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
 */

    const filteredSuppliers = Array.isArray(suppliersList)
  ? suppliersList.filter(supplier =>
      (supplier.name && supplier.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (supplier.phone && supplier.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (supplier.email && supplier.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  : [];

if (!currentUser) {
  return <Typography>Please log in to view suppliers.</Typography>;
}


  if (!currentUser) {
    return <Typography>Please log in to view suppliers.</Typography>;
  }
return (
  <div className="category-container">
    <div className="category-header">
      <div className="add-form">
        <h2 className="form-title">{editId ? 'Edit Supplier' : 'Add Supplier'}</h2>
        <form onSubmit={handleSubmit}>
          {['name', 'phone', 'email', 'address', 'contactPersonName', 'contactPersonPhone', 'contactPersonEmail', 'description']
            .map((field, index) => (
              <div className="form-group" key={index}>
                <label className="form-label">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="form-input"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          <button className="save-btn" type="submit" disabled={loading}>
            {editId ? 'Update' : 'Save'}
          </button>
        </form>
      </div>

      <div className="category-list">
        <h2 className="list-title">Supplier List</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="icons">
            <span role="img" aria-label="export" className="icon">📤</span>
            <span role="img" aria-label="print" className="icon">🖨️</span>
            <span role="img" aria-label="close" className="icon">❌</span>
          </div>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Phone</th>
              <th className="table-header">Email</th>
              <th className="table-header">Address</th>
              <th className="table-header">Contact Person</th>

              <th className="table-header">Person Phone</th>
              <th className="table-header">Person Email</th>
               <th className="table-header">Description</th>
              
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier._id} className="table-row">
                <td className="table-cell">{supplier.name}</td>
                <td className="table-cell">{supplier.phone}</td>
                <td className="table-cell">{supplier.email}</td>
                <td className="table-cell">{supplier.address}</td>
                <td className="table-cell">{supplier.contactPersonName}</td>
                

                <td className="table-cell">{supplier.contactPersonPhone}</td>
                <td className="table-cell">{supplier.contactPersonEmail}</td>
                 <td className="table-cell">{supplier.description}</td>

                <td className="table-cell action-cell">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(supplier)}>
                    ✏️
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(supplier._id)}>
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          Records: 1 to {filteredSuppliers.length} of {filteredSuppliers.length}
        </div>
      </div>
    </div>

    
      {/* CSS Styles */}
      <style>{`
        .category-container {
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
          overflow-x: hidden;
          display: flex;
          justify-content: center;
        }

        .category-header {
          display: flex;
          gap: 30px;
          max-width: 1200px;
          width: 100%;
        }

        .add-form, .category-list {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
        }

        .form-title, .list-title {
          margin-bottom: 20px;
          color: #2c3e50;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          display: block;
          margin-bottom: 5px;
          color: #34495e;
        }

        .form-input {
          width: 100%;
          padding: 10px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-input:focus {
          border-color: #3498db;
          outline: none;
        }

        .save-btn {
          padding: 10px 20px;
          background: #27ae60;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .search-input {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-right: 10px;
        }

        .icons .icon {
          margin-left: 10px;
          cursor: pointer;
          font-size: 16px;
        }

        .category-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          text-align: left;
          background: #1a2526;
          color: white;
          padding: 10px;
        }

        .table-cell {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .action-cell {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          padding: 6px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .edit-btn {
          background: #2980b9;
          color: white;
        }

        .delete-btn {
          background: #e74c3c;
          color: white;
        }

        .pagination {
          margin-top: 15px;
          font-size: 12px;
          color: #555;
        }
      `}</style>
      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>
  </div>
);
};

export default ItemSupplier;