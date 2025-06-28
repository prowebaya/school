import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Modal,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import Select from 'react-select';
import { fetchTeachers, updateTeacher, deleteTeacher } from '../../redux/TeacherAllRelated/teacherManageActions';
import { setFormData, resetForm } from '../../redux/TeacherAllRelated/formSlice';
import { setSelectedTeacher, clearError } from '../../redux/TeacherAllRelated/teacherManageSlice';

const ManageTeacher = () => {
  const dispatch = useDispatch();
  const teacherManage = useSelector((state) => state.teacherManage ?? {});
  const { teachers = [], loading = false, error = null, selectedTeacher = null } = teacherManage;
  const teacherForm = useSelector((state) => state.teacherForm ?? {});
  const { formData = {} } = teacherForm;

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

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
    dispatch(fetchTeachers());
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const handleView = (teacher) => {
    dispatch(setSelectedTeacher(teacher));
    setOpenViewModal(true);
  };

  const handleEdit = (teacher) => {
    dispatch(setFormData(teacher));
    dispatch(setSelectedTeacher(teacher));
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTeacher(deleteId));
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    dispatch(setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const handleUpdate = () => {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formDataToSend.append(key, String(value));
      }
    });
    if (profilePhoto) formDataToSend.append('profilePhoto', profilePhoto);

    dispatch(updateTeacher(selectedTeacher?._id, formDataToSend)).then(() => {
      setOpenEditModal(false);
      dispatch(resetForm());
      setProfilePhoto(null);
    });
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto' }}>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <ToastContainer />
      <Card className="shadow-xl">
        <CardContent>
          <Typography variant="h4" className="text-center font-bold text-gray-800 mb-6">
            Manage Teachers
          </Typography>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            {loading ? (
              <Typography className="text-center text-gray-600">Loading...</Typography>
            ) : teachers.length === 0 ? (
              <Typography className="text-center text-gray-600">No teachers found.</Typography>
            ) : (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left text-gray-600">Full Name</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Teacher ID</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Email</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Department</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Status</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{teacher.fullName}</td>
                      <td className="py-2 px-4 border-b">{teacher.teacherId}</td>
                      <td className="py-2 px-4 border-b">{teacher.email}</td>
                      <td className="py-2 px-4 border-b">{teacher.department}</td>
                      <td className="py-2 px-4 border-b">{teacher.status}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex gap-2">
                          <IconButton color="primary" onClick={() => handleView(teacher)}>
                            <Visibility />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => handleEdit(teacher)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(teacher._id)}>
                            <Delete />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Teacher Details
          </Typography>
          {selectedTeacher && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <strong>Full Name:</strong> {selectedTeacher.fullName}
              </div>
              <div>
                <strong>Teacher ID:</strong> {selectedTeacher.teacherId}
              </div>
              <div>
                <strong>Email:</strong> {selectedTeacher.email}
              </div>
              <div>
                <strong>Department:</strong> {selectedTeacher.department}
              </div>
              <div>
                <strong>Status:</strong> {selectedTeacher.status}
              </div>
              <div>
                <strong>Profile Photo:</strong>
                {selectedTeacher.profilePhotoPath ? (
                  <img
                    src={`/Uploads/${selectedTeacher.profilePhotoPath}`}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded mt-2"
                  />
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          )}
          <Button
            variant="contained"
            className="mt-4 bg-gray-600 hover:bg-gray-700"
            onClick={() => setOpenViewModal(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Edit Teacher
          </Typography>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <div>
              <Select
                name="gender"
                options={genderOptions}
                value={genderOptions.find((option) => option.value === formData.gender) || null}
                onChange={handleSelectChange}
                placeholder="Select Gender"
                isSearchable
                className="mb-4"
              />
            </div>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Department"
              name="department"
              value={formData.department || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <div>
              <Select
                name="status"
                options={statusOptions}
                value={statusOptions.find((option) => option.value === formData.status) || null}
                onChange={handleSelectChange}
                placeholder="Select Status"
                isSearchable
                className="mb-4"
              />
            </div>
            <div>
              <Typography className="font-medium">Update Profile Photo</Typography>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdate}
              disabled={loading || !selectedTeacher?._id}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="outlined"
              className="border-gray-600 text-gray-600 hover:bg-gray-100"
              onClick={() => setOpenEditModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this teacher? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTeacher;