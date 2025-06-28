import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getAllExamGroups,
  createExamGroup,
  updateExamGroup,
  deleteExamGroup,
  clearExamGroupError,
} from '../../../redux/examRelated/exam-group-actions';

const examTypes = [
  'General Purpose (Pass/Fail)',
  'School Based Grading System',
  'College Based Grading System',
  'GPA Grading System',
  'Average Passing',
];

const GroupExam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const examGroupState = useSelector((state) => state.examGroup || { examGroupsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { examGroupsList, loading, error } = examGroupState;
  const adminID = userState.currentUser?._id;

  const [formData, setFormData] = useState({ name: '', type: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExamGroups(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view exam groups', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExamGroupError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to manage exam groups', severity: 'error' });
      return;
    }
    if (!formData.name || !formData.type) {
      setSnack({ open: true, message: 'Name and type are required', severity: 'warning' });
      return;
    }
    if (isEditing) {
      dispatch(updateExamGroup({ id: editId, examGroup: formData, adminID }))
        .then(() => {
          setSnack({ open: true, message: 'Exam group updated successfully', severity: 'success' });
          setFormData({ name: '', type: '', description: '' });
          setIsEditing(false);
          setEditId(null);
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to update exam group', severity: 'error' });
        });
    } else {
      dispatch(createExamGroup(formData, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Exam group added successfully', severity: 'success' });
          setFormData({ name: '', type: '', description: '' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to add exam group', severity: 'error' });
        });
    }
  };

  const handleEdit = (group) => {
    setFormData({ name: group.name, type: group.type, description: group.description });
    setIsEditing(true);
    setEditId(group._id);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete exam groups', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this exam group?')) {
      dispatch(deleteExamGroup(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Exam group deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete exam group', severity: 'error' });
        });
    }
  };

  const handleNavigateToAddExam = () => {
    navigate('/add-exam');
  };

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
        Exam Group Management
      </Typography>

      <Grid container spacing={3}>
        {/* Add/Edit Exam Group Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#d3e0ff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526', mb: 2 }}>
                {isEditing ? 'Edit Exam Group' : 'Add Exam Group'}
              </Typography>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                required
              />
              <FormControl fullWidth sx={{ mb: 2 }} size="small">
                <InputLabel>Exam Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Exam Type"
                  required
                >
                  <MenuItem value="">Select</MenuItem>
                  {examTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                size="small"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
                startIcon={<AddIcon />}
              >
                {isEditing ? 'Update' : 'Add'} Exam Group
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Exam Group List Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Exam Group List
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNavigateToAddExam}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                  startIcon={<AddIcon />}
                >
                  Add Examination Name
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        No. of Exams
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Exam Type
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : examGroupsList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No exam groups found
                        </TableCell>
                      </TableRow>
                    ) : (
                      examGroupsList.map((group, idx) => (
                        <TableRow
                          key={group._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.exams}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.type}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {group.description}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton
                              onClick={() => handleEdit(group)}
                              sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(group._id)}
                              sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}
                              title="Delete"
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
                Records: {examGroupsList.length} of {examGroupsList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default GroupExam;