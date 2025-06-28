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
  getAllStores,
  createStore,
  updateStore,
  deleteStore,
  clearStoreError
} from '../../../redux/storeItemRelated/storeHandle.js'; // create this

const ItemStore = () => {
  const [formData, setFormData] = useState({ storeName: '', storeCode: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snack, setSnack] = useState({ 
    open: false,
     message: '', 
     severity: 'success' 
    });

  const dispatch = useDispatch();
  //get login id
     const { currentUser } = useSelector((state) => state.user);
    const adminID = currentUser?._id;
  const { storesList, loading, error } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(getAllStores(adminID));
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const resetForm = () => {
    setFormData({ storeName: '', storeCode: '', description: '' });
    setEditId(null);
  };


  const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.storeName.trim() || !formData.storeCode.trim()) {
    setSnack({ open: true, message: 'Store Name and Code are required!', severity: 'warning' });
    return;
  }

  const payload = {
    storeName: formData.storeName.trim(),
    storeCode: formData.storeCode.trim(),
    description: formData.description?.trim() || '',
    adminID: currentUser?._id || ''
  };

  console.log('Payload:', payload);


      const exists = storesList?.some(
      (sec) => sec.storeName.toLowerCase() ===formData.storeName.trim().toLowerCase() && sec._id !== editId
    );
  


  if (exists) {
    setSnack({ open: true, message: 'Store already exists!', severity: 'warning' });
    return;
  }

  if (editId) {
    dispatch(updateStore(editId, payload))
      .then(() => {
        setEditId(null);
        resetForm();
        dispatch(getAllStores(adminID));
        setSnack({ open: true, message: 'Store updated successfully', severity: 'success' });
      })
      .catch((err) => console.error(err));
  } else {
    dispatch(createStore(payload))
      .then(() => {
        resetForm();
        dispatch(getAllStores(adminID));
        setSnack({ open: true, message: 'Store created successfully', severity: 'success' });
      })
      .catch((err) => console.error(err));
  }
};

  const handleEdit = (store) => {
    setEditId(store._id);
    setFormData({ storeName: store.storeName, storeCode: store.storeCode, description: store.description });
  };

  const handleDelete = (id) => {
    dispatch(deleteStore(id,adminID)).then(() => {
      dispatch(getAllStores(adminID));
      setSnack({ open: true, message: 'Store deleted!', severity: 'info' });
    });
  };

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };



  const filteredStores = Array.isArray(storesList)
  ? storesList.filter(store =>
      (store.storeName && typeof store.storeName === 'string' &&
        store.storeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (store.storeCode && typeof store.storeCode === 'string' &&
        store.storeCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (store.description && typeof store.description === 'string' &&
        store.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  : [];

  return (
    <Box  sx={{
      display: 'flex',
      gap: 3,
      p: 3,
      bgcolor: '#f9f9f9',
      minHeight: '100vh',
    }}>
      {/* Form Section */}
      <Box sx={{
              width: '30%',
              p: 3,
              borderRadius: '12px',
              bgcolor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
        <Typography variant="h6"sx={{ mb: 2, fontWeight: 700, color: '#333' }}>{editId ? 'Edit Store' : 'Add Store'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Store Name *"
            name="storeName"
            value={formData.storeName}
            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
            fullWidth
            required
            sx={{ my: 1 }}
          />
          <TextField
            label="Store Code *"
            name="storeCode"
            value={formData.storeCode}
            onChange={(e) => setFormData({ ...formData, storeCode: e.target.value })}
            fullWidth
            required
            sx={{ my: 1 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            sx={{ my: 1 }}
          />
          {/* <Button type="submit" variant="contained" fullWidth>{editId ? 'Update' : 'Save'}</Button> */}
         <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#1a2526',
                      '&:hover': { backgroundColor: '#2e3b3d' },
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    {editId ? 'Update' : 'Save'}
                  </Button>
        </form>
      </Box>

      {/* Table Section */}
      <Box sx={{ width: '70%' }}>
        <Typography variant="h6">Store List</Typography>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2, width: '240px' }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a2526' }}>
                <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff' }}>Code</TableCell>
                <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.map((store, index) => (
                <TableRow key={store._id}>
                  <TableCell>{store.storeName}</TableCell>
                  <TableCell>{store.storeCode}</TableCell>
                  <TableCell>{store.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(store)}><EditIcon color="primary" /></IconButton>
                    <IconButton onClick={() => handleDelete(store._id)}><DeleteIcon color="error" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemStore;
