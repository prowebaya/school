import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent,
  InputAdornment, TextField, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVehicles } from '../../../redux/TransportRelated/vehicleAction';
import { getAllTransportRoutes } from '../../../redux/TransportRelated/routeHandle';
import { getAllAssignments, createAssignment, updateAssignment, deleteAssignment, clearAssignmentError } from '../../../redux/TransportRelated/AssignmentAction';
import { CSVLink } from 'react-csv';

const AssignVehicle = () => {
  const [formData, setFormData] = useState({ route: '', vehicle: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const vehicleState = useSelector((state) => state.vehicle || { vehiclesList: [], loading: false, error: null });
  const transportRouteState = useSelector((state) => state.transportRoute || { transportRoutesList: [], loading: false, error: null });
  const assignmentState = useSelector((state) => state.assignment || { assignmentsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { vehiclesList, loading: vehicleLoading } = vehicleState;
  const { transportRoutesList, loading: routeLoading } = transportRouteState;
  const { assignmentsList, loading: assignmentLoading, error } = assignmentState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllVehicles(adminID));
      dispatch(getAllTransportRoutes(adminID));
      dispatch(getAllAssignments(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view assignments', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearAssignmentError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to create assignments', severity: 'error' });
      return;
    }
    if (!formData.route || !formData.vehicle) {
      setSnack({ open: true, message: 'Route and vehicle are required', severity: 'warning' });
      return;
    }
    dispatch(createAssignment(formData, adminID))
      .then(() => {
        setFormData({ route: '', vehicle: '' });
        setSnack({ open: true, message: 'Assignment created successfully', severity: 'success' });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to create assignment', severity: 'error' });
      });
  };

  const handleEdit = (assignment) => {
    setEditId(assignment._id);
    setFormData({ route: assignment.routeId, vehicle: assignment.vehicleId });
  };

  const handleSaveEdit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update assignments', severity: 'error' });
      return;
    }
    if (!formData.route || !formData.vehicle) {
      setSnack({ open: true, message: 'Route and vehicle are required', severity: 'warning' });
      return;
    }
    dispatch(updateAssignment({ id: editId, assignment: formData, adminID }))
      .then(() => {
        setEditId(null);
        setFormData({ route: '', vehicle: '' });
        setSnack({ open: true, message: 'Assignment updated successfully', severity: 'success' });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to update assignment', severity: 'error' });
      });
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete assignments', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      dispatch(deleteAssignment(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Assignment deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete assignment', severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting assignments as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing assignments', severity: 'info' });
  };

  const filteredAssignments = assignmentsList.filter((assignment) =>
    assignment.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.vehicle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const csvData = filteredAssignments.map((assignment) => ({
    Route: assignment.route,
    Vehicle: assignment.vehicle,
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
        Vehicle Assignment Management
      </Typography>

      <Grid container spacing={3}>
        {/* Assignment Form */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                {editId ? 'Edit Assignment' : 'Create Assignment'}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                <InputLabel>Route</InputLabel>
                <Select
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  label="Route"
                  size="small"
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {transportRoutesList.map((route) => (
                    <MenuItem key={route._id} value={route._id}>{route.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1a2526' }}>
                  Vehicle
                </Typography>
                <RadioGroup name="vehicle" value={formData.vehicle} onChange={handleChange}>
                  {vehiclesList.map((vehicle) => (
                    <FormControlLabel
                      key={vehicle._id}
                      value={vehicle._id}
                      control={<Radio size="small" />}
                      label={vehicle.number}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <Button
                variant="contained"
                color="success"
                onClick={editId ? handleSaveEdit : handleSave}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
                fullWidth
              >
                {editId ? 'Update' : 'Save'}
              </Button>
              {editId && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setEditId(null);
                    setFormData({ route: '', vehicle: '' });
                  }}
                  sx={{ mt: 1, borderRadius: '20px', textTransform: 'none' }}
                  fullWidth
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Assignment List */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Assignment List
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CSVLink
                    data={csvData}
                    filename="vehicle-assignments.csv"
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
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Search assignments"
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
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Route
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Vehicle
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignmentLoading || vehicleLoading || routeLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredAssignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No assignments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssignments.map((assignment, idx) => (
                        <TableRow
                          key={assignment._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {assignment.route}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {assignment.vehicle}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton
                              onClick={() => handleEdit({ ...assignment, routeId: assignment.routeId, vehicleId: assignment.vehicleId })}
                              sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(assignment._id)}
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
                Records: {filteredAssignments.length} of {assignmentsList.length}
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

export default AssignVehicle;