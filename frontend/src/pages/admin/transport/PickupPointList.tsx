import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPickupPoints, createPickupPoint, updatePickupPoint, deletePickupPoint, clearPickupPointError } from '../../../redux/TransportRelated/PickupPointAction';
import { CSVLink } from 'react-csv';

const PickupPointList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newPoint, setNewPoint] = useState({ name: '', lat: '', lng: '' });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const pickupPointState = useSelector((state) => state.pickupPoint || { pickupPointsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { pickupPointsList, loading, error } = pickupPointState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllPickupPoints(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view pickup points', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearPickupPointError());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    setNewPoint({ name: '', lat: '', lng: '' });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPoint(null);
    setNewPoint({ name: '', lat: '', lng: '' });
    setEditId(null);
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add pickup points', severity: 'error' });
      return;
    }
    if (!newPoint.name || !newPoint.lat || !newPoint.lng) {
      setSnack({ open: true, message: 'Name, latitude, and longitude are required', severity: 'warning' });
      return;
    }
    dispatch(createPickupPoint(newPoint, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Pickup point added successfully', severity: 'success' });
        handleClosePopup();
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add pickup point', severity: 'error' });
      });
  };

  const handleEdit = (point) => {
    setEditId(point._id);
    setNewPoint({ name: point.name, lat: point.lat, lng: point.lng });
    setIsPopupOpen(true);
  };

  const handleSaveEdit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update pickup points', severity: 'error' });
      return;
    }
    if (!newPoint.name || !newPoint.lat || !newPoint.lng) {
      setSnack({ open: true, message: 'Name, latitude, and longitude are required', severity: 'warning' });
      return;
    }
    dispatch(updatePickupPoint({ id: editId, pickupPoint: newPoint, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Pickup point updated successfully', severity: 'success' });
        handleClosePopup();
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to update pickup point', severity: 'error' });
      });
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete pickup points', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this pickup point?')) {
      dispatch(deletePickupPoint(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Pickup point deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete pickup point', severity: 'error' });
        });
    }
  };

  const handleMapView = (point) => {
    setSelectedPoint(point);
    setIsPopupOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPoint({ ...newPoint, [name]: value });
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting pickup points as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing pickup points', severity: 'info' });
  };

  const filteredPickupPoints = pickupPointsList.filter((point) =>
    point.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const csvData = filteredPickupPoints.map((point) => ({
    Name: point.name,
    Latitude: point.lat,
    Longitude: point.lng,
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
        Pickup Point Management
      </Typography>

      <Grid container spacing={3}>
        {/* Pickup Point List */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Pickup Point List
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CSVLink
                    data={csvData}
                    filename="pickup-points.csv"
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
                  >
                    + Add
                  </Button>
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Search pickup points"
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
                        Name
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Latitude
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Longitude
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredPickupPoints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No pickup points found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPickupPoints.map((point, idx) => (
                        <TableRow
                          key={point._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {point.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {point.lat}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {point.lng}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton
                              onClick={() => handleMapView(point)}
                              sx={{ color: '#666', p: { xs: 0.5, md: 1 } }}
                              title="View Map"
                            >
                              📍
                            </IconButton>
                            <IconButton
                              onClick={() => handleEdit(point)}
                              sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(point._id)}
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
                Records: {filteredPickupPoints.length} of {pickupPointsList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        {selectedPoint ? (
          <>
            <DialogTitle>Map View</DialogTitle>
            <DialogContent>
              <Box sx={{ height: '300px', bgcolor: '#e0e0e0', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary" textAlign="center">
                  Map for {selectedPoint.name}<br />
                  Latitude: {selectedPoint.lat}, Longitude: {selectedPoint.lng}<br />
                  (Integrate Google Maps API here with these coordinates)
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="error">Close</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>{editId ? 'Edit Pickup Point' : 'Add New Pickup Point'}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newPoint.name}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2, mt: 1 }}
                required
              />
              <TextField
                fullWidth
                label="Latitude"
                name="lat"
                value={newPoint.lat}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Longitude"
                name="lng"
                value={newPoint.lng}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="error">Cancel</Button>
              <Button onClick={editId ? handleSaveEdit : handleSave} color="success">
                {editId ? 'Update' : 'Save'}
              </Button>
            </DialogActions>
          </>
        )}
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
    </Box>
  );
};

export default PickupPointList;