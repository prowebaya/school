import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoutePickupPoints, createRoutePickupPoint, updateRoutePickupPoint, deleteRoutePickupPoint, clearRoutePickupPointError } from '../../../redux/TransportRelated/route-pickup-pointAction';
import { getAllTransportRoutes } from '../../../redux/TransportRelated/routeHandle';
import { getAllPickupPoints } from '../../../redux/TransportRelated/PickupPointAction';
import { CSVLink } from 'react-csv';

const RoutePickupPoint = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newPickup, setNewPickup] = useState({ routeId: '', pointId: '', fee: '', distance: '', time: '' });
  const [editPickup, setEditPickup] = useState({ id: '', routeId: '', pointId: '', fee: '', distance: '', time: '' });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const routePickupPointState = useSelector((state) => state.routePickupPoint || { routePickupPointsList: [], loading: false, error: null });
  const transportRouteState = useSelector((state) => state.transportRoute || { transportRoutesList: [], loading: false, error: null });
  const pickupPointState = useSelector((state) => state.pickupPoint || { pickupPointsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { routePickupPointsList, loading, error } = routePickupPointState;
  const { transportRoutesList } = transportRouteState;
  const { pickupPointsList } = pickupPointState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllRoutePickupPoints(adminID));
      dispatch(getAllTransportRoutes(adminID));
      dispatch(getAllPickupPoints(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view route pickup points', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearRoutePickupPointError());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    setNewPickup({ routeId: transportRoutesList[0]?._id || '', pointId: '', fee: '', distance: '', time: '' });
    setShowAddPopup(true);
  };

  const handleSaveAdd = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add route pickup points', severity: 'error' });
      return;
    }
    if (!newPickup.routeId || !newPickup.pointId || !newPickup.fee || !newPickup.distance || !newPickup.time) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    dispatch(createRoutePickupPoint(newPickup, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Route pickup point added successfully', severity: 'success' });
        setShowAddPopup(false);
        setNewPickup({ routeId: '', pointId: '', fee: '', distance: '', time: '' });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add route pickup point', severity: 'error' });
      });
  };

  const handleEdit = (pickup) => {
    setEditPickup({
      id: pickup._id,
      routeId: transportRoutesList.find((route) => route.title === pickup.route)?._id || '',
      pointId: pickupPointsList.find((point) => point.name === pickup.point)?._id || '',
      fee: pickup.fee.toString(),
      distance: pickup.distance.toString(),
      time: pickup.time,
    });
    setShowEditPopup(true);
  };

  const handleSaveEdit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update route pickup points', severity: 'error' });
      return;
    }
    if (!editPickup.routeId || !editPickup.pointId || !editPickup.fee || !editPickup.distance || !editPickup.time) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    dispatch(updateRoutePickupPoint({ id: editPickup.id, routePickupPoint: editPickup, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Route pickup point updated successfully', severity: 'success' });
        setShowEditPopup(false);
        setEditPickup({ id: '', routeId: '', pointId: '', fee: '', distance: '', time: '' });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to update route pickup point', severity: 'error' });
      });
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete route pickup points', severity: 'error' });
      return;
    }
    dispatch(deleteRoutePickupPoint(deleteId, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Route pickup point deleted successfully', severity: 'info' });
        setShowDelete(false);
        setDeleteId(null);
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to delete route pickup point', severity: 'error' });
      });
  };

  const handleCancelDelete = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleCancelPopup = () => {
    setShowAddPopup(false);
    setShowEditPopup(false);
    setNewPickup({ routeId: '', pointId: '', fee: '', distance: '', time: '' });
    setEditPickup({ id: '', routeId: '', pointId: '', fee: '', distance: '', time: '' });
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting route pickup points as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing route pickup points', severity: 'info' });
  };

  const filteredRoutes = routePickupPointsList.filter((route) =>
    route.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.pickups.some((pickup) => pickup.point.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const csvData = filteredRoutes.flatMap((route) =>
    route.pickups.map((pickup) => ({
      Route: route.route,
      'Pickup Point': pickup.point,
      'Monthly Fees ($)': pickup.fee,
      'Distance (km)': pickup.distance,
      'Pickup Time': pickup.time,
    }))
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
        Route Pickup Point Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Route Pickup Point List
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CSVLink
                    data={csvData}
                    filename="route-pickup-points.csv"
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
                label="Search routes or pickup points"
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
              {filteredRoutes.map((route, routeIndex) => (
                <Box key={routeIndex} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#1a2526', mb: 2, fontWeight: 600 }}>
                    {route.route}
                  </Typography>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#1a2526' }}>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                            Pickup Point
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                            Monthly Fees ($)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                            Distance (km)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                            Pickup Time
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
                        ) : route.pickups.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                              No pickup points found
                            </TableCell>
                          </TableRow>
                        ) : (
                          route.pickups.map((pickup, pickupIndex) => (
                            <TableRow
                              key={pickup._id}
                              sx={{
                                bgcolor: pickupIndex % 2 ? '#fff' : '#f9f9f9',
                                '&:hover': { bgcolor: '#e0f7fa' },
                              }}
                            >
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                {pickup.point}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                {pickup.fee.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                {pickup.distance}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                {pickup.time}
                              </TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                                <IconButton
                                  onClick={() => handleEdit(pickup)}
                                  sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                                  title="Edit"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteConfirm(pickup._id)}
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
                </Box>
              ))}
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Routes: {filteredRoutes.length} of {routePickupPointsList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Popup */}
      <Dialog open={showAddPopup || showEditPopup} onClose={handleCancelPopup} maxWidth="sm" fullWidth>
        <DialogTitle>{showEditPopup ? 'Edit Route Pickup Point' : 'Add New Route Pickup Point'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }} variant="outlined">
            <InputLabel>Route</InputLabel>
            <Select
              name="routeId"
              value={showEditPopup ? editPickup.routeId : newPickup.routeId}
              onChange={(e) => (showEditPopup ? setEditPickup({ ...editPickup, routeId: e.target.value }) : setNewPickup({ ...newPickup, routeId: e.target.value }))}
              label="Route"
              size="small"
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              {transportRoutesList.map((route) => (
                <MenuItem key={route._id} value={route._id}>{route.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
            <InputLabel>Pickup Point</InputLabel>
            <Select
              name="pointId"
              value={showEditPopup ? editPickup.pointId : newPickup.pointId}
              onChange={(e) => (showEditPopup ? setEditPickup({ ...editPickup, pointId: e.target.value }) : setNewPickup({ ...newPickup, pointId: e.target.value }))}
              label="Pickup Point"
              size="small"
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              {pickupPointsList.map((point) => (
                <MenuItem key={point._id} value={point._id}>{point.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Monthly Fee ($)"
            name="fee"
            type="number"
            value={showEditPopup ? editPickup.fee : newPickup.fee}
            onChange={(e) => (showEditPopup ? setEditPickup({ ...editPickup, fee: e.target.value }) : setNewPickup({ ...newPickup, fee: e.target.value }))}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Distance (km)"
            name="distance"
            type="number"
            value={showEditPopup ? editPickup.distance : newPickup.distance}
            onChange={(e) => (showEditPopup ? setEditPickup({ ...editPickup, distance: e.target.value }) : setNewPickup({ ...newPickup, distance: e.target.value }))}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Pickup Time"
            name="time"
            value={showEditPopup ? editPickup.time : newPickup.time}
            onChange={(e) => (showEditPopup ? setEditPickup({ ...editPickup, time: e.target.value }) : setNewPickup({ ...newPickup, time: e.target.value }))}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPopup} color="error">Cancel</Button>
          <Button onClick={showEditPopup ? handleSaveEdit : handleSaveAdd} color="success">
            {showEditPopup ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Popup */}
      <Dialog open={showDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this route pickup point?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="error">No</Button>
          <Button onClick={handleDelete} color="success">Yes</Button>
        </DialogActions>
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

export default RoutePickupPoint;