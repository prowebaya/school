import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Paper, Box, IconButton, CircularProgress, Typography, Card, CardContent, Fab, Tooltip
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle.js';
import { deleteUser } from '../../../redux/userRelated/userHandle.js';
import TableTemplate from '../../../components/TableTemplate.tsx';
import { GreenButton } from '../../../components/ButtonStyles.tsx';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate.tsx';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address)).then(() => {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        });
    };

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList?.length > 0 ? noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    }) : [];

    const NoticeButtonHaver = ({ row }) => (
        <IconButton onClick={() => deleteHandler(row.id, "Notice")} sx={{ '&:hover': { color: 'red' } }}>
            <DeleteIcon color="error" />
        </IconButton>
    );

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />,
            name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteSweepIcon color="error" />,
            name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#f9f9f9',
            minHeight: '100vh'
        }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress size={60} thickness={4} color="primary" />
                </Box>
            ) : (
                <>
                    <Card elevation={5} sx={{
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: "#333", textAlign: "center", mb: 2 }}>
                                Notices
                            </Typography>

                            {response ? (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <GreenButton variant="contained"
                                        onClick={() => navigate("/Admin/addnotice")}>
                                        Add Notice
                                    </GreenButton>
                                </Box>
                            ) : (
                                <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
                                    {Array.isArray(noticesList) && noticesList.length > 0 ? (
                                        <TableTemplate buttonHaver={NoticeButtonHaver} columns={noticeColumns} rows={noticeRows} />
                                    ) : (
                                        <Typography variant="h6" sx={{ textAlign: "center", color: "gray", mt: 3 }}>
                                            No notices found.
                                        </Typography>
                                    )}
                                </Paper>
                            )}
                        </CardContent>
                    </Card>

                    {/* Floating Action Button for Quick Actions */}
                    <Tooltip title="Add Notice" placement="left">
                        <Fab
                            color="primary"
                            sx={{
                                position: "fixed",
                                bottom: 20,
                                right: 20,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                "&:hover": { backgroundColor: "#1976d2" }
                            }}
                            onClick={() => navigate("/Admin/addnotice")}
                        >
                            <AddIcon />
                        </Fab>
                    </Tooltip>

                    {/* Speed Dial */}
                    <SpeedDialTemplate actions={actions} />
                </>
            )}
        </Box>
    );
};

export default ShowNotices;
