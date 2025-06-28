import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/userRelated/userHandle';
import { underControl } from '../../redux/userRelated/userSlice';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Fade,
    Grow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 500,
    margin: '40px auto',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
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

const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #9346eb 30%, #6a1b9a 90%)',
    borderRadius: '8px',
    padding: theme.spacing(1.5),
    color: '#fff',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(147, 70, 235, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(45deg, #6a1b9a 30%, #9346eb 90%)',
        boxShadow: '0 6px 20px rgba(147, 70, 235, 0.5)',
        transform: 'translateY(-2px)',
    },
    '&:disabled': {
        background: theme.palette.grey[400],
        boxShadow: 'none',
    },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
}));

const AddLibrarian = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, response, error } = useSelector((state) => state.user);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [loader, setLoader] = useState(false);

    const role = 'Librarian';
    const fields = { name, email, password, role };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate('/Admin/AddLibrarian');
            // Assuming fetchLibrarians is defined elsewhere
            // dispatch(fetchLibrarians());
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage('Network Error');
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Fade in timeout={600}>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 3 }}>
                <Grow in timeout={800}>
                    <StyledCard>
                        <CardContent sx={{ p: 4 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 3,
                                }}
                            >
                                <LibraryAddIcon
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
                                        textAlign: 'center',
                                    }}
                                >
                                    Add Librarian
                                </Typography>
                            </Box>
                            <form onSubmit={submitHandler}>
                                <StyledTextField
                                    fullWidth
                                    label="Name"
                                    placeholder="Enter librarian's name..."
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    autoComplete="name"
                                    required
                                    variant="outlined"
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Email"
                                    placeholder="Enter librarian's email..."
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    autoComplete="email"
                                    required
                                    variant="outlined"
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Password"
                                    placeholder="Enter librarian's password..."
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="new-password"
                                    required
                                    variant="outlined"
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <StyledButton type="submit" disabled={loader}>
                                        {loader ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Register Librarian'
                                        )}
                                    </StyledButton>
                                </Box>
                            </form>
                        </CardContent>
                    </StyledCard>
                </Grow>

                {/* Custom Popup Dialog */}
                <StyledDialog
                    open={showPopup}
                    onClose={() => setShowPopup(false)}
                    TransitionComponent={Grow}
                    transitionDuration={400}
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', bgcolor: '#9346eb', color: '#fff' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Notification
                        </Typography>
                        <IconButton onClick={() => setShowPopup(false)} sx={{ color: '#fff' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Typography
                            sx={{
                                color: status === 'failed' || status === 'error' ? '#d32f2f' : '#333',
                                textAlign: 'center',
                                fontWeight: 500,
                            }}
                        >
                            {message}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                        <Button
                            onClick={() => setShowPopup(false)}
                            sx={{
                                backgroundColor: '#9346eb',
                                color: '#fff',
                                borderRadius: '8px',
                                px: 3,
                                '&:hover': { backgroundColor: '#6a1b9a' },
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </StyledDialog>
            </Box>
        </Fade>
    );
};

export default AddLibrarian;