
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExamSchedules, createExamSchedule, clearExamScheduleError } from '../../../redux/examRelated/exam-schedule-actions';
import { getAllExamGroups } from '../../../redux/examRelated/exam-group-actions';

const ExamSchedule = () => {
  const dispatch = useDispatch();
  const examScheduleState = useSelector((state) => state.examSchedule || { examSchedulesList: [], loading: false, error: null });
  const examGroupState = useSelector((state) => state.examGroup || { examGroupsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { examSchedulesList, loading, error } = examScheduleState;
  const { examGroupsList } = examGroupState;
  const adminID = userState.currentUser?._id;

  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [selectedExamGroup, setSelectedExamGroup] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    duration: '',
    room: '',
    maxMarks: '',
    minMarks: '',
    examGroup: '',
    examType: '',
  });

  const examTypes = [
    'Monthly Test March 2025',
    'Final Exam Quarterly Examination Sept 2024',
    'Monthly Test JULY 2024',
    'Half-Yearly Examination Dec 2024',
  ];

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExamSchedules(adminID));
      dispatch(getAllExamGroups(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view exam schedules', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExamScheduleError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    setFilteredSchedules(examSchedulesList);
  }, [examSchedulesList]);

  const handleSubjectSearch = () => {
    console.log('Subject Search Term:', subjectSearchTerm);
    const filtered = examSchedulesList.filter((schedule) =>
      schedule.name.toLowerCase().includes(subjectSearchTerm.toLowerCase())
    );
    console.log('Filtered Schedules (Subject):', filtered);
    setFilteredSchedules([...filtered]);
    if (filtered.length === 0) {
      setSnack({ open: true, message: 'No schedules found for the subject search', severity: 'info' });
    }
  };

  const handleCriteriaSearch = () => {
    console.log('Search Criteria:', { selectedExamGroup, selectedExamType });
    console.log('Exam Schedules List:', examSchedulesList);
    const filtered = examSchedulesList.filter((schedule) => {
      const groupMatch = !selectedExamGroup || (schedule.examGroup && schedule.examGroup._id.toString() === selectedExamGroup);
      const typeMatch = !selectedExamType || schedule.examType.toLowerCase() === selectedExamType.toLowerCase();
      console.log(`Schedule: ${schedule.name}, Group Match: ${groupMatch}, Type Match: ${typeMatch}`);
      return groupMatch && typeMatch;
    });
    console.log('Filtered Schedules (Criteria):', filtered);
    setFilteredSchedules([...filtered]);
    if (filtered.length === 0) {
      setSnack({ open: true, message: 'No schedules found for the selected criteria', severity: 'info' });
    }
  };

  const handleAddExam = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setFormData({
      name: '',
      date: '',
      time: '',
      duration: '',
      room: '',
      maxMarks: '',
      minMarks: '',
      examGroup: '',
      examType: '',
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add exam schedules', severity: 'error' });
      return;
    }
    if (
      !formData.name ||
      !formData.date ||
      !formData.time ||
      !formData.duration ||
      !formData.room ||
      !formData.maxMarks ||
      !formData.minMarks ||
      !formData.examGroup ||
      !formData.examType
    ) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    dispatch(createExamSchedule(formData, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Exam schedule added successfully', severity: 'success' });
        handleCloseAddDialog();
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add exam schedule', severity: 'error' });
      });
  };

  const displayedSchedules = filteredSchedules.length > 0 ? filteredSchedules : examSchedulesList;

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
        Exam Schedule Management
      </Typography>
      <Grid container spacing={3}>
        {/* Select Criteria Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526' }}>
                  Select Criteria
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddExam}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                  startIcon={<AddIcon />}
                >
                  Add Exam
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel>Exam Group</InputLabel>
                  <Select
                    value={selectedExamGroup}
                    onChange={(e) => setSelectedExamGroup(e.target.value)}
                    label="Exam Group"
                  >
                    <MenuItem value="">Select Exam Group</MenuItem>
                    {examGroupsList.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel>Exam Type</InputLabel>
                  <Select
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    label="Exam Type"
                  >
                    <MenuItem value="">Select Exam Type</MenuItem>
                    {examTypes.map((type, index) => (
                      <MenuItem key={index} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCriteriaSearch}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Search Criteria
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Search and Table Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a2526', mb: 2 }}>
                Exam Schedules
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Search subjects"
                  value={subjectSearchTerm}
                  onChange={(e) => setSubjectSearchTerm(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubjectSearch}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  Search Subjects
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Subject
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Start Time
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Duration
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Room No.
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Marks (Max.)
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Marks (Min.)
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Exam Group
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Exam Type
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : displayedSchedules.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No exam schedules found
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedSchedules.map((schedule, idx) => (
                        <TableRow
                          key={schedule._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.date}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.time}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.duration}h
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.room}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.maxMarks}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.minMarks}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.examGroup ? schedule.examGroup.name : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.examType}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Records: {displayedSchedules.length} of {examSchedulesList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Exam Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Exam Schedule</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            fullWidth
            label="Date (MM/DD/YYYY)"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Start Time (HH:MM:SS)"
            name="time"
            value={formData.time}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Duration (hours)"
            name="duration"
            value={formData.duration}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            type="number"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Room No."
            name="room"
            value={formData.room}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            type="number"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Marks (Max)"
            name="maxMarks"
            value={formData.maxMarks}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            type="number"
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Marks (Min)"
            name="minMarks"
            value={formData.minMarks}
            onChange={handleFormChange}
            variant="outlined"
            size="small"
            type="number"
            sx={{ mb: 2 }}
            required
          />
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>Exam Group</InputLabel>
            <Select
              name="examGroup"
              value={formData.examGroup}
              onChange={handleFormChange}
              label="Exam Group"
              required
            >
              <MenuItem value="">Select Exam Group</MenuItem>
              {examGroupsList.map((group) => (
                <MenuItem key={group._id} value={group._id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>Exam Type</InputLabel>
            <Select
              name="examType"
              value={formData.examType}
              onChange={handleFormChange}
              label="Exam Type"
              required
            >
              <MenuItem value="">Select Exam Type</MenuItem>
              {examTypes.map((type, index) => (
                <MenuItem key={index} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="success">
            Save
          </Button>
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

export default ExamSchedule;
