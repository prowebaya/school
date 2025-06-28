// src/pages/admin/inventory/ItemList.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Autocomplete, Button
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import {
  getAllCategoryCards,
} from '../../../redux/categoryRelated/categoryHandle';
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  clearItemError,
} from '../../../redux/itemRelated/itemHandle';

interface Item {
  _id: string;
  item: string;
  description: string;
  category: string;
  unit: string;
  availableQuantity: number;
}

interface RootState {
  item: {
    itemsList: Item[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
  categoryCard: {
    categoryCardsList: any[];
    categoryCardDetails: any;
    loading: boolean;
    error: string | null;
    response: any;
  };
}

const ItemList: React.FC = () => {
  const dispatch = useDispatch();
  const { itemsList, loading, error } = useSelector((state: RootState) => state.item || { itemsList: [], loading: false, error: null });
  const { categoryCardsList = [], loading: categoryLoading } = useSelector((state: RootState) => state.categoryCard || { categoryCardsList: [], loading: false });
  const adminID = useSelector((state: RootState) => state.user?.currentUser?._id);
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<Item, '_id'>>({
    item: '',
    description: '',
    category: '',
    unit: '',
    availableQuantity: 0,
  });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [hasFetched, setHasFetched] = useState(false); // Prevent redundant API calls

  const units = ['Piece', 'Set', 'Box'];

  useEffect(() => {
    console.log('adminID:', adminID);
    console.log('categoryCardsList:', categoryCardsList);
    console.log('categoryLoading:', categoryLoading);
    if (adminID && !hasFetched) {
      dispatch(getAllCategoryCards(adminID));
      dispatch(getAllItems(adminID));
      setHasFetched(true);
    } else if (!adminID) {
      setSnack({ open: true, message: 'Please log in to view items', severity: 'error' });
    }
  }, [dispatch, adminID, hasFetched]);

  useEffect(() => {
    console.log('itemsList updated:', itemsList);
    if (Array.isArray(itemsList)) {
      setItems(itemsList);
    } else {
      console.warn('itemsList is not an array:', itemsList);
      setItems([]);
    }
  }, [itemsList]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearItemError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: name === 'availableQuantity' ? parseInt(value) || 0 : value }));
  };

  const handleAdd = () => {
    setNewItem({ item: '', description: '', category: '', unit: '', availableQuantity: 0 });
    setEditId(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (item: Item) => {
    if (!Array.isArray(items)) {
      setSnack({ open: true, message: 'Items data not loaded yet. Please try again.', severity: 'error' });
      return;
    }
    setEditId(item._id);
    setNewItem({ item: item.item, description: item.description, category: item.category, unit: item.unit, availableQuantity: item.availableQuantity });
    setIsPopupOpen(true);
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add items', severity: 'error' });
      return;
    }
    if (!newItem.item || !newItem.category || !newItem.unit || newItem.availableQuantity === 0) {
      setSnack({ open: true, message: 'Item, category, unit, and available quantity are required', severity: 'warning' });
      return;
    }
    dispatch(createItem(newItem, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Item added successfully', severity: 'success' });
        setIsPopupOpen(false);
        setNewItem({ item: '', description: '', category: '', unit: '', availableQuantity: 0 });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add item', severity: 'error' });
      });
  };

  const handleSaveEdit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update items', severity: 'error' });
      return;
    }
    if (!newItem.item || !newItem.category || !newItem.unit || newItem.availableQuantity === 0) {
      setSnack({ open: true, message: 'Item, category, unit, and available quantity are required', severity: 'warning' });
      return;
    }
    dispatch(updateItem(editId!, newItem, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Item updated successfully', severity: 'success' });
        setIsPopupOpen(false);
        setEditId(null);
        setNewItem({ item: '', description: '', category: '', unit: '', availableQuantity: 0 });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to update item', severity: 'error' });
      });
  };

  const handleDelete = (id: string) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete items', severity: 'error' });
      return;
    }
    if (window.confirm(`Delete item ${id}?`)) {
      dispatch(deleteItem(id, adminID))
        .then(() => {
          setSnack({ open: true, message: `Item ${id} deleted successfully`, severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete item', severity: 'error' });
        });
    }
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing items', severity: 'info' });
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting items as CSV', severity: 'info' });
  };

  const filteredItems = items.filter((item) =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const csvData = filteredItems.map((item) => ({
    Item: item.item,
    Description: item.description,
    Category: item.category,
    Unit: item.unit,
    AvailableQuantity: item.availableQuantity,
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#1a2526',
          mb: 4,
          fontSize: { xs: '1.5rem', md: '2.125rem' },
        }}
      >
        Item Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Item List
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CSVLink
                    data={csvData}
                    filename="items.csv"
                    style={{ textDecoration: 'none' }}
                    onClick={handleExport}
                  >
                    <IconButton sx={{ color: '#666' }} title="Export">
                      <DownloadIcon />
                    </IconButton>
                  </CSVLink>
                  <IconButton sx={{ color: '#666' }} onClick={handlePrint} title="Print">
                    <PrintIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAdd}
                    sx={{ borderRadius: '20px', textTransform: 'none' }}
                    disabled={loading || categoryLoading}
                  >
                    + Add
                  </Button>
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Search items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      {['Item', 'Description', 'Category', 'Unit', 'Available Quantity', 'Action'].map((header) => (
                        <TableCell
                          key={header}
                          sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item, idx) => (
                        <TableRow
                          key={item._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.item}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.description}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.category}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.unit}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.availableQuantity}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton
                              onClick={() => handleEdit(item)}
                              sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                              title="Edit"
                              disabled={loading || categoryLoading}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(item._id)}
                              sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}
                              title="Delete"
                              disabled={loading}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Records: {filteredItems.length} of {itemsList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Item"
            name="item"
            value={newItem.item}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <Autocomplete
            options={Array.isArray(categoryCardsList) ? categoryCardsList : []}
            getOptionLabel={(option: any) => option.categoryCard || ''}
            inputValue={categoryInput}
            onInputChange={(_, newInputValue) => setCategoryInput(newInputValue)}
            value={Array.isArray(categoryCardsList) ? categoryCardsList.find((cat: any) => cat.categoryCard === newItem.category) || null : null}
            onChange={(_, newValue) => setNewItem((prev) => ({ ...prev, category: newValue ? newValue.categoryCard : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                required
                InputProps={{ ...params.InputProps, style: { fontSize: 14 } }}
              />
            )}
            disabled={categoryLoading}
          />
          <Autocomplete
            options={units}
            value={newItem.unit || null}
            onChange={(_, newValue) => setNewItem((prev) => ({ ...prev, unit: newValue || '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Unit"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                required
              />
            )}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Available Quantity"
            name="availableQuantity"
            type="number"
            value={newItem.availableQuantity}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPopupOpen(false)} color="error">Cancel</Button>
          <Button onClick={editId ? handleSaveEdit : handleSave} color="success" disabled={categoryLoading}>
            {editId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>

      <style>{`
        .item-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
          min-height: 100vh;
          width: 100%;
          background-color: #f4f6f8;
          overflow-x: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }
      `}</style>
    </Box>
  );
};

export default ItemList;