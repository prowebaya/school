import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, InputAdornment, Snackbar, Alert, Radio, RadioGroup, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllSubjectives,
  createSubjective,
  updateSubjective,
  deleteSubjective,
  clearSubjectiveError
} from '../../../redux/subjective/subjectiveHandle';

const SubjectiveList = () => {
  const [subjectiveName, setSubjectiveName] = useState('');
  const [subjectiveType, setSubjectiveType] = useState('Theory');
  const [subjectiveCode, setSubjectiveCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const dispatch = useDispatch();
  const { subjectivesList, loading, error } = useSelector((state) => state.subjective || {});
  const userState = useSelector((state) => state.user || {});
  const adminID = userState.currentUser?._id;

  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (adminID) {
      dispatch(getAllSubjectives(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view subjectives', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearSubjectiveError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add/update subjectives', severity: 'error' });
      return;
    }
    if (!subjectiveName.trim() || !subjectiveCode.trim()) {
      setSnack({ open: true, message: 'Name and code are required', severity: 'warning' });
      return;
    }

    const payload = { 
      name: subjectiveName.trim(), 
      code: subjectiveCode.trim(),
      type: subjectiveType
    };

    const exists = Array.isArray(subjectivesList) && subjectivesList.some(
      (sub) => sub.code.toLowerCase() === subjectiveCode.trim().toLowerCase() && 
              (!editId || sub._id !== editId)
    );

    if (exists) {
      setSnack({ open: true, message: 'Subjective with this code already exists!', severity: 'warning' });
      return;
    }

    setIsPopupOpen(true);
  };

  const handleConfirmSubmit = () => {
    const payload = { 
      name: subjectiveName.trim(), 
      code: subjectiveCode.trim(),
      type: subjectiveType
    };

    if (editId) {
      dispatch(updateSubjective({ id: editId, subjective: payload, adminID }))
        .then(() => {
          setEditId(null);
          resetForm();
          dispatch(getAllSubjectives(adminID));
          setSnack({ open: true, message: 'Subjective updated successfully', severity: 'success' });
          setIsPopupOpen(false);
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to update subjective', severity: 'error' });
          setIsPopupOpen(false);
        });
    } else {
      dispatch(createSubjective(payload, adminID))
        .then(() => {
          resetForm();
          dispatch(getAllSubjectives(adminID));
          setSnack({ open: true, message: 'Subjective created successfully', severity: 'success' });
          setIsPopupOpen(false);
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to add subjective', severity: 'error' });
          setIsPopupOpen(false);
        });
    }
  };

  const resetForm = () => {
    setSubjectiveName('');
    setSubjectiveCode('');
    setSubjectiveType('Theory');
  };

  const handleEdit = (subjective) => {
    setEditId(subjective._id);
    setSubjectiveName(subjective.name);
    setSubjectiveCode(subjective.code);
    setSubjectiveType(subjective.type);
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete subjectives', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this subjective?')) {
      dispatch(deleteSubjective(id, adminID))
        .then(() => {
          dispatch(getAllSubjectives(adminID));
          setSnack({ open: true, message: 'Subjective deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete subjective', severity: 'error' });
        });
    }
  };

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    resetForm();
  };

  const filteredSubjectives = Array.isArray(subjectivesList)
    ? subjectivesList.filter((subjective) =>
        subjective?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subjective?.code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Box sx={{
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#333' }}>
          {editId ? 'Edit Subjective' : 'Add Subjective'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Subjective Name"
            value={subjectiveName}
            onChange={(e) => setSubjectiveName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Subjective Code"
            value={subjectiveCode}
            onChange={(e) => setSubjectiveCode(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <RadioGroup
            row
            value={subjectiveType}
            onChange={(e) => setSubjectiveType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="Theory" control={<Radio />} label="Theory" />
            <FormControlLabel value="Practical" control={<Radio />} label="Practical" />
          </RadioGroup>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !adminID}
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#333' }}>Subjective List</Typography>
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
          sx={{ mb: 2, width: '240px', bgcolor: '#fff', borderRadius: '8px' }}
        />

        {loading ? (
          <Typography sx={{ color: '#555' }}>Loading...</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ boxShadow: '0 3px 10px rgba(0,0,0,0.06)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1a2526' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Subjective Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubjectives.map((subjective, index) => (
                    <TableRow
                      key={subjective._id}
                      sx={{
                        bgcolor: index % 2 === 0 ? '#f5f5f5' : '#fff',
                        '&:hover': { backgroundColor: '#eef5f5' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{subjective.name}</TableCell>
                      <TableCell>{subjective.code}</TableCell>
                      <TableCell>{subjective.type}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(subjective)} sx={{ color: '#1976d2' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(subjective._id)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography sx={{ mt: 2, color: '#555' }}>
              Records: {filteredSubjectives.length} of {subjectivesList?.length || 0}
            </Typography>
          </>
        )}
      </Box>

      {/* Dialog for Form Submission */}
      <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Confirm Update Subjective' : 'Confirm Add Subjective'}</DialogTitle>
        <DialogContent>
          <Typography>
            {editId ? 'Are you sure you want to update this subjective?' : 'Are you sure you want to add this subjective?'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Name: {subjectiveName}<br />
            Code: {subjectiveCode}<br />
            Type: {subjectiveType}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="error">Cancel</Button>
          <Button onClick={handleConfirmSubmit} color="success">
            {editId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
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

export default SubjectiveList;