import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import Select from 'react-select';
import { createTeacherForm, clearTeacherFormError } from '../../redux/TeacherAllRelated/formHandle';
import { setFormData, resetForm } from '../../redux/TeacherAllRelated/formSlice';

const TeacherForm = () => {
  const dispatch = useDispatch();
  const { formData, loading, error } = useSelector((state) => state.teacherForm);
  const { currentUser } = useSelector((state) => state.user || {});
  const adminID = currentUser?._id || '681586cd99e5ea0012e4ea1c';

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState(null);

  // References for all fields
  const refs = {
    fullName: useRef(null),
    gender: useRef(null),
    dateOfBirth: useRef(null),
    bloodGroup: useRef(null),
    religion: useRef(null),
    nationality: useRef(null),
    maritalStatus: useRef(null),
    mobileNumber: useRef(null),
    email: useRef(null),
    currentAddress: useRef(null),
    permanentAddress: useRef(null),
    emergencyContact: useRef(null),
    highestQualification: useRef(null),
    specialization: useRef(null),
    certifications: useRef(null),
    experience: useRef(null),
    teacherId: useRef(null),
    joiningDate: useRef(null),
    department: useRef(null),
    designation: useRef(null),
    salary: useRef(null),
    employmentType: useRef(null),
    status: useRef(null),
    username: useRef(null),
    password: useRef(null),
    profilePhoto: useRef(null),
    resume: useRef(null),
    certificates: useRef(null),
    submit: useRef(null),
  };

  // Field order for navigation
  const fieldOrder = [
    'fullName',
    'gender',
    'dateOfBirth',
    'bloodGroup',
    'religion',
    'nationality',
    'maritalStatus',
    'mobileNumber',
    'email',
    'currentAddress',
    'permanentAddress',
    'emergencyContact',
    'highestQualification',
    'specialization',
    'certifications',
    'experience',
    'teacherId',
    'joiningDate',
    'department',
    'designation',
    'salary',
    'employmentType',
    'status',
    'username',
    'password',
    'profilePhoto',
    'resume',
    'certificates',
    'submit',
  ];

  // Dropdown options
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];
  const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
  ];
  const employmentTypeOptions = [
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Contract', label: 'Contract' },
  ];
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      dispatch(clearTeacherFormError());
    }
    return () => {
      dispatch(resetForm());
    };
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = ['experience', 'salary'].includes(name) ? String(value) : value;
    dispatch(setFormData({ ...formData, [name]: processedValue }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    dispatch(setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'profilePhoto') setProfilePhoto(file);
      if (type === 'resume') setResume(file);
      if (type === 'certificates') setCertificates(file);
    }
  };

  const validateForm = () => {
    if (!adminID) return 'Admin ID is required';
    if (!formData.fullName?.trim()) return 'Full Name is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.dateOfBirth) return 'Date of Birth is required';
    if (!formData.nationality?.trim()) return 'Nationality is required';
    if (!formData.mobileNumber?.trim()) return 'Mobile Number is required';
    if (!/^\d{10}$/.test(formData.mobileNumber)) return 'Mobile Number must be 10 digits';
    if (!formData.email?.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid Email format';
    if (!formData.currentAddress?.trim()) return 'Current Address is required';
    if (!formData.highestQualification?.trim()) return 'Highest Qualification is required';
    if (!formData.experience && formData.experience !== '0') return 'Experience is required';
    if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) return 'Experience must be a valid number';
    if (!formData.teacherId?.trim()) return 'Teacher ID is required';
    if (!formData.joiningDate) return 'Joining Date is required';
    if (!formData.department?.trim()) return 'Department is required';
    if (!formData.designation?.trim()) return 'Designation is required';
    if (!formData.salary && formData.salary !== '0') return 'Salary is required';
    if (isNaN(Number(formData.salary)) || Number(formData.salary) < 0) return 'Salary must be a valid number';
    if (!formData.employmentType) return 'Employment Type is required';
    if (!formData.status) return 'Status is required';
    if (!formData.username?.trim()) return 'Username is required';
    if (!formData.password?.trim()) return 'Password is required';
    if (!profilePhoto) return 'Profile Photo is required';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.warn(validationError, { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!formData || Object.keys(formData).length === 0) {
      toast.error('Form data is empty', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formDataToSend.append(key, String(value));
      }
    });
    formDataToSend.append('role', 'Teacher');
    if (profilePhoto) formDataToSend.append('profilePhoto', profilePhoto);
    if (resume) formDataToSend.append('resume', resume);
    if (certificates) formDataToSend.append('certificates', certificates);

    console.log('FormData entries:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const action = await dispatch(createTeacherForm({ adminID, formData: formDataToSend }));
      if (action.type === 'teacherForm/getSuccess') {
        toast.success('Teacher form submitted successfully', { position: 'top-right', autoClose: 3000 });
        setProfilePhoto(null);
        setResume(null);
        setCertificates(null);
      } else {
        toast.error(`Failed to submit teacher form: ${action.payload || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(`Failed to submit teacher form: ${err.message || 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e, currentField) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentIndex = fieldOrder.indexOf(currentField);
      const nextField = fieldOrder[currentIndex + 1];

      if (nextField) {
        const nextRef = refs[nextField].current;
        if (nextField === 'submit') {
          nextRef.focus();
        } else if (['gender', 'maritalStatus', 'employmentType', 'status'].includes(nextField)) {
          // Focus react-select input
          const selectInput = nextRef?.querySelector('input');
          if (selectInput) selectInput.focus();
        } else {
          nextRef?.focus();
        }
      }
    }
  };

  const styles = {
    card: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333',
      marginBottom: 4,
    },
    sectionTitle: {
      fontWeight: 'bold',
      color: '#444',
      marginBottom: 2,
    },
    input: {
      marginBottom: 2,
    },
    label: {
      fontWeight: '500',
      color: '#333',
      marginBottom: 1,
    },
    fileInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    submitButton: {
      backgroundColor: '#333333',
      color: 'white',
      padding: '12px 24px',
      fontWeight: 'bold',
      borderRadius: '5px',
      '&:hover': {
        backgroundColor: '#555555',
      },
    },
    selectContainer: {
      marginBottom: 2,
    },
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 56,
      minHeight: 56,
      borderRadius: 4,
      borderColor: '#ccc',
      boxShadow: 'none',
      '&:hover': { borderColor: '#888' },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <Box component="form" sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <ToastContainer />
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h4" sx={styles.title}>
            Teacher Registration Form
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                🧍‍♂️ Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'fullName')}
                inputRef={refs.fullName}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div ref={refs.gender} style={styles.selectContainer}>
                <Select
                  name="gender"
                  options={genderOptions}
                  value={genderOptions.find((option) => option.value === formData.gender) || null}
                  onChange={(option, meta) => {
                    handleSelectChange(option, meta);
                    // Move focus to next field after selection
                    refs.dateOfBirth.current?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.target.value) {
                      // If no value is being typed, move to next field
                      handleKeyDown(e, 'gender');
                    }
                  }}
                  placeholder="Select Gender"
                  isSearchable
                  styles={selectStyles}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'dateOfBirth')}
                inputRef={refs.dateOfBirth}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'bloodGroup')}
                inputRef={refs.bloodGroup}
                fullWidth
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Religion"
                name="religion"
                value={formData.religion || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'religion')}
                inputRef={refs.religion}
                fullWidth
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nationality"
                name="nationality"
                value={formData.nationality || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'nationality')}
                inputRef={refs.nationality}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div ref={refs.maritalStatus} style={styles.selectContainer}>
                <Select
                  name="maritalStatus"
                  options={maritalStatusOptions}
                  value={maritalStatusOptions.find((option) => option.value === formData.maritalStatus) || null}
                  onChange={(option, meta) => {
                    handleSelectChange(option, meta);
                    refs.mobileNumber.current?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.target.value) {
                      handleKeyDown(e, 'maritalStatus');
                    }
                  }}
                  placeholder="Select Marital Status"
                  isSearchable
                  styles={selectStyles}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'mobileNumber')}
                inputRef={refs.mobileNumber}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'email')}
                inputRef={refs.email}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Current Address"
                name="currentAddress"
                value={formData.currentAddress || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'currentAddress')}
                inputRef={refs.currentAddress}
                fullWidth
                required
                multiline
                rows={3}
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'permanentAddress')}
                inputRef={refs.permanentAddress}
                fullWidth
                multiline
                rows={3}
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Emergency Contact"
                name="emergencyContact"
                value={formData.emergencyContact || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'emergencyContact')}
                inputRef={refs.emergencyContact}
                fullWidth
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                🎓 Academic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Highest Qualification"
                name="highestQualification"
                value={formData.highestQualification || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'highestQualification')}
                inputRef={refs.highestQualification}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Specialization"
                name="specialization"
                value={formData.specialization || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'specialization')}
                inputRef={refs.specialization}
                fullWidth
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Certifications"
                name="certifications"
                value={formData.certifications || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'certifications')}
                inputRef={refs.certifications}
                fullWidth
                multiline
                rows={3}
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience (Years)"
                name="experience"
                type="number"
                value={formData.experience || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'experience')}
                inputRef={refs.experience}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                💼 Professional Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teacher ID"
                name="teacherId"
                value={formData.teacherId || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'teacherId')}
                inputRef={refs.teacherId}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'joiningDate')}
                inputRef={refs.joiningDate}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                name="department"
                value={formData.department || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'department')}
                inputRef={refs.department}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                name="designation"
                value={formData.designation || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'designation')}
                inputRef={refs.designation}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'salary')}
                inputRef={refs.salary}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div ref={refs.employmentType} style={styles.selectContainer}>
                <Select
                  name="employmentType"
                  options={employmentTypeOptions}
                  value={employmentTypeOptions.find((option) => option.value === formData.employmentType) || null}
                  onChange={(option, meta) => {
                    handleSelectChange(option, meta);
                    refs.status.current?.querySelector('input')?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.target.value) {
                      handleKeyDown(e, 'employmentType');
                    }
                  }}
                  placeholder="Select Employment Type"
                  isSearchable
                  styles={selectStyles}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div ref={refs.status} style={styles.selectContainer}>
                <Select
                  name="status"
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === formData.status) || null}
                  onChange={(option, meta) => {
                    handleSelectChange(option, meta);
                    refs.username.current?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.target.value) {
                      handleKeyDown(e, 'status');
                    }
                  }}
                  placeholder="Select Status"
                  isSearchable
                  styles={selectStyles}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                🔐 Login Credentials
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'username')}
                inputRef={refs.username}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'password')}
                inputRef={refs.password}
                fullWidth
                required
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                📁 File Uploads
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={styles.label}>Profile Photo *</Typography>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFileChange(e, 'profilePhoto')}
                onKeyDown={(e) => handleKeyDown(e, 'profilePhoto')}
                ref={refs.profilePhoto}
                style={styles.fileInput}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={styles.label}>Resume</Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'resume')}
                onKeyDown={(e) => handleKeyDown(e, 'resume')}
                ref={refs.resume}
                style={styles.fileInput}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={styles.label}>Certificates</Typography>
              <input
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => handleFileChange(e, 'certificates')}
                onKeyDown={(e) => handleKeyDown(e, 'certificates')}
                ref={refs.certificates}
                style={styles.fileInput}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={styles.submitButton}
                onClick={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                ref={refs.submit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeacherForm;