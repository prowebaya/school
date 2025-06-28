import React, { useEffect, useState } from 'react';
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
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
  clearSectionError
} from '../../../redux/sectionRelated/sectionHandle.js';

const Sections = () => {
  const [sectionName, setSectionName] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const sectionState = useSelector((state) => state.sections || { sectionsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { sectionsList, loading, error } = sectionState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllSections(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view sections', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearSectionError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit sections', severity: 'error' });
      return;
    }
    if (!sectionName.trim()) return;

    const payload = { name: sectionName.trim() };

    const duplicate = sectionsList?.some(
      (sec) =>
        sec.name.toLowerCase() === sectionName.trim().toLowerCase() &&
        sec._id !== editId
    );

    if (duplicate) {
      setSnack({ open: true, message: 'Section already exists!', severity: 'warning' });
      return;
    }

    const action = editId ? updateSection({ id: editId, section: payload, adminID }) : createSection(payload, adminID);

    dispatch(action)
      .then(() => {
        resetForm();
        dispatch(getAllSections(adminID));
        setSnack({
          open: true,
          message: editId ? 'Section updated successfully' : 'Section created successfully',
          severity: 'success',
        });
        setEditId(null);
      })
      .catch(() => {
        setSnack({
          open: true,
          message: editId ? 'Update failed' : 'Creation failed',
          severity: 'error',
        });
      });
  };

  const resetForm = () => {
    setSectionName('');
  };

  const handleEdit = (sec) => {
    setEditId(sec._id);
    setSectionName(sec.name);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete sections', severity: 'error' });
      return;
    }
    dispatch(deleteSection(id, adminID))
      .then(() => {
        dispatch(getAllSections(adminID));
        setSnack({ open: true, message: 'Section deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Delete failed', severity: 'error' });
      });
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const filteredSections = (sectionsList || []).filter((sec) =>
    sec.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Form */}
      <Box sx={{ width: '30%', p: 3, borderRadius: 2, bgcolor: '#fff', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {editId ? 'Edit Section' : 'Add Section'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Section Name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {editId ? 'Update' : 'Save'}
          </Button>
        </form>
      </Box>

      {/* Table */}
      <Box sx={{ width: '70%' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Section List
        </Typography>
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
          sx={{ mb: 2, width: 240 }}
        />
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1a2526' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Section Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSections.map((sec, idx) => (
                    <TableRow key={sec._id} sx={{ bgcolor: idx % 2 ? '#fff' : '#f5f5f5' }}>
                      <TableCell>{sec.name}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(sec)} sx={{ color: '#1976d2' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(sec._id)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography sx={{ mt: 2 }}>Records: {filteredSections.length}</Typography>
          </>
        )}
      </Box>

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

export default Sections;