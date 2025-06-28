import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllExpenses, createExpense, updateExpense, deleteExpense, clearExpenseError
} from '../../../redux/expenseRelated/expenseHandle';
import { getAllExpenseHeads } from '../../../redux/expenseRelated/expenseHeadHandle';

const AddExpenses = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    expenseHead: '',
    name: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    attachedFile: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const expenseState = useSelector((state) => state.expense || { expensesList: [], loading: false, error: null });
  const expenseHeadState = useSelector((state) => state.expenseHead || { expenseHeadsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { expensesList, loading, error } = expenseState;
  const { expenseHeadsList } = expenseHeadState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExpenses(adminID));
      dispatch(getAllExpenseHeads(adminID)); // Fetch expense heads for dropdown
    } else {
      setSnack({ open: true, message: 'Please log in to view expenses', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExpenseError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, attachedFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit expenses', severity: 'error' });
      return;
    }
    if (!formData.expenseHead || !formData.name || !formData.date || !formData.amount) {
      setSnack({ open: true, message: 'All required fields are required', severity: 'warning' });
      return;
    }

    const action = editingId
      ? updateExpense({ id: editingId, expense: formData, adminID })
      : createExpense(formData, adminID);

    dispatch(action)
      .then(() => {
        resetForm();
        setSnack({
          open: true,
          message: editingId ? 'Expense updated successfully' : 'Expense created successfully',
          severity: 'success',
        });
        setEditingId(null);
      })
      .catch((error) => {
        setSnack({
          open: true,
          message: error.message || (editingId ? 'Update failed' : 'Creation failed'),
          severity: 'error',
        });
      });
  };

  const resetForm = () => {
    setFormData({
      expenseHead: '',
      name: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      description: '',
      attachedFile: null,
    });
    setShowForm(false);
  };

  const handleEdit = (expense) => {
    setFormData({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0], // Format date for input
      attachedFile: expense.attachedFile || null, // Keep existing file path or null
    });
    setEditingId(expense._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete expenses', severity: 'error' });
      return;
    }
    dispatch(deleteExpense(id, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Expense deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Delete failed', severity: 'error' });
      });
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const filteredExpenses = expensesList.filter((expense) =>
    Object.values(expense).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
        Expense Management
      </Typography>

      <Grid container spacing={3}>
        {/* Search Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Search Expenses
              </Typography>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Table and Add Button */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Expense List
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setShowForm(true)}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  + Add Expense
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      {['Name', 'Description', 'Invoice Number', 'Date', 'Expense Head', 'Amount (₹)', 'Actions'].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            p: { xs: 1, md: 2 },
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                          No expenses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((expense, idx) => (
                        <TableRow
                          key={expense._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.name}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.description}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.invoiceNumber}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{expense.expenseHead}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>₹{expense.amount.toFixed(2)}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton onClick={() => handleEdit(expense)} sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(expense._id)} sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}>
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
                Records: {filteredExpenses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Form Modal */}
      {showForm && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            p: { xs: 2, md: 4 },
            width: { xs: '90%', sm: 500 },
            maxWidth: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            borderRadius: 2,
            zIndex: 1300,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
            {editingId ? 'Edit Expense' : 'Add Expense'}
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormControl fullWidth>
              <InputLabel>Expense Head</InputLabel>
              <Select
                name="expenseHead"
                value={formData.expenseHead}
                onChange={handleChange}
                required
                label="Expense Head"
                size="small"
              >
                <MenuItem value="">Select</MenuItem>
                {expenseHeadsList
                  .filter((head) => head.active)
                  .map((head) => (
                    <MenuItem key={head._id} value={head.name}>{head.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Invoice Number"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Amount (₹)"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              size="small"
            />
            <Box sx={{ border: '2px dashed #1976d2', p: 2, textAlign: 'center', borderRadius: 1 }}>
              <input
                type="file"
                id="fileUpload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                <AttachFileIcon /> {formData.attachedFile?.name || formData.attachedFile || 'Drag and drop a file here or click'}
              </label>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowForm(false)}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddExpenses;