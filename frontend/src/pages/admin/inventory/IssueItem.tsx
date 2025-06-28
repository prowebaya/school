// src/components/IssueItemList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Modal, InputLabel, FormControl,
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import {
  getAllIssueItems, createIssueItem, updateIssueItem, deleteIssueItem, clearIssueItemError,
} from '../../../redux/IssueItemStock/IssueItemAction';

const IssueItemList = () => {
  const dispatch = useDispatch();
  const { issueItemsList, loading, error } = useSelector((state) => state.issueItem || {});
  const adminID = useSelector((state) => state.user?.currentUser?._id);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item: '', category: 'Select', issueDate: '', issueTo: '', issuedBy: '', quantity: '', status: 'Issued',
  });

  const categories = ['Select', 'Chemistry Lab Apparatus', 'Books Stationery', 'Staff Dress', 'Furniture', 'Sports'];
  const people = ['Select', 'Maria Ford (9005)', 'Jason Charlton (9006)', 'Brandon Heart (9006)', 'William Abbot (9003)', 'James Deckard (9004)'];

  useEffect(() => {
    if (adminID) {
      dispatch(getAllIssueItems(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view issue items', severity: 'error' });
    }
  }, [dispatch, adminID]);

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearIssueItemError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleIssueItem = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add issue items', severity: 'error' });
      return;
    }
    if (
      !newItem.item || newItem.category === 'Select' || !newItem.issueDate ||
      newItem.issueTo === 'Select' || newItem.issuedBy === 'Select' || !newItem.quantity
    ) {
      setSnack({ open: true, message: 'Please fill all required fields', severity: 'warning' });
      return;
    }

    const payload = {
      item: newItem.item,
      category: newItem.category,
      issueDate: newItem.issueDate,
      issueTo: newItem.issueTo,
      issuedBy: newItem.issuedBy,
      quantity: parseInt(newItem.quantity),
      status: newItem.status,
    };

    dispatch(createIssueItem(payload, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Issue item added successfully', severity: 'success' });
        setNewItem({
          item: '', category: 'Select', issueDate: '', issueTo: 'Select', issuedBy: 'Select', quantity: '', status: 'Issued',
        });
        setOpenModal(false);
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add issue item', severity: 'error' });
      });
  };

  const handleReturnItem = (item) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update issue items', severity: 'error' });
      return;
    }
    dispatch(updateIssueItem({ id: item._id, issueItem: { ...item, status: 'Returned' }, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Item marked as returned', severity: 'success' });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to update issue item', severity: 'error' });
      });
  };

  const handleDeleteItem = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete issue items', severity: 'error' });
      return;
    }
    if (window.confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
      dispatch(deleteIssueItem(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Issue item deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete issue item', severity: 'error' });
        });
    }
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing issue items', severity: 'info' });
  };

  const filteredItems = issueItemsList.filter(
    (item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const csvData = filteredItems.map((item) => ({
    Item: item.item,
    Category: item.category,
    IssueDate: new Date(item.issueDate).toLocaleDateString(),
    IssueTo: item.issueTo,
    IssuedBy: item.issuedBy,
    Quantity: item.quantity,
    Status: item.status,
  }));

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Issue Item List
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenModal(true)}
          sx={{ fontSize: 14 }}
        >
          Issue Item
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <CSVLink
            data={csvData}
            filename="issue-items.csv"
            style={{ textDecoration: 'none' }}
            onClick={() => setSnack({ open: true, message: 'Exporting issue items as CSV', severity: 'info' })}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a2526' }}>
              {['Item', 'Note', 'Category', 'Issue Date', 'Issue To', 'Issued By', 'Quantity', 'Status', 'Action'].map((header) => (
                <TableCell key={header} sx={{ color: '#fff', fontWeight: 600 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{item.issueTo}</TableCell>
                  <TableCell>{item.issuedBy}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        color: item.status === 'Returned' ? '#388e3c' : '#d32f2f',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.status === 'Issued' && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReturnItem(item)}
                        sx={{ mr: 1 }}
                      >
                        Return
                      </Button>
                    )}
                    <IconButton onClick={() => handleDeleteItem(item._id)} disabled={loading}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            width: { xs: '90%', sm: 400 },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Issue New Item
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category *</InputLabel>
            <Select name="category" value={newItem.category} onChange={handleInputChange}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Item *"
            name="item"
            value={newItem.item}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Issue Date *"
            name="issueDate"
            type="date"
            value={newItem.issueDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Issue To *</InputLabel>
            <Select name="issueTo" value={newItem.issueTo} onChange={handleInputChange}>
              {people.map((person) => (
                <MenuItem key={person} value={person}>{person}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Issued By *</InputLabel>
            <Select name="issuedBy" value={newItem.issuedBy} onChange={handleInputChange}>
              {people.map((person) => (
                <MenuItem key={person} value={person}>{person}</MenuItem>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleIssueItem}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IssueItemList;