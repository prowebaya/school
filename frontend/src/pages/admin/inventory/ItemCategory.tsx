import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, InputAdornment, Snackbar, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllCategoryCards,
  createCategoryCard,
  updateCategoryCard,
  deleteCategoryCard,
  clearCategoryCardErrorAction 
} from '../../../redux/categoryRelated/categoryHandle';

const ItemCategoryCard: React.FC = () => {
  const [formData, setFormData] = useState({
    categoryCard: '',
    description: ''
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;
  const { categoryCardsList, loading, error } = useSelector((state) => state.categoryCard);

  useEffect(() => {
    if (adminID) {
      dispatch(getAllCategoryCards(adminID));
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearCategoryCardErrorAction());
    }
  }, [error, dispatch]);

  const resetForm = (): void => {
    setFormData({
      categoryCard: '',
      description: ''
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryCard.trim()) {
      setSnack({ open: true, message: 'CategoryCard name is required!', severity: 'warning' });
      return;
    }

    const payload = {
      categoryCard: formData.categoryCard.trim(),
      description: formData.description?.trim() || '',
      adminID: adminID || ''
    };

    const exists = categoryCardsList?.some(
      (cat) => cat.categoryCard.toLowerCase() === formData.categoryCard.trim().toLowerCase() &&
        cat._id !== editId
    );

    if (exists) {
      setSnack({ open: true, message: 'CategoryCard with this name already exists!', severity: 'warning' });
      return;
    }

    if (editId) {
      dispatch(updateCategoryCard(editId, payload))
        .then(() => {
          resetForm();
          dispatch(getAllCategoryCards(adminID));
          setSnack({ open: true, message: 'CategoryCard updated successfully', severity: 'success' });
        })
        .catch((err: Error) => console.error(err));
    } else {
      dispatch(createCategoryCard(payload))
        .then(() => {
          resetForm();
          dispatch(getAllCategoryCards(adminID));
          setSnack({ open: true, message: 'CategoryCard created successfully', severity: 'success' });
        })
        .catch((err: Error) => console.error(err));
    }
  };

  const handleEdit = (categoryCard) => {
    setEditId(categoryCard._id);
    setFormData({
      categoryCard: categoryCard.categoryCard,
      description: categoryCard.description || ''
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteCategoryCard(id, adminID))
      .then(() => {
        dispatch(getAllCategoryCards(adminID));
        setSnack({ open: true, message: 'CategoryCard deleted!', severity: 'info' });
      });
  };

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

  const filteredCategoryCards = Array.isArray(categoryCardsList)
    ? categoryCardsList.filter((categoryCard) =>
        (categoryCard.categoryCard && typeof categoryCard.categoryCard === 'string' &&
          categoryCard.categoryCard.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (categoryCard.description && typeof categoryCard.description === 'string' &&
          categoryCard.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  if (!currentUser) {
    return <Typography>Please log in to view category cards.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Form Section */}
      <Box sx={{
        width: '30%',
        p: 3,
        borderRadius: '12px',
        bgcolor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#333' }}>
          {editId ? 'Edit CategoryCard' : 'Add CategoryCard'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="CategoryCard Name *"
            name="categoryCard"
            value={formData.categoryCard}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, categoryCard: e.target.value })
            }
            fullWidth
            required
            sx={{ my: 1 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, description: e.target.value })
            }
            fullWidth
            multiline
            rows={2}
            sx={{ my: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#1a2526',
              '&:hover': { backgroundColor: '#2e3b3d' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
            }}
          >
            {editId ? 'Update' : 'Save'}
          </Button>
        </form>
      </Box>

      {/* Table Section */}
      <Box sx={{ width: '70%' }}>
        <Typography variant="h6">CategoryCard List</Typography>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setSearchQuery(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2, width: '240px' }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a2526' }}>
                <TableCell sx={{ color: '#fff' }}>CategoryCard</TableCell>
                <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategoryCards.map((categoryCard) => (
                <TableRow key={categoryCard._id}>
                  <TableCell>{categoryCard.categoryCard}</TableCell>
                  <TableCell>{categoryCard.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(categoryCard)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(categoryCard._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemCategoryCard;