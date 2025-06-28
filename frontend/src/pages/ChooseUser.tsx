import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Box, Container, CircularProgress, Backdrop } from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle.js';
import Popup from '../components/Popup.tsx';

const neonPulse = keyframes`
  0% { box-shadow: 0 0 10px #ff00ff; }
  50% { box-shadow: 0 0 25px #00ffff; }
  100% { box-shadow: 0 0 10px #ff00ff; }
`;

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector((state) => state.user);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (visitor === "guest") {
      const guestCredentials = {
        Admin: { email: "yogendra@12", password },
        Student: { rollNum: "1", studentName: "Dipesh Awasthi", password },
        Teacher: { email: "tony@12", password },
      };
      setLoader(true);
      dispatch(loginUser(guestCredentials[user], user));
    } else {
      const rolePaths = {
        Admin: '/Adminlogin',
        Student: '/Studentlogin',
        Teacher: '/Teacherlogin',
      };
      navigate(rolePaths[user]);
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      navigate(`/${currentRole}/dashboard`);
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Login Failed! Please try again.");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container>
        <Grid container spacing={3} justifyContent="center">
          {['Admin', 'Student', 'Teacher'].map((role, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard onClick={() => navigateHandler(role)}>
                <Box mb={2}>
                  {role === 'Admin' && <AccountCircle fontSize="large" />}
                  {role === 'Student' && <School fontSize="large" />}
                  {role === 'Teacher' && <Group fontSize="large" />}
                </Box>
                <StyledTypography>{role}</StyledTypography>
                <StyledText>
                  {role === 'Admin' && "Manage school operations, teachers, and students efficiently."}
                  {role === 'Student' && "Access your courses, assignments, and performance records."}
                  {role === 'Teacher' && "Create courses, track student progress, and provide feedback."}
                </StyledText>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Backdrop sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} open={loader}>
        <CircularProgress color="inherit" />
        <p style={{ marginTop: "10px" }}>Please Wait...</p>
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ChooseUser;

// Styled Components
const StyledContainer = styled.div`
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const StyledCard = styled(Paper)`
  padding: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${neonPulse} 3s infinite alternate;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 0px 15px rgba(198, 156, 94, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const StyledTypography = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffdd57;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
`;

const StyledText = styled.p`
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(90deg, #ffdd57, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 10px;
`;