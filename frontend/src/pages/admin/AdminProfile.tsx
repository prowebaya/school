import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Avatar, Box, Button, Card, CardContent, Collapse, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Grid, IconButton, TextField, Typography, useTheme 
} from '@mui/material';
import { 
  Edit, Delete, KeyboardArrowDown, KeyboardArrowUp, 
  School, VerifiedUser, Email, Lock 
} from '@mui/icons-material';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { authLogout } from '../../redux/userRelated/userSlice';
import { motion } from 'framer-motion';

const AdminProfile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
  const [showEdit, setShowEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    schoolName: currentUser.schoolName,
    password: ''
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const fields = formData.password 
      ? formData 
      : { ...formData, password: undefined };
    dispatch(updateUser(fields, currentUser._id, 'Admin'));
  };

  const handleDelete = () => {
    dispatch(deleteUser(currentUser._id, 'Admin'));
    dispatch(authLogout());
    navigate('/');
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: theme.palette.background.default }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          borderRadius: 4,
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
          boxShadow: theme.shadows[10]
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mr: 3,
                bgcolor: theme.palette.primary.main,
                boxShadow: theme.shadows[4]
              }}>
                <VerifiedUser sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" fontWeight="800">
                Admin Profile
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.03)'
                }}>
                  <ProfileItem 
                    icon={<Email />} 
                    label="Email" 
                    value={currentUser.email} 
                  />
                  <ProfileItem 
                    icon={<School />} 
                    label="School" 
                    value={currentUser.schoolName} 
                  />
                  <ProfileItem 
                    icon={<Lock />} 
                    label="Account Type" 
                    value="Administrator" 
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Collapse in={showEdit}>
                  <Box
                    component="form"
                    onSubmit={handleUpdate}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: theme.palette.background.paper,
                      boxShadow: theme.shadows[2]
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      sx={{ mb: 2 }}
                      InputProps={{ startAdornment: <Edit sx={{ mr: 1, color: 'action.active' }} /> }}
                    />
                    
                    <TextField
                      fullWidth
                      label="School Name"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                      sx={{ mb: 2 }}
                      InputProps={{ startAdornment: <School sx={{ mr: 1, color: 'action.active' }} /> }}
                    />
                    
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      sx={{ mb: 3 }}
                      InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} /> }}
                    />

                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        '&:hover': { transform: 'translateY(-2px)' }
                      }}
                    >
                      Update Profile
                    </Button>
                  </Box>
                </Collapse>
              </Grid>
            </Grid>

            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end' 
            }}>
              <Button
                variant="outlined"
                onClick={() => setShowEdit(!showEdit)}
                endIcon={showEdit ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                {showEdit ? 'Cancel Editing' : 'Edit Profile'}
              </Button>
              
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDeleteDialog(true)}
                startIcon={<Delete />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  boxShadow: theme.shadows[2]
                }}
              >
                Delete Account
              </Button>
            </Box>
          </CardContent>
        </Card>

        <DeleteDialog 
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleDelete}
        />
      </motion.div>
    </Box>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 2.5,
      p: 1.5,
      borderRadius: 2,
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.02)' 
        : 'rgba(0,0,0,0.02)'
    }}>
      <IconButton sx={{ mr: 2, color: theme.palette.primary.main }}>
        {icon}
      </IconButton>
      <Box>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </Box>
    </Box>
  );
};

const DeleteDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 700 }}>Confirm Account Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          sx={{ ml: 2 }}
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminProfile;