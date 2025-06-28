import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLibrarians } from '../../redux/userRelated/userHandle';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    TextField,
    InputAdornment,
    IconButton,
    Fade,
    Grow,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
    marginTop: theme.spacing(3),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: 'linear-gradient(45deg, #9346eb 30%, #6a1b9a 90%)',
    '& .MuiTableCell-head': {
        color: '#fff',
        fontWeight: 600,
        fontSize: '1rem',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#f0f0f0',
        transform: 'translateY(-2px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '250px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#f9f9f9',
        },
        '&.Mui-focused': {
            backgroundColor: '#fff',
            boxShadow: '0 0 8px rgba(147, 70, 235, 0.2)',
        },
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#9346eb',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[300],
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9346eb',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9346eb',
    },
}));

const LibrariansList = () => {
    const dispatch = useDispatch();
    const { librarians, status, error } = useSelector((state) => state.user);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchLibrarians());
    }, [dispatch]);

    // Filter librarians based on search query
    const filteredLibrarians = librarians?.filter(
        (librarian) =>
            librarian.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            librarian.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Placeholder functions for edit and delete actions
    const handleEdit = (librarianId) => {
        console.log(`Edit librarian with ID: ${librarianId}`);
        // Add your edit logic here (e.g., navigate to an edit page)
    };

    const handleDelete = (librarianId) => {
        console.log(`Delete librarian with ID: ${librarianId}`);
        // Add your delete logic here (e.g., dispatch a delete action)
    };

    return (
        <Fade in timeout={600}>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PeopleIcon
                        sx={{
                            fontSize: 40,
                            color: '#9346eb',
                            mr: 1,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                                '50%': {
                                    transform: 'scale(1.1)',
                                    opacity: 0.7,
                                },
                                '100%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                            },
                        }}
                    />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#333',
                        }}
                    >
                        All Librarians
                    </Typography>
                </Box>

                {status === 'loading' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress size={40} sx={{ color: '#9346eb' }} />
                    </Box>
                )}

                {status === 'failed' && (
                    <Typography
                        sx={{
                            color: '#d32f2f',
                            textAlign: 'center',
                            fontWeight: 500,
                            my: 4,
                        }}
                    >
                        {error}
                    </Typography>
                )}

                {status === 'succeeded' && (
                    <>
                        <StyledTextField
                            placeholder="Search librarians..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#9346eb' }} />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                        />

                        {filteredLibrarians?.length > 0 ? (
                            <StyledTableContainer component={Paper}>
                                <Table>
                                    <StyledTableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </StyledTableHead>
                                    <TableBody>
                                        {filteredLibrarians.map((librarian) => (
                                            <Grow in timeout={500} key={librarian._id}>
                                                <StyledTableRow>
                                                    <TableCell>{librarian.name}</TableCell>
                                                    <TableCell>{librarian.email}</TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Edit Librarian">
                                                            <IconButton
                                                                onClick={() => handleEdit(librarian._id)}
                                                                sx={{
                                                                    color: '#1976d2',
                                                                    '&:hover': { color: '#1565c0' },
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete Librarian">
                                                            <IconButton
                                                                onClick={() => handleDelete(librarian._id)}
                                                                sx={{
                                                                    color: '#d32f2f',
                                                                    '&:hover': { color: '#b71c1c' },
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </StyledTableRow>
                                            </Grow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        ) : (
                            <Typography
                                sx={{
                                    textAlign: 'center',
                                    color: '#666',
                                    fontWeight: 500,
                                    my: 4,
                                }}
                            >
                                No librarians found.
                            </Typography>
                        )}

                        {filteredLibrarians?.length > 0 && (
                            <Typography sx={{ mt: 2, color: '#666' }}>
                                Total Librarians: {filteredLibrarians.length}
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Fade>
    );
};

export default LibrariansList;