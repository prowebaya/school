import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import {
  getAllAddTransportFees, createAddTransportFee, updateAddTransportFee, deleteAddTransportFee, clearAddTransportFeeError
} from '../../../redux/TransportRelated/AddTransportFeeAction';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
import { getAllSections } from '../../../redux/sectionRelated/sectionHandle';
import { fetchAdmissionForms } from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { getAllVehicles, clearVehicleError } from '../../../redux/TransportRelated/vehicleAction';

const AddTransportFees = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [criteria, setCriteria] = useState({ class: '', section: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFeeData, setAddFeeData] = useState({
    admissionNo: '',
    studentName: '',
    class: '',
    fatherName: '',
    dob: '',
    route: '',
    vehicleNo: '',
    pickupPoint: '',
    feeAmount: '',
    dueDate: ''
  });
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const { transportFeesList, loading: transportLoading, error: transportError } = useSelector((state) => state.addTransportFee || { transportFeesList: [], loading: false, error: null });
  const { admissionForms = [] } = useSelector((state) => state.admissionForms || {});
  const { fclassesList } = useSelector((state) => state.fclass || {});
  const { sectionsList } = useSelector((state) => state.sections || {});
  const { vehiclesList, loading: vehicleLoading, error: vehicleError } = useSelector((state) => state.vehicle || { vehiclesList: [], loading: false, error: null });
  const { currentUser } = useSelector((state) => state.user || {});
  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllAddTransportFees(adminID));
      dispatch(fetchAdmissionForms(adminID));
      dispatch(getAllFclasses(adminID));
      dispatch(getAllSections(adminID));
      dispatch(getAllVehicles(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view transport fees', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (transportError) {
      setSnack({ open: true, message: transportError, severity: 'error' });
      dispatch(clearAddTransportFeeError());
    }
    if (vehicleError) {
      setSnack({ open: true, message: vehicleError, severity: 'error' });
      dispatch(clearVehicleError());
    }
  }, [transportError, vehicleError, dispatch]);

  useEffect(() => {
    setClasses(fclassesList.map(cls => cls.name));
    setSections(sectionsList.map(sec => sec.name));
  }, [fclassesList, sectionsList]);

  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    setCriteria({ ...criteria, [name]: value });
  };

  const handleSearch = () => {
    if (criteria.class && criteria.section) {
      dispatch(getAllAddTransportFees(adminID));
    } else {
      setSnack({ open: true, message: 'Please select both Class and Section.', severity: 'warning' });
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    const student = admissionForms.find(s => s._id === studentId);
    if (student) {
      setAddFeeData({
        admissionNo: student.admissionNo,
        studentName: `${student.firstName} ${student.lastName}`,
        class: typeof student.classId === 'object' ? student.classId.name : student.classId,
        fatherName: student.parents.father.name,
        dob: student.dob,
        route: typeof student.routeId === 'object' ? student.routeId.title : student.routeId,
        vehicleNo: '', // Reset vehicleNo to allow manual selection
        pickupPoint: typeof student.pickupPointId === 'object' ? student.pickupPointId.name : student.pickupPointId,
        feeAmount: '',
        dueDate: ''
      });
    } else {
      setAddFeeData({
        admissionNo: '',
        studentName: '',
        class: '',
        fatherName: '',
        dob: '',
        route: '',
        vehicleNo: '',
        pickupPoint: '',
        feeAmount: '',
        dueDate: ''
      });
    }
  };

  const handleAddFormToggle = () => {
    setShowAddForm(!showAddForm);
    setSelectedStudentId('');
    setAddFeeData({
      admissionNo: '',
      studentName: '',
      class: '',
      fatherName: '',
      dob: '',
      route: '',
      vehicleNo: '',
      pickupPoint: '',
      feeAmount: '',
      dueDate: ''
    });
  };

  const handleSaveFee = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add transport fees', severity: 'error' });
      return;
    }
    if (!addFeeData.admissionNo || !addFeeData.studentName || !addFeeData.class || !addFeeData.fatherName || 
        !addFeeData.dob || !addFeeData.route || !addFeeData.vehicleNo || !addFeeData.pickupPoint || 
        !addFeeData.feeAmount || !addFeeData.dueDate) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    dispatch(createAddTransportFee(addFeeData, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Transport fee added successfully', severity: 'success' });
        setShowAddForm(false);
        setSelectedStudentId('');
        setAddFeeData({
          admissionNo: '',
          studentName: '',
          class: '',
          fatherName: '',
          dob: '',
          route: '',
          vehicleNo: '',
          pickupPoint: '',
          feeAmount: '',
          dueDate: ''
        });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add transport fee', severity: 'error' });
      });
  };

  const handleEdit = (fee) => {
    setSelectedStudentId(admissionForms.find(s => s.admissionNo === fee.admissionNo)?._id || '');
    setAddFeeData({
      admissionNo: fee.admissionNo,
      studentName: fee.studentName,
      class: fee.class,
      fatherName: fee.fatherName,
      dob: fee.dob,
      route: fee.route,
      vehicleNo: fee.vehicleNo,
      pickupPoint: fee.pickupPoint,
      feeAmount: fee.feeAmount.toString(),
      dueDate: fee.dueDate
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete transport fees', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this transport fee?')) {
      dispatch(deleteAddTransportFee(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Transport fee deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete transport fee', severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting transport fees as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing transport fees', severity: 'info' });
  };

  const filteredFees = transportFeesList.filter(fee =>
    (searchTerm === '' || 
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!criteria.class || fee.class === criteria.class) &&
    (!criteria.section || admissionForms.find(s => s.admissionNo === fee.admissionNo)?.section === criteria.section)
  );

  const csvData = filteredFees.map(fee => ({
    AdmissionNo: fee.admissionNo,
    StudentName: fee.studentName,
    Class: fee.class,
    FatherName: fee.fatherName,
    DOB: fee.dob,
    Route: fee.route,
    VehicleNo: fee.vehicleNo,
    PickupPoint: fee.pickupPoint,
    FeeAmount: fee.feeAmount,
    DueDate: fee.dueDate
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
        Transport Fees Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Select Criteria
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFormToggle}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  Add Transport Fees
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel>Class</InputLabel>
                  <Select
                    name="class"
                    value={criteria.class}
                    onChange={handleCriteriaChange}
                    label="Class"
                    size="small"
                  >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    {classes.map((cls, index) => (
                      <MenuItem key={index} value={cls}>{cls}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel>Section</InputLabel>
                  <Select
                    name="section"
                    value={criteria.section}
                    onChange={handleCriteriaChange}
                    label="Section"
                    size="small"
                  >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    {sections.map((sec, index) => (
                      <MenuItem key={index} value={sec}>{sec}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  Search
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {showAddForm && (
          <Grid item xs={12}>
            <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mt: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                  Add New Transport Fee
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Student</InputLabel>
                    <Select
                      value={selectedStudentId}
                      onChange={handleStudentChange}
                      label="Select Student"
                      size="small"
                    >
                      <MenuItem value=""><em>Select a student</em></MenuItem>
                      {admissionForms.map(student => (
                        <MenuItem key={student._id} value={student._id}>
                          {`${student.firstName} ${student.lastName} (${student.admissionNo})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Admission No"
                    name="admissionNo"
                    value={addFeeData.admissionNo}
                    onChange={(e) => setAddFeeData({ ...addFeeData, admissionNo: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Student Name"
                    name="studentName"
                    value={addFeeData.studentName}
                    onChange={(e) => setAddFeeData({ ...addFeeData, studentName: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Class"
                    name="class"
                    value={addFeeData.class}
                    onChange={(e) => setAddFeeData({ ...addFeeData, class: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Father Name"
                    name="fatherName"
                    value={addFeeData.fatherName}
                    onChange={(e) => setAddFeeData({ ...addFeeData, fatherName: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    value={addFeeData.dob}
                    onChange={(e) => setAddFeeData({ ...addFeeData, dob: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Route Title"
                    name="route"
                    value={addFeeData.route}
                    onChange={(e) => setAddFeeData({ ...addFeeData, route: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Vehicle Number</InputLabel>
                    <Select
                      name="vehicleNo"
                      value={addFeeData.vehicleNo}
                      onChange={(e) => setAddFeeData({ ...addFeeData, vehicleNo: e.target.value })}
                      label="Vehicle Number"
                      size="small"
                    >
                      <MenuItem value=""><em>Select a vehicle</em></MenuItem>
                      {vehiclesList.map(vehicle => (
                        <MenuItem key={vehicle._id} value={vehicle.number}>
                          {vehicle.number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Pickup Point"
                    name="pickupPoint"
                    value={addFeeData.pickupPoint}
                    onChange={(e) => setAddFeeData({ ...addFeeData, pickupPoint: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Fee Amount"
                    name="feeAmount"
                    type="number"
                    value={addFeeData.feeAmount}
                    onChange={(e) => setAddFeeData({ ...addFeeData, feeAmount: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={addFeeData.dueDate}
                    onChange={(e) => setAddFeeData({ ...addFeeData, dueDate: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleAddFormToggle}
                      sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSaveFee}
                      sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Student Transport Fees
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CSVLink
                    data={csvData}
                    filename="transport-fees.csv"
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
                label="Search by Name or Admission No..."
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
                      {['Admission No', 'Student Name', 'Class', 'Father Name', 'Date of Birth', 'Route Title', 'Vehicle Number', 'Pickup Point', 'Fee Amount', 'Due Date', 'Action'].map(header => (
                        <TableCell key={header} sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transportLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredFees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No transport fees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFees.map(fee => (
                        <TableRow
                          key={fee._id}
                          sx={{
                            bgcolor: fee._id % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.admissionNo}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.studentName}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.class}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.fatherName}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.dob}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.route}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.vehicleNo || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.pickupPoint}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.feeAmount}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {fee.dueDate}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton
                              onClick={() => handleEdit(fee)}
                              sx={{ color: '#1976d2', p: { xs: 0.5, md: 1 } }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(fee._id)}
                              sx={{ color: '#d32f2f', p: { xs: 0.5, md: 1 } }}
                              title="Delete"
                            ></IconButton>
                              <DeleteIcon fontSize="small" />
                            </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Records: {filteredFees.length} of {transportFeesList.length}
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

export default AddTransportFees;