import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { searchPayments } from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../../redux/store';

interface PaymentResult {
  type: string;
  id: string | number;
  paymentId: string;
  admissionNo: string;
  studentName: string;
  class: string;
  amount: number;
  paymentDate: string;
  submitDate?: string;
  dueDate?: string;
  status: string;
  feeType?: string;
}

const Container = styled.div`
  width: 90%;
  max-width: 500px;
  margin: 30px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #e8c897;
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const Heading = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #2c3e50;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
`;

const Required = styled.span`
  color: red;
`;

const Input = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4caf50;
  color: #fff;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #45a049;
  }
`;

const Icon = styled.span`
  margin-right: 5px;
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResultItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const ResultLabel = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const SearchFeesPayment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { searchResults = [], loading, error } = useSelector((state: RootState) => state.admissionForms);
  const adminID = currentUser?._id;

  const [paymentId, setPaymentId] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentId.trim()) {
      toast.error('Please enter a Payment ID', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!adminID) {
      toast.error('Please log in to search payments', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(searchPayments({ paymentId, adminID }));
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Heading>Search Fees Payment</Heading>
        <FormGroup>
          <Label>
            Payment ID <Required>*</Required>
          </Label>
          <Input
            type="text"
            placeholder="Enter Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Icon>🔍</Icon> Search
          </Button>
        </FormGroup>

        {loading && <div style={{ color: '#34495e', marginTop: '20px' }}>Loading...</div>}
        {error && <div style={{ color: '#e74c3c', marginTop: '20px' }}>{error}</div>}
        {searchResults.length > 0 && (
          <ResultsContainer>
            {searchResults.map((result: PaymentResult, index: number) => (
              <ResultItem key={index}>
                <p><ResultLabel>Type:</ResultLabel> {result.type}</p>
                <p><ResultLabel>Payment ID:</ResultLabel> {result.paymentId}</p>
                <p><ResultLabel>Admission No:</ResultLabel> {result.admissionNo}</p>
                <p><ResultLabel>Student Name:</ResultLabel> {result.studentName}</p>
                <p><ResultLabel>Class:</ResultLabel> {result.class}</p>
                <p><ResultLabel>Amount:</ResultLabel> ₹{result.amount}</p>
                <p><ResultLabel>Payment Date:</ResultLabel> {result.paymentDate}</p>
                {result.submitDate && <p><ResultLabel>Submit Date:</ResultLabel> {result.submitDate}</p>}
                {result.dueDate && <p><ResultLabel>Due Date:</ResultLabel> {result.dueDate}</p>}
                {result.feeType && <p><ResultLabel>Fee Type:</ResultLabel> {result.feeType}</p>}
                <p><ResultLabel>Status:</ResultLabel> {result.status}</p>
              </ResultItem>
            ))}
          </ResultsContainer>
        )}
        {!loading && !error && searchResults.length === 0 && paymentId && (
          <div style={{ color: '#34495e', marginTop: '20px' }}>No payments found for Payment ID: {paymentId}</div>
        )}
      </Container>
    </>
  );
};

export default SearchFeesPayment;