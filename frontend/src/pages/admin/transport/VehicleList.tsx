import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, InputAdornment, Snackbar, Alert,
} from '@mui/material';
import {
  Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllVehicles, createVehicle, updateVehicle, deleteVehicle, clearVehicleError,
} from '../../../redux/TransportRelated/vehicleAction';

const VehicleList = () => {
  const [vehicle, setVehicle] = useState({
    number: '', model: '', year: '', regNumber: '', chassis: '', capacity: '', driver: '', license: '', contact: '',
  });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const vehicleState = useSelector((state) => state.vehicle || { vehiclesList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { vehiclesList, loading, error } = vehicleState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllVehicles(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view vehicles', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearVehicleError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit vehicles', severity: 'error' });
      return;
    }
    if (!vehicle.number || !vehicle.model || !vehicle.year || !vehicle.regNumber || !vehicle.chassis ||
        !vehicle.capacity || !vehicle.driver || !vehicle.license || !vehicle.contact) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }

    const duplicate = vehiclesList?.some(
      (v) => (v.number.toLowerCase() === vehicle.number.toLowerCase() || v.regNumber.toLowerCase() === vehicle.regNumber.toLowerCase() || v.chassis.toLowerCase() === vehicle.chassis.toLowerCase()) && v._id !== editId
    );

    if (duplicate) {
      setSnack({ open: true, message: 'Vehicle number, registration, or chassis already exists!', severity: 'warning' });
      return;
    }

    const action = editId ? updateVehicle({ id: editId, vehicle, adminID }) : createVehicle(vehicle, adminID);

    dispatch(action)
      .then(() => {
        resetForm();
        dispatch(getAllVehicles(adminID));
        setSnack({
          open: true,
          message: editId ? 'Vehicle updated successfully' : 'Vehicle created successfully',
          severity: 'success',
        });
        setEditId(null);
      })
      .catch((err) => {
        setSnack({
          open: true,
          message: err.message || (editId ? 'Update failed' : 'Creation failed'),
          severity: 'error',
        });
      });
  };

  const resetForm = () => {
    setVehicle({
      number: '', model: '', year: '', regNumber: '', chassis: '', capacity: '', driver: '', license: '', contact: '',
    });
  };

  const handleEdit = (v) => {
    setEditId(v._id);
    setVehicle({
      number: v.number,
      model: v.model,
      year: v.year,
      regNumber: v.regNumber,
      chassis: v.chassis,
      capacity: v.capacity,
      driver: v.driver,
      license: v.license,
      contact: v.contact,
    });
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete vehicles', severity: 'error' });
      return;
    }
    dispatch(deleteVehicle(id, adminID))
      .then(() => {
        dispatch(getAllVehicles(adminID));
        setSnack({ open: true, message: 'Vehicle deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Delete failed', severity: 'error' });
      });
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const filteredVehicles = (vehiclesList || []).filter((v) =>
    v.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Form */}
      <Box sx={{ width: '30%', p: 3, borderRadius: 2, bgcolor: '#fff', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {editId ? 'Edit Vehicle' : 'Add Vehicle'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Vehicle Number"
            name="number"
            value={vehicle.number}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Model"
            name="model"
            value={vehicle.model}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Year"
            name="year"
            type="number"
            value={vehicle.year}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Registration Number"
            name="regNumber"
            value={vehicle.regNumber}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Chassis Number"
            name="chassis"
            value={vehicle.chassis}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Capacity"
            name="capacity"
            type="number"
            value={vehicle.capacity}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Driver Name"
            name="driver"
            value={vehicle.driver}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="License Number"
            name="license"
            value={vehicle.license}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contact Number"
            name="contact"
            value={vehicle.contact}
            onChange={handleInputChange}
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
          Vehicle List
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
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Vehicle #</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Model</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Year</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Reg. #</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Chassis</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Cap.</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Driver</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>License</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Contact</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.map((v, idx) => (
                    <TableRow key={v._id} sx={{ bgcolor: idx % 2 ? '#fff' : '#f5f5f5' }}>
                      <TableCell>{v.number}</TableCell>
                      <TableCell>{v.model}</TableCell>
                      <TableCell>{v.year}</TableCell>
                      <TableCell>{v.regNumber}</TableCell>
                      <TableCell>{v.chassis}</TableCell>
                      <TableCell>{v.capacity}</TableCell>
                      <TableCell>{v.driver}</TableCell>
                      <TableCell>{v.license}</TableCell>
                      <TableCell>{v.contact}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(v)} sx={{ color: '#1976d2' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(v._id)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography sx={{ mt: 2 }}>Records: {filteredVehicles.length}</Typography>
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

export default VehicleList;