import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdmitCards, createAdmitCard, clearAdmitCardError } from '../../../redux/examRelated/admit-card-actions';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AdmitCardPage = () => {
  const [formData, setFormData] = useState({
    template: '',
    studentName: '',
    examName: '',
    examDate: '',
    examCenter: '',
    footerText: '',
    printingDate: '',
    leftLogo: null,
    rightLogo: null,
    sign: null,
    backgroundImage: null,
    subjects: [{ subject: '', date: '' }],
    options: {
      name: true,
      fatherName: false,
      motherName: false,
      admissionNo: true,
      rollNumber: true,
      dob: false,
      gender: false,
      photo: false,
    },
  });

  const [selectedAdmitCard, setSelectedAdmitCard] = useState(null);
  const [downloadError, setDownloadError] = useState(null);
  const [isHtml2CanvasLoaded, setIsHtml2CanvasLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const previewRef = useRef(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const admitCardState = useSelector((state) => state.admitCard || { admitCardsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { admitCardsList, loading, error } = admitCardState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllAdmitCards(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view admit cards', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearAdmitCardError());
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, [name]: event.target.result });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      options: { ...formData.options, [name]: checked },
    });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subject: '', date: '' }],
    });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to save admit cards', severity: 'error' });
      return;
    }
    if (!formData.template || !formData.studentName || !formData.examName || !formData.examDate || !formData.examCenter) {
      setSnack({ open: true, message: 'Required fields missing', severity: 'warning' });
      return;
    }
    dispatch(createAdmitCard(formData, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Admit card saved successfully', severity: 'success' });
        setFormData({
          template: '',
          studentName: '',
          examName: '',
          examDate: '',
          examCenter: '',
          footerText: '',
          printingDate: '',
          leftLogo: null,
          rightLogo: null,
          sign: null,
          backgroundImage: null,
          subjects: [{ subject: '', date: '' }],
          options: {
            name: true,
            fatherName: false,
            motherName: false,
            admissionNo: true,
            rollNumber: true,
            dob: false,
            gender: false,
            photo: false,
          },
        });
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to save', severity: 'error' });
      });
  };

  const handleDownload = () => {
    setDownloadError(null);
    if (!previewRef.current) {
      setDownloadError('Preview not available.');
      return;
    }
    if (!window.html2canvas || !isHtml2CanvasLoaded) {
      setDownloadError('html2canvas not loaded.');
      return;
    }
    window.html2canvas(previewRef.current, { scale: 2 })
      .then((canvas) => {
        const link = document.createElement('a');
        link.download = `${selectedAdmitCard?.template || 'admitcard'}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
      })
      .catch((error) => {
        setDownloadError('Failed to generate JPG: ' + error.message);
      });
  };

  // Filter admit cards based on search term
  const filteredAdmitCards = admitCardsList.filter((admitCard) =>
    admitCard.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admitCard.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admitCard.examName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: { xs: 1, md: 2 }, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#1a2526',
          mb: { xs: 2, md: 4 },
          fontSize: { xs: '1.5rem', md: '2.125rem' },
        }}
      >
        Admit Card Designer
      </Typography>
      <Grid container spacing={2}>
        {/* Design Form */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Design Admit Card</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Template"
                  name="template"
                  value={formData.template}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                />
                <TextField
                  label="Student Name"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                />
                <TextField
                  label="Exam Name"
                  name="examName"
                  value={formData.examName}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                />
                <TextField
                  label="Exam Date"
                  name="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Exam Center"
                  name="examCenter"
                  value={formData.examCenter}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                />
                {formData.subjects.map((subjectData, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      label={`Subject ${index + 1}`}
                      value={subjectData.subject}
                      onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                      fullWidth
                      size="small"
                      variant="outlined"
                    />
                    <TextField
                      label="Date"
                      type="date"
                      value={subjectData.date}
                      onChange={(e) => handleSubjectChange(index, 'date', e.target.value)}
                      fullWidth
                      size="small"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                    {index === formData.subjects.length - 1 && (
                      <IconButton
                        onClick={addSubject}
                        sx={{ color: '#1976d2', '&:hover': { color: '#1565c0' } }}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <TextField
                  label="Footer Text"
                  name="footerText"
                  value={formData.footerText}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
                <TextField
                  label="Printing Date"
                  name="printingDate"
                  type="date"
                  value={formData.printingDate}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
                {/* File Uploads with Labels and Previews */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2">Upload Images</Typography>
                  <label>
                    <input
                      type="file"
                      name="leftLogo"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      size="small"
                    >
                      Upload Left Logo
                    </Button>
                    {formData.leftLogo && <Typography variant="caption">Left Logo: Uploaded</Typography>}
                  </label>
                  <label>
                    <input
                      type="file"
                      name="rightLogo"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      size="small"
                    >
                      Upload Right Logo
                    </Button>
                    {formData.rightLogo && <Typography variant="caption">Right Logo: Uploaded</Typography>}
                  </label>
                  <label>
                    <input
                      type="file"
                      name="sign"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      size="small"
                    >
                      Upload Signature
                    </Button>
                    {formData.sign && <Typography variant="caption">Signature: Uploaded</Typography>}
                  </label>
                  <label>
                    <input
                      type="file"
                      name="backgroundImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      size="small"
                    >
                      Upload Background
                    </Button>
                    {formData.backgroundImage && <Typography variant="caption">Background: Uploaded</Typography>}
                  </label>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Options to Include</Typography>
                  <Grid container spacing={1}>
                    {Object.keys(formData.options).map((key) => (
                      <Grid item xs={6} key={key}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <input
                            type="checkbox"
                            name={key}
                            checked={formData.options[key]}
                            onChange={handleCheckboxChange}
                          />
                          <Typography variant="body2">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
                  sx={{ mt: 2, py: 1 }}
                >
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Admit Card List and Preview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Admit Card List</Typography>
              {/* Search Bar */}
              <TextField
                label="Search Admit Cards"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {loading ? (
                  <Typography textAlign="center">Loading...</Typography>
                ) : filteredAdmitCards.length === 0 ? (
                  <Typography textAlign="center">No admit cards found</Typography>
                ) : (
                  filteredAdmitCards.map((admitCard) => (
                    <Card
                      key={admitCard._id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        '&:hover': { bgcolor: '#e0f7fa' },
                      }}
                    >
                      <Typography
                        sx={{ color: '#1976d2', cursor: 'pointer', p: 1 }}
                        onClick={() => setSelectedAdmitCard(admitCard)}
                      >
                        {admitCard.template}
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleDownload}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Download JPG
                      </Button>
                    </Card>
                  ))
                )}
              </Box>
              {downloadError && (
                <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
                  {downloadError}
                </Typography>
              )}
              {selectedAdmitCard && (
                <Box
                  ref={previewRef}
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'white',
                    border: '2px solid #000',
                    borderRadius: 2,
                    boxShadow: 2,
                    width: '100%',
                    maxWidth: { xs: '100%', md: '800px' },
                    margin: '0 auto',
                    fontFamily: 'Arial, sans-serif',
                    backgroundImage: selectedAdmitCard.backgroundImage ? `url(${selectedAdmitCard.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '2px solid #000' }}>
                    {selectedAdmitCard.leftLogo && (
                      <img src={selectedAdmitCard.leftLogo} alt="Left Logo" style={{ width: 50, height: 50 }} />
                    )}
                    <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {selectedAdmitCard.examCenter || 'TP International CBSE School'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Kamacha, Varanasi</Typography>
                      <Typography variant="caption" color="text.secondary">(0542)-XXXXXXXXXX</Typography>
                    </Box>
                    {selectedAdmitCard.rightLogo && (
                      <img src={selectedAdmitCard.rightLogo} alt="Right Logo" style={{ width: 50, height: 50 }} />
                    )}
                  </Box>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {selectedAdmitCard.template || 'Admit Card'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Exam: {selectedAdmitCard.examName || 'Annual Exam'} | Date: {selectedAdmitCard.examDate || '2025-06-22'}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', bgcolor: '#90EE90', p: 1, borderRadius: 1 }}>
                      Candidate Details
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                      <Box>
                        {selectedAdmitCard.options.name && (
                          <Typography variant="body2"><strong>Name:</strong> {selectedAdmitCard.studentName || 'Shri Narayan Pandey'}</Typography>
                        )}
                        {selectedAdmitCard.options.fatherName && (
                          <Typography variant="body2"><strong>Father's Name:</strong> Shri Anupam Kumar Pandey</Typography>
                        )}
                        {selectedAdmitCard.options.motherName && (
                          <Typography variant="body2"><strong>Mother's Name:</strong> Smt. Sushma Pandey</Typography>
                        )}
                      </Box>
                      <Box>
                        {selectedAdmitCard.options.admissionNo && (
                          <Typography variant="body2"><strong>Admission No:</strong> 1045HG</Typography>
                        )}
                        {selectedAdmitCard.options.rollNumber && (
                          <Typography variant="body2"><strong>Roll No:</strong> 31</Typography>
                        )}
                        {selectedAdmitCard.options.dob && (
                          <Typography variant="body2"><strong>DOB:</strong> 24-06-2005</Typography>
                        )}
                        {selectedAdmitCard.options.gender && (
                          <Typography variant="body2"><strong>Gender:</strong> Male</Typography>
                        )}
                      </Box>
                    </Box>
                    {selectedAdmitCard.options.photo && selectedAdmitCard.sign && (
                      <img src={selectedAdmitCard.sign} alt="Photo" style={{ width: 100, height: 100, objectFit: 'contain', mt: 1 }} />
                    )}
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', bgcolor: '#90EE90', p: 1, borderRadius: 1 }}>
                      Exam Schedule
                    </Typography>
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                      <Box sx={{ minWidth: 300, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                        {selectedAdmitCard.subjects.map((subjectData, index) => (
                          <React.Fragment key={index}>
                            <Typography variant="body2" sx={{ border: '1px solid #ddd', p: 1 }}>
                              {subjectData.subject || `Subject ${index + 1}`}
                            </Typography>
                            <Typography variant="body2" sx={{ border: '1px solid #ddd', p: 1 }}>
                              {subjectData.date || 'N/A'}
                            </Typography>
                          </React.Fragment>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ border: '2px solid #000', p: 1, display: 'inline-block' }}>
                      {selectedAdmitCard.footerText || 'This admit card is valid only with a valid photo ID.'}
                    </Typography>
                    {selectedAdmitCard.sign && (
                      <img src={selectedAdmitCard.sign} alt="Sign" style={{ width: 100, height: 50, objectFit: 'contain', mt: 1 }} />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date: {selectedAdmitCard.printingDate || '2025-06-22 04:55 PM IST'}
                    </Typography>
                  </Box>
                </Box>
              )}
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

export default AdmitCardPage;