// src/components/AddItemStocks.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Snackbar, Alert, InputLabel, FormControl, InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import {
  getAllStockItems, createStockItem, updateStockItem, deleteStockItem, clearStockItemError,
} from '../../../redux/itemStockRelated/itemStockHandle';

const AddItemStocks = () => {
  const dispatch = useDispatch();
  const { stockItemsList, loading, error } = useSelector((state) => state.stockItem || {});
  const adminID = useSelector((state) => state.user?.currentUser?._id);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    item: '', category: 'Select', supplier: 'Select', store: 'Select', quantity: '', purchasePrice: '', purchaseDate: '', document: null, description: '',
  });
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const categories = ['Select', 'Chemistry Lab Apparatus', 'Books Stationery', 'Staff Dress', 'Furniture', 'Sports'];
  const suppliers = ['Select', 'Camlin Stationers', 'Jhonson Uniform Dress', 'Jhon smith Supplier', 'David Furniture'];
  const stores = ['Select', 'Chemistry Equipment (Ch201)', 'Science Store (SC2)', 'Uniform Dress Store (UND23)', 'Furniture Store (FS342)', 'Sports Store (sp55)'];

  useEffect(() => {
    if (adminID) {
      dispatch(getAllStockItems(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view stock items', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearStockItemError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewItem((prev) => ({ ...prev, document: e.target.files[0] }));
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add stock items', severity: 'error' });
      return;
    }
    if (
      !newItem.item || newItem.category === 'Select' || newItem.supplier === 'Select' ||
      newItem.store === 'Select' || !newItem.quantity || !newItem.purchasePrice || !newItem.purchaseDate
    ) {
      setSnack({ open: true, message: 'Please fill all required fields', severity: 'warning' });
      return;
    }

    const payload = {
      item: newItem.item,
      category: newItem.category,
      supplier: newItem.supplier,
      store: newItem.store,
      quantity: parseInt(newItem.quantity),
      purchasePrice: parseFloat(newItem.purchasePrice),
      purchaseDate: newItem.purchaseDate,
      document: newItem.document,
      description: newItem.description,
    };

    if (editId) {
      dispatch(updateStockItem({ id: editId, stockItem: payload, adminID }))
        .then(() => {
          setSnack({ open: true, message: 'Stock item updated successfully', severity: 'success' });
          setEditId(null);
          setNewItem({
            item: '', category: 'Select', supplier: 'Select', store: 'Select', quantity: '', purchasePrice: '', purchaseDate: '', document: null, description: '',
          });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to update stock item', severity: 'error' });
        });
    } else {
      dispatch(createStockItem(payload, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Stock item added successfully', severity: 'success' });
          setNewItem({
            item: '', category: 'Select', supplier: 'Select', store: 'Select', quantity: '', purchasePrice: '', purchaseDate: '', document: null, description: '',
          });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to add stock item', severity: 'error' });
        });
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setNewItem({
      item: item.item,
      category: item.category,
      supplier: item.supplier,
      store: item.store,
      quantity: item.quantity.toString(),
      purchasePrice: item.purchasePrice.toString(),
      purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
      document: null,
      description: item.description,
    });
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete stock items', severity: 'error' });
      return;
    }
    if (window.confirm(`Are you sure you want to delete stock item with ID: ${id}?`)) {
      dispatch(deleteStockItem(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Stock item deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete stock item', severity: 'error' });
        });
    }
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing stock items', severity: 'info' });
  };

  const filteredItems = stockItemsList.filter(
    (item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const csvData = filteredItems.map((item) => ({
    Item: item.item,
    Category: item.category,
    Supplier: item.supplier,
    Store: item.store,
    Quantity: item.quantity,
    PurchasePrice: item.purchasePrice,
    PurchaseDate: new Date(item.purchaseDate).toLocaleDateString(),
    Description: item.description,
  }));

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
        Add Item Stock
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1, bgcolor: '#fff', p: 2, borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add/Edit Stock Item
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category *</InputLabel>
            <Select name="category" value={newItem.category} onChange={handleInputChange}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Item *</InputLabel>
            <Select name="item" value={newItem.item} onChange={handleInputChange} disabled={newItem.category === 'Select'}>
              <MenuItem value="">Select</MenuItem>
              {newItem.category !== 'Select' && [
                'Projectors', 'Notebooks', 'Staff Uniform', 'Equipment', 'Table chair', 'Cricket Bat', 'Class Board', 'Paper and Pencils',
              ].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Supplier *</InputLabel>
            <Select name="supplier" value={newItem.supplier} onChange={handleInputChange}>
              {suppliers.map((sup) => (
                <MenuItem key={sup} value={sup}>{sup}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Store *</InputLabel>
            <Select name="store" value={newItem.store} onChange={handleInputChange}>
              {stores.map((sto) => (
                <MenuItem key={sto} value={sto}>{sto}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Quantity *"
            name="quantity"
            type="number"
            value={newItem.quantity}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Purchase Price ($)*"
            name="purchasePrice"
            type="number"
            step="0.01"
            value={newItem.purchasePrice}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Purchase Date *"
            name="purchaseDate"
            type="date"
            value={newItem.purchaseDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Attach Document"
            name="document"
            type="file"
            onChange={handleFileChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={newItem.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {editId ? 'Update' : 'Save'}
          </Button>
        </Box>
        <Box sx={{ flex: 2, bgcolor: '#fff', p: 2, borderRadius: 1, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Item Stock List
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CSVLink
                data={csvData}
                filename="stock-items.csv"
                style={{ textDecoration: 'none' }}
                onClick={() => setSnack({ open: true, message: 'Exporting stock items as CSV', severity: 'info' })}
              >
                <IconButton sx={{ color: '#666' }} title="Export">
                  <DownloadIcon />
                </IconButton>
              </CSVLink>
              <IconButton sx={{ color: '#666' }} onClick={handlePrint} title="Print">
                <PrintIcon />
              </IconButton>
            </Box>
          </Box>
          <TextField
            fullWidth
            label="Search items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#1a2526' }}>
                  {['Item', 'Category', 'Supplier', 'Store', 'Quantity', 'Purchase Date', 'Price ($)', 'Action'].map((header) => (
                    <TableCell key={header} sx={{ color: '#fff', fontWeight: 600 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{item.store}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                      <TableCell>{item.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item)} disabled={loading}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item._id)} disabled={loading}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography sx={{ mt: 2 }}>
            Records: {filteredItems.length} of {stockItemsList.length}
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddItemStocks;