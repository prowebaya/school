import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, IconButton, CircularProgress, Snackbar, Alert, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { 
  getAllDivisions, 
  createDivision, 
  updateDivision, 
  deleteDivision, 
  clearDivisionError 
} from '../../../redux/divisionRelated/divisionHandle';

const MarkDivision = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { divisionsList, loading, error } = useSelector(state => state.division);
  const adminID = currentUser?._id;

  const [formData, setFormData] = useState({
    name: '',
    percentFrom: '',
    percentUpto: ''
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (adminID) {
      dispatch(getAllDivisions(adminID));
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      dispatch(clearDivisionError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (formData.percentFrom === '' || isNaN(formData.percentFrom)) {
      newErrors.percentFrom = 'From percentage required and must be a number';
    } else if (formData.percentFrom < 0 || formData.percentFrom > 100) {
      newErrors.percentFrom = 'Invalid percentage';
    }
    if (formData.percentUpto === '' || isNaN(formData.percentUpto)) {
      newErrors.percentUpto = 'To percentage required and must be a number';
    } else if (formData.percentUpto < 0 || formData.percentUpto > 100) {
      newErrors.percentUpto = 'Invalid percentage';
    }
    if (
      formData.percentFrom !== '' &&
      formData.percentUpto !== '' &&
      parseFloat(formData.percentFrom) <= parseFloat(formData.percentUpto)
    ) {
      newErrors.range = 'From must be > To';
    }

    // 🔥 Check for duplicate names when adding (not when editing)
    if (!editId && divisionsList.some(div => div.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      newErrors.name = 'Division with this name already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const divisionData = {
      name: formData.name.trim(),
      percentFrom: parseFloat(formData.percentFrom),
      percentUpto: parseFloat(formData.percentUpto),
      adminID
    };

    try {
      if (editId) {
        await dispatch(updateDivision(editId, divisionData));
        setSnackbar({ open: true, message: 'Division updated!', severity: 'success' });
      } else {
        await dispatch(createDivision(divisionData));
        setSnackbar({ open: true, message: 'Division created!', severity: 'success' });
      }
      resetForm();
      // 🔥 Always refresh the division list after create or update
      dispatch(getAllDivisions(adminID));
    } catch (err) {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', percentFrom: '', percentUpto: '' });
    setEditId(null);
    setErrors({});
  };

  const handleEdit = (division) => {
    setFormData({
      name: division.name || '',
      percentFrom: division.percentFrom?.toString() || '',
      percentUpto: division.percentUpto?.toString() || ''
    });
    setEditId(division._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this division?')) {
      try {
        await dispatch(deleteDivision(id, adminID));
        setSnackbar({ open: true, message: 'Division deleted', severity: 'info' });
        if (editId === id) resetForm();
        // 🔥 Always refresh the list after delete
        dispatch(getAllDivisions(adminID));
      } catch (err) {
        setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, p: 3 }}>
      {/* Form Section */}
      <Box sx={{ width: { md: '30%' }, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editId ? 'Edit Division' : 'Add Division'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Division Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            label="From %"
            type="number"
            fullWidth
            value={formData.percentFrom}
            onChange={(e) => setFormData({ ...formData, percentFrom: e.target.value })}
            error={!!errors.percentFrom}
            helperText={errors.percentFrom}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="To %"
            type="number"
            fullWidth
            value={formData.percentUpto}
            onChange={(e) => setFormData({ ...formData, percentUpto: e.target.value })}
            error={!!errors.percentUpto}
            helperText={errors.percentUpto}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            sx={{ mb: 2 }}
          />
          {errors.range && (
            <Typography color="error" sx={{ mb: 2 }}>{errors.range}</Typography>
          )}
          <Button type="submit" variant="contained" disabled={loading} sx={{ mr: 2 }}>
            {loading ? <CircularProgress size={24} /> : editId ? 'Update' : 'Create'}
          </Button>
          {editId && <Button variant="outlined" onClick={resetForm}>Cancel</Button>}
        </form>
      </Box>

      {/* Table Section */}
      <Box sx={{ width: { md: '70%' } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Division List</Typography>
        {loading ? (
          <CircularProgress />
        ) : divisionsList.length === 0 ? (
          <Typography>No divisions found</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>From</TableCell>
                  <TableCell sx={{ color: 'white' }}>To</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {divisionsList.map((division) => (
                  <TableRow key={division._id}>
                    <TableCell>{division.name}</TableCell>
                    <TableCell>{division.percentFrom?.toFixed(2)}%</TableCell>
                    <TableCell>{division.percentUpto?.toFixed(2)}%</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(division)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(division._id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default MarkDivision;
