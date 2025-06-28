import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAdmissionEnquiries, createAdmissionEnquiry, updateAdmissionEnquiry, deleteAdmissionEnquiry, clearAdmissionEnquiryError
} from '../../../redux/FrontOffice/Enquiry/admissionEnquiryHandle';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';

const AdmissionEnquiry: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEnquiry, setNewEnquiry] = useState({
    name: '', phone: '', source: '', className: '', enquiryDate: '', lastFollowUp: '', nextFollowUp: '', status: 'Active'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  const dispatch = useDispatch();
  const enquiryState = useSelector((state: any) => state.admissionEnquiry || { enquiriesList: [], loading: false, error: null });
  const fclassState = useSelector((state: any) => state.fclass || { fclassesList: [], loading: false, error: null });
  const userState = useSelector((state: any) => state.user || {});
  const { enquiriesList, loading, error } = enquiryState;
  const { fclassesList } = fclassState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllAdmissionEnquiries(adminID));
      dispatch(getAllFclasses(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view admission enquiries', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearAdmissionEnquiryError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    setNewEnquiry({ ...newEnquiry, [e.target.name!]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to submit enquiries', severity: 'error' });
      return;
    }
    if (!newEnquiry.name || !newEnquiry.phone || !newEnquiry.source || !newEnquiry.className || !newEnquiry.enquiryDate || !newEnquiry.lastFollowUp || !newEnquiry.nextFollowUp) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }

    const action = editingId ? updateAdmissionEnquiry({ id: editingId, enquiry: newEnquiry, adminID }) : createAdmissionEnquiry(newEnquiry, adminID);

    dispatch(action)
      .then(() => {
        resetForm();
        setSnack({
          open: true,
          message: editingId ? 'Enquiry updated successfully' : 'Enquiry created successfully',
          severity: 'success',
        });
        setEditingId(null);
      })
      .catch((error: any) => {
        setSnack({
          open: true,
          message: error.message || (editingId ? 'Update failed' : 'Creation failed'),
          severity: 'error',
        });
      });
  };

  const resetForm = () => {
    setNewEnquiry({ name: '', phone: '', source: '', className: '', enquiryDate: '', lastFollowUp: '', nextFollowUp: '', status: 'Active' });
    setShowForm(false);
  };

  const handleEdit = (enquiry: any) => {
    setNewEnquiry(enquiry);
    setEditingId(enquiry._id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete enquiries', severity: 'error' });
      return;
    }
    dispatch(deleteAdmissionEnquiry(id, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Enquiry deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Delete failed', severity: 'error' });
      });
  };

  const handlePhoneInquiry = (phone: string) => {
    alert(`Calling ${phone}... 📞`);
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const filteredEnquiries = (enquiriesList || []).filter((enquiry: any) =>
    enquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.phone?.includes(searchQuery) ||
    enquiry.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.className?.toLowerCase().includes(searchQuery.toLowerCase())
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
        Admission Enquiry Management
      </Typography>

      <Grid container spacing={3}>
        {/* Search Filters */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Search Enquiries
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value as string)}
                      label="Class"
                    >
                      <MenuItem value="">All Classes</MenuItem>
                      {fclassesList.map((cls: any) => (
                        <MenuItem key={cls._id} value={cls.name}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <InputLabel>Source</InputLabel>
                    <Select
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value as string)}
                      label="Source"
                    >
                      <MenuItem value="">All Sources</MenuItem>
                      <MenuItem value="Front Office">Front Office</MenuItem>
                      <MenuItem value="Advertisement">Advertisement</MenuItem>
                      <MenuItem value="Google Ads">Google Ads</MenuItem>
                      <MenuItem value="Admission Campaign">Admission Campaign</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    label="Enquiry Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    label="Last Follow-Up Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value as string)}
                      label="Status"
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Passive">Passive</MenuItem>
                      <MenuItem value="Dead">Dead</MenuItem>
                      <MenuItem value="Won">Won</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(getAllAdmissionEnquiries(adminID))}
                    sx={{ mt: { xs: 2, md: 0 } }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Table and Add Button */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Enquiry List
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setShowForm(true)}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  + Add Enquiry
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      {['Name', 'Phone', 'Source', 'Class', 'Enquiry Date', 'Last Follow Up', 'Next Follow Up', 'Status', 'Actions'].map((header) => (
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
                        <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredEnquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                          No enquiries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEnquiries.map((enquiry: any, idx: number) => (
                        <TableRow
                          key={enquiry._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{enquiry.name}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{enquiry.phone}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{enquiry.source}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{enquiry.className}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(enquiry.enquiryDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(enquiry.lastFollowUp).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(enquiry.nextFollowUp).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{enquiry.status}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton onClick={() => handleEdit(enquiry)} sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(enquiry._id)} sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handlePhoneInquiry(enquiry.phone)} sx={{ color: '#28a745', p: { xs: 0.5, md: 1 } }}>
                              <PhoneIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Records: {filteredEnquiries.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Form Modal */}
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
            {editingId ? 'Edit Enquiry' : 'Add Enquiry'}
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Name"
              name="name"
              value={newEnquiry.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label="Phone"
              name="phone"
              value={newEnquiry.phone}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                name="source"
                value={newEnquiry.source}
                onChange={handleChange}
                required
                label="Source"
                size="small"
              >
                <MenuItem value="">Select Source</MenuItem>
                <MenuItem value="Front Office">Front Office</MenuItem>
                <MenuItem value="Advertisement">Advertisement</MenuItem>
                <MenuItem value="Google Ads">Google Ads</MenuItem>
                <MenuItem value="Admission Campaign">Admission Campaign</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select
                name="className"
                value={newEnquiry.className}
                onChange={handleChange}
                required
                label="Class"
                size="small"
              >
                <MenuItem value="">Select Class</MenuItem>
                {fclassesList.map((cls: any) => (
                  <MenuItem key={cls._id} value={cls.name}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Enquiry Date"
              type="date"
              name="enquiryDate"
              value={newEnquiry.enquiryDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Last Follow Up"
              type="date"
              name="lastFollowUp"
              value={newEnquiry.lastFollowUp}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Next Follow Up"
              type="date"
              name="nextFollowUp"
              value={newEnquiry.nextFollowUp}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={newEnquiry.status}
                onChange={handleChange}
                required
                label="Status"
                size="small"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
                <MenuItem value="Dead">Dead</MenuItem>
                <MenuItem value="Won">Won</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>
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

export default AdmissionEnquiry;