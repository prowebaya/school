import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Snackbar, Alert, Grid, Card, CardContent, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Pagination,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getMarksheets, createMarksheet, updateMarksheet, deleteMarksheet, clearMarksheetError } from '../../../redux/examRelated/marksheet-actions';
import { CSVLink } from 'react-csv';

const MarksheetDesigner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMarksheet, setSelectedMarksheet] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newMarksheet, setNewMarksheet] = useState({
    template: '',
    class: '',
    section: '',
    studentName: '',
    examCenter: '',
    bodyText: '',
    footerText: '',
    printingDate: '',
    headerImage: null,
    leftLogo: null,
    rightLogo: null,
    leftSign: null,
    rightSign: null,
    backgroundImage: null,
    options: {
      name: false,
      fatherName: false,
      motherName: false,
      examSession: false,
      admissionNo: false,
      division: false,
      rank: false,
      rollNumber: false,
      photo: false,
      classSection: false,
      dob: false,
      remark: false,
      address: false,
      subjectScores: false,
      attendance: false,
      totalMarks: false,
      grade: false,
    },
  });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [downloadError, setDownloadError] = useState(null);
  const [isHtml2CanvasLoaded, setIsHtml2CanvasLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const previewRef = useRef(null);

  const dispatch = useDispatch();
  const marksheetState = useSelector((state) => state.marksheet || { marksheetsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { marksheetsList, loading, error } = marksheetState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getMarksheets(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view marksheets', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearMarksheetError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.async = true;
      script.onload = () => setIsHtml2CanvasLoaded(true);
      script.onerror = () => setDownloadError('Failed to load html2canvas library.');
      document.head.appendChild(script);
    } else {
      setIsHtml2CanvasLoaded(true);
    }
  }, []);

  const handleAdd = () => {
    setNewMarksheet({
      template: '',
      class: '',
      section: '',
      studentName: '',
      examCenter: '',
      bodyText: '',
      footerText: '',
      printingDate: new Date('2025-06-26T07:51:00Z').toISOString().split('T')[0], // Default to current date (07:51 AM IST, June 26, 2025)
      headerImage: null,
      leftLogo: null,
      rightLogo: null,
      leftSign: null,
      rightSign: null,
      backgroundImage: null,
      options: {
        name: false,
        fatherName: false,
        motherName: false,
        examSession: false,
        admissionNo: false,
        division: false,
        rank: false,
        rollNumber: false,
        photo: false,
        classSection: false,
        dob: false,
        remark: false,
        address: false,
        subjectScores: false,
        attendance: false,
        totalMarks: false,
        grade: false,
      },
    });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedMarksheet(null);
    setNewMarksheet({
      template: '',
      class: '',
      section: '',
      studentName: '',
      examCenter: '',
      bodyText: '',
      footerText: '',
      printingDate: new Date('2025-06-26T07:51:00Z').toISOString().split('T')[0], // Default to current date
      headerImage: null,
      leftLogo: null,
      rightLogo: null,
      leftSign: null,
      rightSign: null,
      backgroundImage: null,
      options: {
        name: false,
        fatherName: false,
        motherName: false,
        examSession: false,
        admissionNo: false,
        division: false,
        rank: false,
        rollNumber: false,
        photo: false,
        classSection: false,
        dob: false,
        remark: false,
        address: false,
        subjectScores: false,
        attendance: false,
        totalMarks: false,
        grade: false,
      },
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add marksheets', severity: 'error' });
      return;
    }
    if (!newMarksheet.template || !newMarksheet.studentName || !newMarksheet.examCenter) {
      setSnack({ open: true, message: 'Template, student name, and exam center are required', severity: 'warning' });
      return;
    }
    dispatch(createMarksheet(newMarksheet, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Marksheet added successfully', severity: 'success' });
        handleClosePopup();
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add marksheet', severity: 'error' });
      });
  };

  const handleEdit = (marksheet) => {
    setEditId(marksheet._id);
    setNewMarksheet({
      template: marksheet.template,
      class: marksheet.class || '',
      section: marksheet.section || '',
      studentName: marksheet.studentName,
      examCenter: marksheet.examCenter,
      bodyText: marksheet.bodyText || '',
      footerText: marksheet.footerText || '',
      printingDate: marksheet.printingDate ? new Date(marksheet.printingDate).toISOString().split('T')[0] : new Date('2025-06-26T07:51:00Z').toISOString().split('T')[0],
      headerImage: marksheet.headerImage || null,
      leftLogo: marksheet.leftLogo || null,
      rightLogo: marksheet.rightLogo || null,
      leftSign: marksheet.leftSign || null,
      rightSign: marksheet.rightSign || null,
      backgroundImage: marksheet.backgroundImage || null,
      options: marksheet.options || {
        name: false,
        fatherName: false,
        motherName: false,
        examSession: false,
        admissionNo: false,
        division: false,
        rank: false,
        rollNumber: false,
        photo: false,
        classSection: false,
        dob: false,
        remark: false,
        address: false,
        subjectScores: false,
        attendance: false,
        totalMarks: false,
        grade: false,
      },
    });
    setIsPopupOpen(true);
  };

  const handleSaveEdit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to update marksheets', severity: 'error' });
      return;
    }
    if (!newMarksheet.template || !newMarksheet.studentName || !newMarksheet.examCenter) {
      setSnack({ open: true, message: 'Template, student name, and exam center are required', severity: 'warning' });
      return;
    }
    dispatch(updateMarksheet({ id: editId, marksheetData: newMarksheet, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Marksheet updated successfully', severity: 'success' });
        handleClosePopup();
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to update marksheet', severity: 'error' });
      });
  };

  const handleDelete = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete marksheets', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this marksheet?')) {
      dispatch(deleteMarksheet(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Marksheet deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete marksheet', severity: 'error' });
        });
    }
  };

  const handleMapView = (marksheet) => {
    setSelectedMarksheet(marksheet);
    setIsPopupOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewMarksheet({
        ...newMarksheet,
        options: { ...newMarksheet.options, [name]: checked },
      });
    } else if (name === 'headerImage' || name === 'leftLogo' || name === 'rightLogo' || name === 'leftSign' || name === 'rightSign' || name === 'backgroundImage') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewMarksheet({ ...newMarksheet, [name]: event.target.result });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setNewMarksheet({ ...newMarksheet, [name]: value });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting marksheets as CSV', severity: 'info' });
  };

  const handleDownload = () => {
    setDownloadError(null);
    if (!previewRef.current) {
      setDownloadError('Preview is not available.');
      return;
    }
    if (!window.html2canvas || !isHtml2CanvasLoaded) {
      setDownloadError('html2canvas is not loaded yet.');
      return;
    }
    window.html2canvas(previewRef.current, { scale: 2 })
      .then((canvas) => {
        const link = document.createElement('a');
        link.download = `${selectedMarksheet?.template || 'marksheet'}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
      })
      .catch((error) => {
        setDownloadError('Failed to generate JPG: ' + error.message);
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filteredMarksheets = marksheetsList.filter((marksheet) =>
    marksheet.template.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedMarksheets = filteredMarksheets.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredMarksheets.length / rowsPerPage);

  const csvData = filteredMarksheets.map((marksheet) => ({
    Template: marksheet.template,
    Class: marksheet.class || '',
    Section: marksheet.section || '',
    StudentName: marksheet.studentName,
    ExamCenter: marksheet.examCenter,
    PrintingDate: marksheet.printingDate ? new Date(marksheet.printingDate).toISOString().split('T')[0] : '',
  }));

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #e0eafc 100%)',
        minHeight: '100vh',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#2c3e50',
          mb: 4,
          fontSize: { xs: '1.5rem', md: '2.5rem' },
          textTransform: 'uppercase',
          letterSpacing: '1px',
          animation: 'fadeIn 1s ease-in',
        }}
      >
        Marksheet Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              background: '#ffffff',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 0 },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#34495e',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    animation: 'slideIn 0.8s ease-out',
                  }}
                >
                  Marksheet List
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CSVLink
                    data={csvData}
                    filename="marksheets.csv"
                    style={{ textDecoration: 'none' }}
                    onClick={handleExport}
                  >
                    <IconButton
                      sx={{
                        color: '#7f8c8d',
                        backgroundColor: '#ecf0f1',
                        borderRadius: '50%',
                        padding: '10px',
                        '&:hover': {
                          backgroundColor: '#bdc3c7',
                          color: '#2c3e50',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      title="Export"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </CSVLink>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAdd}
                    sx={{
                      borderRadius: '25px',
                      textTransform: 'none',
                      padding: '10px 25px',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                      color: '#fff',
                      boxShadow: '0 5px 15px rgba(46, 204, 113, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #27ae60, #219653)',
                        boxShadow: '0 7px 20px rgba(46, 204, 113, 0.6)',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    + Add New Marksheet
                  </Button>
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Search marksheets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '&:hover': { borderColor: '#3498db' },
                  },
                  '& .MuiInputLabel-root': { color: '#7f8c8d' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#7f8c8d' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 'none',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#34495e' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Template
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Student Name
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Exam Center
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.9rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2, color: '#7f8c8d' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : paginatedMarksheets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                          No marksheets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedMarksheets.map((marksheet, idx) => (
                        <TableRow
                          key={marksheet._id}
                          sx={{
                            bgcolor: idx % 2 === 0 ? '#f9fbfd' : '#fff',
                            '&:hover': { bgcolor: '#e8f4f8', transition: 'all 0.2s ease' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {marksheet.template}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {marksheet.studentName}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {marksheet.examCenter}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleMapView(marksheet)}
                              sx={{
                                color: '#7f8c8d',
                                p: { xs: 0.5, md: 1 },
                                borderRadius: '50%',
                                '&:hover': { backgroundColor: '#ecf0f1', color: '#3498db' },
                              }}
                              title="View Preview"
                            >
                              📄
                            </IconButton>
                            <IconButton
                              onClick={() => handleEdit(marksheet)}
                              sx={{
                                color: '#3498db',
                                p: { xs: 0.5, md: 1 },
                                borderRadius: '50%',
                                '&:hover': { backgroundColor: '#bbdefb', transform: 'scale(1.1)' },
                              }}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(marksheet._id)}
                              sx={{
                                color: '#e74c3c',
                                p: { xs: 0.5, md: 1 },
                                borderRadius: '50%',
                                '&:hover': { backgroundColor: '#f5b7b1', transform: 'scale(1.1)' },
                              }}
                              title="Delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={handleDownload}
                              sx={{
                                color: '#2ecc71',
                                p: { xs: 0.5, md: 1 },
                                borderRadius: '50%',
                                '&:hover': { backgroundColor: '#a7f3d0', transform: 'scale(1.1)' },
                              }}
                              title="Download JPG"
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#34495e',
                      '&.Mui-selected': {
                        backgroundColor: '#3498db',
                        color: '#fff',
                      },
                      '&:hover': { backgroundColor: '#bbdefb' },
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  mt: 2,
                  color: '#34495e',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  textAlign: 'center',
                }}
              >
                Records: {filteredMarksheets.length} of {marksheetsList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={isPopupOpen}
        onClose={handleClosePopup}
        maxWidth="md" // Increased to md for more space
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            animation: 'popIn 0.5s ease-out',
            maxHeight: '90vh', // Prevent overflow
            overflowY: 'auto', // Enable scrolling if needed
          },
        }}
      >
        {selectedMarksheet ? (
          <>
            <DialogTitle
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                bgcolor: 'linear-gradient(90deg, #3498db, #2980b9)',
                color: '#fff',
                p: 2,
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
              }}
            >
              Marksheet Preview
            </DialogTitle>
            <DialogContent sx={{ p: 3, background: '#f9fbfd' }}>
              <Box
                sx={{
                  height: { xs: '300px', md: '400px' },
                  bgcolor: '#ecf0f1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px solid #ddd',
                }}
              >
                <div
                  ref={previewRef}
                  style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: { xs: '250px', md: '350px' },
                    fontFamily: 'Arial, sans-serif',
                    backgroundImage: selectedMarksheet.backgroundImage ? `url(${selectedMarksheet.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.3rem', color: '#2c3e50' }}>{selectedMarksheet.template || 'Report Card'}</h2>
                    <p style={{ fontSize: '1rem', color: '#34495e' }}>Student: {selectedMarksheet.studentName}</p>
                    <p style={{ fontSize: '1rem', color: '#34495e' }}>Exam Center: {selectedMarksheet.examCenter}</p>
                  </div>
                </div>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center', background: '#f9fbfd', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <Button
                onClick={handleClosePopup}
                color="error"
                variant="contained"
                sx={{
                  borderRadius: '25px',
                  textTransform: 'none',
                  padding: '8px 20px',
                  fontWeight: 600,
                  backgroundColor: '#e74c3c',
                  '&:hover': { backgroundColor: '#c0392b' },
                  animation: 'pulse 1.5s infinite',
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                bgcolor: 'linear-gradient(90deg, #3498db, #2980b9)',
                color: '#fff',
                p: 2,
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
              }}
            >
              {editId ? 'Edit Marksheet' : 'Add New Marksheet'}
            </DialogTitle>
            <DialogContent sx={{ p: 3, background: '#f9fbfd', maxHeight: '70vh', overflowY: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Template"
                    name="template"
                    value={newMarksheet.template}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Class"
                    name="class"
                    value={newMarksheet.class}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Section"
                    name="section"
                    value={newMarksheet.section}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Student Name"
                    name="studentName"
                    value={newMarksheet.studentName}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Exam Center"
                    name="examCenter"
                    value={newMarksheet.examCenter}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Body Text"
                    name="bodyText"
                    value={newMarksheet.bodyText}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Footer Text"
                    name="footerText"
                    value={newMarksheet.footerText}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Printing Date"
                    name="printingDate"
                    value={newMarksheet.printingDate}
                    onChange={handleInputChange}
                    type="date"
                    variant="outlined"
                    size="small"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: '#fff',
                        maxWidth: '100%', // Ensure it doesn't overflow
                        overflow: 'hidden',
                      },
                      '& .MuiInputBase-input': { padding: '8px 12px' }, // Adjust padding for date picker
                    }}
                    InputLabelProps={{ shrink: true }} // Ensure label doesn't overlap
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Header Image"
                    name="headerImage"
                    type="file"
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Left Logo"
                    name="leftLogo"
                    type="file"
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Right Logo"
                    name="rightLogo"
                    type="file"
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Left Sign"
                    name="leftSign"
                    type="file"
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Right Sign"
                    name="rightSign"
                    type="file"
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Background Image"
                    name="backgroundImage"
                    type="file"
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#fff' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 700, color: '#2c3e50', textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    Fields to Display on Marksheet
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.keys(newMarksheet.options).map((key) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <TextField
                          fullWidth
                          label={key === 'name' ? 'Student Name' :
                            key === 'fatherName' ? "Father's Name" :
                            key === 'motherName' ? "Mother's Name" :
                            key === 'examSession' ? 'Exam Session' :
                            key === 'admissionNo' ? 'Admission Number' :
                            key === 'division' ? 'Division' :
                            key === 'rank' ? 'Rank' :
                            key === 'rollNumber' ? 'Roll Number' :
                            key === 'photo' ? 'Photo' :
                            key === 'classSection' ? 'Class & Section' :
                            key === 'dob' ? 'Date of Birth' :
                            key === 'remark' ? 'Remarks' :
                            key === 'address' ? 'Address' :
                            key === 'subjectScores' ? 'Subject Scores' :
                            key === 'attendance' ? 'Attendance' :
                            key === 'totalMarks' ? 'Total Marks' :
                            'Grade'}
                          name={key}
                          type="checkbox"
                          checked={newMarksheet.options[key]}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          sx={{
                            mb: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #fff 0%, #f9fbfd 100%)',
                              '&:hover': { borderColor: '#3498db', boxShadow: '0 0 5px rgba(52, 152, 219, 0.3)' },
                            },
                            '& .MuiCheckbox-root': {
                              color: '#3498db',
                              '&.Mui-checked': { color: '#2980b9' },
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                p: 2,
                justifyContent: 'space-between',
                background: '#f9fbfd',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
              }}
            >
              <Button
                onClick={handleClosePopup}
                color="error"
                variant="contained"
                sx={{
                  borderRadius: '25px',
                  textTransform: 'none',
                  padding: '8px 20px',
                  fontWeight: 600,
                  backgroundColor: '#e74c3c',
                  '&:hover': { backgroundColor: '#c0392b' },
                  animation: 'pulse 1.5s infinite',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editId ? handleSaveEdit : handleSave}
                color="primary"
                variant="contained"
                sx={{
                  borderRadius: '25px',
                  textTransform: 'none',
                  padding: '8px 20px',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #3498db, #2980b9)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2980b9, #1abc9c)',
                    boxShadow: '0 5px 15px rgba(52, 152, 219, 0.6)',
                  },
                  animation: 'bounce 0.8s ease-out',
                }}
              >
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
        sx={{ '& .MuiSnackbarContent-root': { borderRadius: '12px' } }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%', fontWeight: 500 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
      {downloadError && (
        <Typography sx={{ color: '#e74c3c', mt: 2, textAlign: 'center', fontWeight: 500 }}>{downloadError}</Typography>
      )}
    </Box>
  );
};

// CSS Animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes popIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default MarksheetDesigner;