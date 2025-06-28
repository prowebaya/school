import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Settings as SettingsIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTransportRoutes, createTransportRoute, updateTransportRoute, deleteTransportRoute, clearTransportRouteError } from '../../../redux/TransportRelated/routeHandle';
import { CSVLink } from 'react-csv';

const TransportRouteAdd = () => {
  const [newTransportRouteTitle, setNewTransportRouteTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const transportRouteState = useSelector((state) => state.transportRoute || { transportRoutesList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { transportRoutesList, loading, error } = transportRouteState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllTransportRoutes(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view transport routes', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearTransportRouteError());
    }
  }, [error, dispatch]);

  const filteredTransportRoutes = transportRoutesList.filter((transportRoute) =>
    transportRoute.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveTransportRoute = () => {
    if (!newTransportRouteTitle.trim()) {
      setSnack({ open: true, message: 'Transport route title is required', severity: 'warning' });
      return;
    }
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add transport routes', severity: 'error' });
      return;
    }
    dispatch(createTransportRoute({ title: newTransportRouteTitle }, adminID))
      .then(() => {
        setNewTransportRouteTitle('');
        setSnack({ open: true, message: 'Transport route added successfully', severity: 'success' });
      })
      .catch((error) => {
        const errorMessage = error.message.includes('already exists')
          ? 'Transport route title already exists'
          : error.message.includes('404')
            ? 'Transport route service not found'
            : 'Failed to add transport route';
        setSnack({ open: true, message: errorMessage, severity: 'error' });
      });
  };

  const handleEdit = (transportRoute) => {
    setEditId(transportRoute._id);
    setEditTitle(transportRoute.title);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      setSnack({ open: true, message: 'Transport route title is required', severity: 'warning' });
      return;
    }
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update transport routes', severity: 'error' });
      return;
    }
    dispatch(updateTransportRoute({ id: editId, transportRoute: { title: editTitle }, adminID }))
      .then(() => {
        setEditId(null);
        setEditTitle('');
        setSnack({ open: true, message: 'Transport route updated successfully', severity: 'success' });
      })
      .catch((error) => {
        const errorMessage = error.message.includes('already exists')
          ? 'Transport route title already exists'
          : error.message.includes('404')
            ? 'Transport route not found'
            : 'Failed to update transport route';
        setSnack({ open: true, message: errorMessage, severity: 'error' });
      });
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete transport routes', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this transport route?')) {
      dispatch(deleteTransportRoute(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Transport route deleted successfully', severity: 'info' });
        })
        .catch((error) => {
          const errorMessage = error.message.includes('404')
            ? 'Transport route not found'
            : 'Failed to delete transport route';
          setSnack({ open: true, message: errorMessage, severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting transport routes as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing transport routes', severity: 'info' });
  };

  const handleSettings = () => {
    setSnack({ open: true, message: 'Settings functionality not implemented', severity: 'warning' });
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const csvData = filteredTransportRoutes.map((transportRoute) => ({
    Title: transportRoute.title,
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
        Transport Route Management
      </Typography>

      <Grid container spacing={3}>
        {/* Create Transport Route Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Create Transport Route
              </Typography>
              <TextField
                fullWidth
                label="Transport Route Title"
                value={newTransportRouteTitle}
                onChange={(e) => setNewTransportRouteTitle(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                required
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveTransportRoute}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
                fullWidth
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Transport Route List Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Transport Route List
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CSVLink
                    data={csvData}
                    filename="transport-routes.csv"
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
                  <IconButton sx={{ color: '#666' }} onClick={handleSettings} title="Settings">
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Search transport routes"
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
                        Transport Route Title
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredTransportRoutes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No transport routes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransportRoutes.map((transportRoute, idx) => (
                        <TableRow
                          key={transportRoute._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {editId === transportRoute._id ? (
                              <TextField
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{ width: '90%' }}
                              />
                            ) : (
                              transportRoute.title
                            )}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            {editId === transportRoute._id ? (
                              <IconButton
                                onClick={handleSaveEdit}
                                sx={{ color: '#4caf50', p: { xs: 0.5, md: 1 } }}
                                title="Save"
                              >
                                ✅
                              </IconButton>
                            ) : (
                              <>
                                <IconButton
                                  onClick={() => handleEdit(transportRoute)}
                                  sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                                  title="Edit"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDelete(transportRoute._id)}
                                  sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}
                                  title="Delete"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Records: {filteredTransportRoutes.length} of {transportRoutesList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default TransportRouteAdd;