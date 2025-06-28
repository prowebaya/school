import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { 
  Paper, CircularProgress, Typography, Box, Card, CardContent, Container,
  useTheme, keyframes, styled 
} from '@mui/material';
import TableViewTemplate from './TableViewTemplate.tsx';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
  borderRadius: '16px',
  boxShadow: theme.shadows[10],
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}));

const SeeNotice = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        } else {
            dispatch(getAllNotices(currentUser.school._id, "Notice"));
        }
    }, [dispatch, currentRole, currentUser]);

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170, align: 'left' },
        { id: 'details', label: 'Details', minWidth: 200, align: 'left' },
        { id: 'date', label: 'Date', minWidth: 120, align: 'center' },
    ];

    const noticeRows = noticesList?.map((notice) => ({
        title: notice.title,
        details: notice.details,
        date: new Date(notice.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }),
        id: notice._id,
    }));

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Box textAlign="center" mb={6}>
                <Typography 
                    variant="h3" 
                    sx={{
                        fontWeight: 800,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <NotificationsActiveIcon fontSize="large" />
                    Latest Notices
                </Typography>
            </Box>

            {loading ? (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="400px"
                    sx={{
                        background: `linear-gradient(-45deg, ${theme.palette.background.default}, ${theme.palette.action.selected})`,
                        borderRadius: 4,
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <CircularProgress 
                        size={80} 
                        thickness={2.5}
                        sx={{
                            animation: `${gradient} 2s ease infinite`,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'content-box',
                            borderRadius: '50%',
                            padding: '4px'
                        }}
                    />
                </Box>
            ) : response || !noticesList?.length ? (
                <StyledCard>
                    <CardContent sx={{ py: 6, textAlign: 'center' }}>
                        <EmojiObjectsIcon 
                            sx={{ 
                                fontSize: 80, 
                                color: 'text.secondary',
                                mb: 3 
                            }} 
                        />
                        <Typography 
                            variant="h5" 
                            color="textSecondary"
                            sx={{ mb: 2 }}
                        >
                            No Notices Found
                        </Typography>
                        <Typography 
                            variant="body1" 
                            color="textSecondary"
                            sx={{ maxWidth: 500, mx: 'auto' }}
                        >
                            Ready to make an announcement? Create your first notice to keep everyone informed!
                        </Typography>
                    </CardContent>
                </StyledCard>
            ) : (
                <Paper 
                    elevation={8} 
                    sx={{ 
                        borderRadius: 4,
                        background: theme.palette.mode === 'dark' 
                            ? 'linear-gradient(to right bottom, #1a1a1a,rgb(43, 5, 87))' 
                            : 'linear-gradient(to right bottom,rgb(236, 197, 70),rgb(111, 131, 248))',
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        '& .MuiTableCell-root': {
                            py: 2.5
                        }
                    }}
                >
                    <TableViewTemplate 
                        columns={noticeColumns} 
                        rows={noticeRows}
                        sx={{
                            '& .MuiTableHead-root': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                '& .MuiTableCell-head': {
                                    color: 'common.white',
                                    fontSize: '1.1rem',
                                    fontWeight: 600
                                }
                            },
                            '& .MuiTableRow-root': {
                                '&:nth-of-type(even)': {
                                    backgroundColor: theme.palette.action.hover
                                },
                                '&:hover': {
                                    backgroundColor: theme.palette.action.selected
                                }
                            }
                        }}
                    />
                </Paper>
            )}
        </Container>
    );
};

export default SeeNotice;