
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControlLabel, Radio, RadioGroup, Checkbox
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllTransportFees, createTransportFees, updateTransportFees, deleteTransportFees, copyTransportFees, clearTransportFeesError
} from '../../../redux/TransportRelated/transport-fees-actions';

const TransportFeesMaster = () => {
  const [feesDetails, setFeesDetails] = useState({});
  const [copyFirstFees, setCopyFirstFees] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newFees, setNewFees] = useState({ month: '', dueDate: '', fineType: 'None', percentage: '', fixedAmount: '' });

  const dispatch = useDispatch();
  const transportFeesState = useSelector((state) => state.transportFees || { transportFeesList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { transportFeesList, loading, error } = transportFeesState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllTransportFees(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view transport fees', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearTransportFeesError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const feesMap = transportFeesList.reduce((acc, fees) => ({
      ...acc,
      [fees.month]: {
        dueDate: fees.dueDate,
        fineType: fees.fineType,
        percentage: fees.percentage,
        fixedAmount: fees.fixedAmount,
        _id: fees._id,
      },
    }), {});
    setFeesDetails(feesMap);
  }, [transportFeesList]);

  const handleChange = (month, field, value) => {
    setFeesDetails((prevDetails) => ({
      ...prevDetails,
      [month]: {
        ...prevDetails[month],
        [field]: value,
      },
    }));
  };

  const handleFineTypeChange = (month, fineType) => {
    setFeesDetails((prevDetails) => ({
      ...prevDetails,
      [month]: {
        ...prevDetails[month],
        fineType,
        percentage: fineType === 'Percentage' ? prevDetails[month].percentage || '0.00' : '',
        fixedAmount: fineType === 'Fix Amount' ? prevDetails[month].fixedAmount || '0.00' : '',
      },
    }));
  };

  const handleCopyFirstFees = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to copy fees', severity: 'error' });
      return;
    }
    dispatch(copyTransportFees(adminID))
      .then(() => {
        setSnack({ open: true, message: 'Fees copied successfully for all months', severity: 'success' });
        setCopyFirstFees(true);
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to copy fees', severity: 'error' });
      });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to save fees', severity: 'error' });
      return;
    }
    Object.keys(feesDetails).forEach((month) => {
      const fees = feesDetails[month];
      if (!fees.dueDate || !fees.fineType) {
        setSnack({ open: true, message: `Due date and fine area required for ${month}`, severity: 'warning' });
        return;
      }
      const payload = {
        month,
        dueDate: fees.dueDate,
        fineType: fees.fineType,
        percentage: fees.percentage,
        fixedAmount: fees.fixedAmount,
      };
      if (fees._id) {
        dispatch(updateTransportFees({ id: fees._id, transportFees: payload, adminID }))
          .catch((err) => {
            setSnack({ open: true, message: err.message || `Failed to update fees for ${month}`, severity: 'error' });
          });
      } else {
        dispatch(createTransportFees(payload, adminID))
          .catch((err) => {
            setSnack({ open: true, message: err.message || `Failed to add fees for ${month}`, severity: 'error' });
          });
      }
    });
    setSnack({ open: true, message: 'Fees details saved successfully', severity: 'success' });
  };

  const handleEdit = (month) => {
    setEditId(feesDetails[month]._id);
    setNewFees({
      month,
      dueDate: feesDetails[month].dueDate,
      fineType: feesDetails[month].fineType,
      percentage: feesDetails[month].percentage,
      fixedAmount: feesDetails[month].fixedAmount,
    });
    setIsPopupOpen(true);
  };

  const handleDelete = (month) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete fees', severity: 'error' });
      return;
    }
    const feesId = feesDetails[month]._id;
    if (feesId && window.confirm(`Are you sure you want to delete fees for ${month}?`)) {
      dispatch(deleteTransportFees(feesId, adminID))
        .then(() => {
          setSnack({ open: true, message: `Fees for ${month} deleted successfully`, severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || `Failed to delete fees for ${month}`, severity: 'error' });
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFees({ ...newFees, [name]: value });
  };

  const handleSaveEdit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update fees', severity: 'error' });
      return;
    }
    if (!newFees.month || !newFees.dueDate || !newFees.fineType) {
      setSnack({ open: true, message: 'Month, due date, and fine type are required', severity: 'warning' });
      return;
    }
    dispatch(updateTransportFees({ id: editId, transportFees: newFees, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Fees updated successfully', severity: 'success' });
        setIsPopupOpen(false);
        setNewFees({ month: '', dueDate: '', fineType: 'None', percentage: '', fixedAmount: '' });
        setEditId(null);
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to update fees', severity: 'error' });
      });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setNewFees({ month: '', dueDate: '', fineType: 'None', percentage: '', fixedAmount: '' });
    setEditId(null);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
        Transport Fees Master
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Transport Fees List
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={copyFirstFees}
                        onChange={handleCopyFirstFees}
                      />
                    }
                    label="Copy First Fees Detail For All Months"
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    sx={{ borderRadius: '20px', textTransform: 'none' }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Month
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Due Date
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Fine Type
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Percentage
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Fixed Amount
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : months.map((month, idx) => (
                      <TableRow
                        key={month}
                        sx={{
                          bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                          '&:hover': { bgcolor: '#e0f7fa' },
                        }}
                      >
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          {month}
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          <TextField
                            value={feesDetails[month]?.dueDate || ''}
                            onChange={(e) => handleChange(month, 'dueDate', e.target.value)}
                            size="small"
                            placeholder="DD/MM/YYYY"
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          <RadioGroup
                            row
                            value={feesDetails[month]?.fineType || 'None'}
                            onChange={(e) => handleFineTypeChange(month, e.target.value)}
                          >
                            <FormControlLabel value="None" control={<Radio size="small" />} label="None" />
                            <FormControlLabel value="Percentage" control={<Radio size="small" />} label="Percentage (%)" />
                            <FormControlLabel value="Fix Amount" control={<Radio size="small" />} label="Fix Amount ($)" />
                          </RadioGroup>
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          <TextField
                            value={feesDetails[month]?.percentage || ''}
                            onChange={(e) => handleChange(month, 'percentage', e.target.value)}
                            size="small"
                            placeholder="0.00"
                            disabled={feesDetails[month]?.fineType !== 'Percentage'}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          <TextField
                            value={feesDetails[month]?.fixedAmount || ''}
                            onChange={(e) => handleChange(month, 'fixedAmount', e.target.value)}
                            size="small"
                            placeholder="0.00"
                            disabled={feesDetails[month]?.fineType !== 'Fix Amount'}
                          />
                        </TableCell>
                        <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                          <IconButton
                            onClick={() => handleEdit(month)}
                            sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(month)}
                            sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Records: {Object.keys(feesDetails).length} of {months.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Transport Fees</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Month"
            name="month"
            value={newFees.month}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2, mt: 1 }}
            select
            SelectProps={{ native: true }}
            disabled
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            value={newFees.dueDate}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            placeholder="DD/MM/YYYY"
            required
          />
          <RadioGroup
            row
            name="fineType"
            value={newFees.fineType}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="None" control={<Radio size="small" />} label="None" />
            <FormControlLabel value="Percentage" control={<Radio size="small" />} label="Percentage (%)" />
            <FormControlLabel value="Fix Amount" control={<Radio size="small" />} label="Fix Amount ($)" />
          </RadioGroup>
          <TextField
            fullWidth
            label="Percentage"
            name="percentage"
            value={newFees.percentage}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            placeholder="0.00"
            disabled={newFees.fineType !== 'Percentage'}
          />
          <TextField
            fullWidth
            label="Fixed Amount"
            name="fixedAmount"
            value={newFees.fixedAmount}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            placeholder="0.00"
            disabled={newFees.fineType !== 'Fix Amount'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="error">Cancel</Button>
          <Button onClick={handleSaveEdit} color="success">Update</Button>
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

export default TransportFeesMaster;
