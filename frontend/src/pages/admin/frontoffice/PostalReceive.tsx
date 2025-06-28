import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent, TextareaAutosize,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllPostalReceives, createPostalReceive, updatePostalReceive, deletePostalReceive, clearPostalReceiveError
} from '../../../redux/FrontOffice/Enquiry/postalReceiveHandle';

const PostalReceive: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    fromTitle: '',
    referenceNo: '',
    address: '',
    note: '',
    toTitle: '',
    date: new Date().toISOString().split('T')[0],
    document: null as File | null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newer');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  const dispatch = useDispatch();
  const postalReceiveState = useSelector((state: any) => {
    console.log('Redux state:', state);
    return state.postalReceive || { receivesList: [], loading: false, error: null };
  });
  const userState = useSelector((state: any) => state.user || {});
  const { receivesList, loading, error } = postalReceiveState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    console.log('Effect triggered with adminID:', adminID);
    if (adminID) {
      dispatch(getAllPostalReceives(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view postal receives', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearPostalReceiveError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    if (e.target.name === 'document') {
      const files = (e.target as HTMLInputElement).files;
      setFormData({ ...formData, document: files ? files[0] : null });
    } else {
      setFormData({ ...formData, [e.target.name!]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit receives', severity: 'error' });
      return;
    }
    if (!formData.fromTitle || !formData.date) {
      setSnack({ open: true, message: 'From Title and Date are required', severity: 'warning' });
      return;
    }
    console.log('Submitting formData:', formData, 'adminID:', adminID);
    const action = editingId
      ? updatePostalReceive({ id: editingId, receiveData: formData, adminID })
      : createPostalReceive(formData, adminID);

    dispatch(action)
      .then(() => {
        resetForm();
        setSnack({
          open: true,
          message: editingId ? 'Receive updated successfully' : 'Receive created successfully',
          severity: 'success',
        });
        setEditingId(null);
      })
      .catch((error: any) => {
        console.error('Submit error:', error);
        setSnack({
          open: true,
          message: error.message || (editingId ? 'Update failed' : 'Creation failed'),
          severity: 'error',
        });
      });
  };

  const resetForm = () => {
    setFormData({
      fromTitle: '',
      referenceNo: '',
      address: '',
      note: '',
      toTitle: '',
      date: new Date().toISOString().split('T')[0],
      document: null,
    });
    setShowForm(false);
  };

  const handleEdit = (receive: any) => {
    setFormData({
      fromTitle: receive.fromTitle,
      referenceNo: receive.referenceNo || '',
      address: receive.address || '',
      note: receive.note || '',
      toTitle: receive.toTitle || '',
      date: new Date(receive.date).toISOString().split('T')[0],
      document: null,
    });
    setEditingId(receive._id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete receives', severity: 'error' });
      return;
    }
    dispatch(deletePostalReceive(id, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Receive deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Delete failed', severity: 'error' });
      });
  };

  const handleView = (item: any) => {
    setViewItem(item);
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const filteredList = receivesList
    ? receivesList
        .filter((item: any) => item.fromTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a: any, b: any) =>
          sortOrder === 'newer'
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    : [];

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
        Postal Receive Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Search Receives
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={8}>
                  <TextField
                    fullWidth
                    label="Search by From Title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as string)}
                      label="Sort by"
                      size="small"
                    >
                      <MenuItem value="newer">Newer First</MenuItem>
                      <MenuItem value="older">Older First</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Receive List
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setShowForm(true)}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  + Add Receive
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      {['From Title', 'Reference No', 'To Title', 'Date', 'Actions'].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            p: { xs: 1, md: 2 },
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                          No receives found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredList.map((item: any, idx: number) => (
                        <TableRow
                          key={item._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.fromTitle}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.referenceNo || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {item.toTitle || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(item.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton onClick={() => handleEdit(item)} sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleView(item)} sx={{ color: '#28a745', p: { xs: 0.5, md: 1 } }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}>
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
                Records: {filteredList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {showForm && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            p: { xs: 2, md: 4 },
            width: { xs: '90%', sm: 400 },
            maxWidth: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            borderRadius: 2,
            zIndex: 1300,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
            {editingId ? 'Edit Receive' : 'Add Receive'}
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="From Title"
              name="fromTitle"
              value={formData.fromTitle}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Reference No"
              name="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="To Title"
              name="toTitle"
              value={formData.toTitle}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Document"
              type="file"
              name="document"
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' }}
              fullWidth
              variant="outlined"
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowForm(false)}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}

      <Dialog open={!!viewItem} onClose={() => setViewItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Postal Receive Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography>
                <strong>From Title:</strong> {viewItem.fromTitle}
              </Typography>
              <Typography>
                <strong>Reference No:</strong> {viewItem.referenceNo || 'N/A'}
              </Typography>
              <Typography>
                <strong>Address:</strong> {viewItem.address || 'N/A'}
              </Typography>
              <Typography>
                <strong>Note:</strong> {viewItem.note || 'N/A'}
              </Typography>
              <Typography>
                <strong>To Title:</strong> {viewItem.toTitle || 'N/A'}
              </Typography>
              <Typography>
                <strong>Date:</strong> {new Date(viewItem.date).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Document:</strong>{' '}
                {viewItem.document ? (
                  <a href={`${process.env.REACT_APP_BASE_URL}/${viewItem.document}`} target="_blank" rel="noopener noreferrer">
                    📂 View
                  </a>
                ) : (
                  'No File'
                )}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewItem(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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

export default PostalReceive;