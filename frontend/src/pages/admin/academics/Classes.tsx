import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, FormControlLabel, Checkbox, Button,
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
  getAllFclasses,
  createFclass,
  updateFclass,
  deleteFclass,
  clearFclassError
} from '../../../redux/fclass/fclassHandle.js';
import {
  getAllSections,
  clearSectionError
} from '../../../redux/sectionRelated/sectionHandle.js';

const Classes = () => {
  const [className, setClassName] = useState('');
  const [sections, setSections] = useState({});
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const fclassState = useSelector((state) => state.fclass || { fclassesList: [], loading: false, error: null });
  const sectionState = useSelector((state) => state.sections || { sectionsList: [], error: null });
  const userState = useSelector((state) => state.user || {});
  const { fclassesList, loading, error: fclassError } = fclassState;
  const { sectionsList, error: sectionError } = sectionState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllFclasses(adminID));
      dispatch(getAllSections(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view classes', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (sectionsList?.length) {
      const defaultState = {};
      sectionsList.forEach((s) => (defaultState[s.name] = false));
      setSections(defaultState);
    }
  }, [sectionsList]);

  useEffect(() => {
    if (fclassError || sectionError) {
      setSnack({ open: true, message: fclassError || sectionError, severity: 'error' });
      if (fclassError) dispatch(clearFclassError());
      if (sectionError) dispatch(clearSectionError());
    }
  }, [fclassError, sectionError, dispatch]);

  const handleSectionChange = (name) => {
    setSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit classes', severity: 'error' });
      return;
    }
    if (!className.trim()) {
      setSnack({ open: true, message: 'Class name is required', severity: 'warning' });
      return;
    }

    const selectedSections = Object.keys(sections).filter((s) => sections[s]);
    const payload = { name: className.trim(), sections: selectedSections, adminID };

    const duplicate = fclassesList?.some(
      (cls) =>
        cls.name.toLowerCase() === className.trim().toLowerCase() &&
        cls._id !== editId
    );

    if (duplicate) {
      setSnack({ open: true, message: 'Class already exists!', severity: 'warning' });
      return;
    }

    const action = editId ? updateFclass({ id: editId, fclass: payload, adminID }) : createFclass(payload, adminID);

    dispatch(action)
      .then(() => {
        resetForm();
        dispatch(getAllFclasses(adminID));
        setSnack({
          open: true,
          message: editId ? 'Class updated successfully' : 'Class created successfully',
          severity: 'success',
        });
        setEditId(null);
      })
      .catch((error) => {
        setSnack({
          open: true,
          message: error.message || (editId ? 'Update failed' : 'Creation failed'),
          severity: 'error',
        });
      });
  };

  const resetForm = () => {
    setClassName('');
    const resetSections = {};
    sectionsList.forEach((s) => (resetSections[s.name] = false));
    setSections(resetSections);
  };

  const handleEdit = (cls) => {
    setEditId(cls._id);
    setClassName(cls.name);
    const updatedSections = {};
    sectionsList.forEach((s) => {
      updatedSections[s.name] = cls.sections.includes(s.name);
    });
    setSections(updatedSections);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete classes', severity: 'error' });
      return;
    }
    dispatch(deleteFclass(id, adminID))
      .then(() => {
        dispatch(getAllFclasses(adminID));
        setSnack({ open: true, message: 'Class deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Delete failed', severity: 'error' });
      });
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const filteredClasses = (fclassesList || []).filter((cls) =>
    cls.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.sections?.some((sec) => sec?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Form */}
      <Box sx={{ width: '30%', p: 3, borderRadius: 2, bgcolor: '#fff', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {editId ? 'Edit Class' : 'Add Class'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Assign Sections
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {sectionsList.length === 0 ? (
              <Typography>No sections available</Typography>
            ) : (
              sectionsList.map((s) => (
                <FormControlLabel
                  key={s._id}
                  control={
                    <Checkbox
                      checked={sections[s.name] || false}
                      onChange={() => handleSectionChange(s.name)}
                    />
                  }
                  label={s.name}
                />
              ))
            )}
          </Box>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {editId ? 'Update' : 'Save'}
          </Button>
        </form>
      </Box>

      {/* Table */}
      <Box sx={{ width: '70%' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Class List
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
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Class Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Sections</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClasses.map((cls, idx) => (
                    <TableRow key={cls._id} sx={{ bgcolor: idx % 2 ? '#fff' : '#f5f5f5' }}>
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>{cls.sections.join(', ')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(cls)} sx={{ color: '#1976d2' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(cls._id)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography sx={{ mt: 2 }}>Records: {filteredClasses.length}</Typography>
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

export default Classes;