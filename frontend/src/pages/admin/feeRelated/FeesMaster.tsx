import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import {
  fetchFeesMasters,
  addFeesMaster,
  updateFeesMaster,
  deleteFeesMaster,
  fetchFeeGroups,
  fetchFeeTypes,
} from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../../redux/store';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  background-color: #e8c897;
  min-height: 100vh;
`;

const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2d3748;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #4299e1;
  color: white;
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #2d3748;
`;

const ActionButton = styled.button`
  background-color: #48bb78;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.25rem;
  transition: all 0.2s ease;
  &:hover {
    background-color: #38a169;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #f56565;
  &:hover {
    background-color: #e53e3e;
  }
`;

const SaveButton = styled(ActionButton)`
  width: 100px;
`;

const RecordsCount = styled.div`
  margin-top: 1rem;
  color: #718096;
  font-size: 0.875rem;
`;

const FeesMaster = () => {
  const dispatch = useDispatch();
  const { feesMasters = [], feeGroups = [], feeTypes = [], loading, error } = useSelector((state) => state.admissionForms);
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;

  const [formData, setFormData] = useState({
    feesGroup: '',
    feesType: '',
    dueDate: '',
    amount: '',
    fineType: 'None',
    percentage: '',
    fixAmount: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchFeesMasters(adminID));
      dispatch(fetchFeeGroups(adminID));
      dispatch(fetchFeeTypes(adminID));
    } else {
      toast.error('Please log in to manage fees masters', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.feesGroup || !formData.feesType || !formData.dueDate || !formData.amount) {
      toast.error('Please fill all required fields', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!adminID) {
      toast.error('Please log in to perform this action', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (formData.fineType === 'Percentage' && !formData.percentage) {
      toast.error('Percentage is required for fine type Percentage', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (formData.fineType === 'Fix Amount' && !formData.fixAmount) {
      toast.error('Fix Amount is required for fine type Fix Amount', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const payload = { ...formData, adminID };

    if (editingId) {
      dispatch(updateFeesMaster(editingId, payload)).then(() => {
        toast.success('Fees master updated successfully', { position: 'top-right', autoClose: 3000 });
        setFormData({
          feesGroup: '',
          feesType: '',
          dueDate: '',
          amount: '',
          fineType: 'None',
          percentage: '',
          fixAmount: '',
        });
        setEditingId(null);
      });
    } else {
      dispatch(addFeesMaster(payload)).then(() => {
        toast.success('Fees master created successfully', { position: 'top-right', autoClose: 3000 });
        setFormData({
          feesGroup: '',
          feesType: '',
          dueDate: '',
          amount: '',
          fineType: 'None',
          percentage: '',
          fixAmount: '',
        });
      });
    }
  };

  const handleEdit = (feesMaster) => {
    setFormData({
      feesGroup: feesMaster.feesGroup._id,
      feesType: feesMaster.feesType._id,
      dueDate: feesMaster.dueDate.split('T')[0],
      amount: feesMaster.amount.toString(),
      fineType: feesMaster.fineType,
      percentage: feesMaster.percentage ? feesMaster.percentage.toString() : '',
      fixAmount: feesMaster.fixAmount ? feesMaster.fixAmount.toString() : '',
    });
    setEditingId(feesMaster._id);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      toast.error('Please log in to perform this action', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (window.confirm('Are you sure you want to delete this fees master?')) {
      dispatch(deleteFeesMaster(id, adminID)).then(() => {
        toast.success('Fees master deleted successfully', { position: 'top-right', autoClose: 3000 });
      });
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header>Add Fees Master : 2024-25</Header>

        {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <FormContainer>
          <form onSubmit={handleSubmit}>
            <FormRow>
              <InputGroup>
                <Label>Fees Group *</Label>
                <Select
                  value={formData.feesGroup}
                  onChange={(e) => setFormData({ ...formData, feesGroup: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  {feeGroups.map((group) => (
                    <option key={group._id} value={group._id}>{group.name}</option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <Label>Fees Type *</Label>
                <Select
                  value={formData.feesType}
                  onChange={(e) => setFormData({ ...formData, feesType: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  {feeTypes.map((type) => (
                    <option key={type._id} value={type._id}>{type.name}</option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>Amount ($) *</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </InputGroup>
            </FormRow>

            <FormRow>
              <InputGroup>
                <Label>Fine Type *</Label>
                <Select
                  value={formData.fineType}
                  onChange={(e) => setFormData({ ...formData, fineType: e.target.value })}
                >
                  <option value="None">None</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Fix Amount">Fix Amount</option>
                </Select>
              </InputGroup>

              {formData.fineType === 'Percentage' && (
                <InputGroup>
                  <Label>Percentage (%) *</Label>
                  <Input
                    type="number"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    required
                  />
                </InputGroup>
              )}

              {formData.fineType === 'Fix Amount' && (
                <InputGroup>
                  <Label>Fix Amount ($) *</Label>
                  <Input
                    type="number"
                    value={formData.fixAmount}
                    onChange={(e) => setFormData({ ...formData, fixAmount: e.target.value })}
                    required
                  />
                </InputGroup>
              )}
            </FormRow>

            <SaveButton type="submit">{editingId ? 'Update' : 'Save'}</SaveButton>
          </form>
        </FormContainer>

        <Header>Fees Master List : 2024-25</Header>

        {loading ? (
          <div style={{ color: '#34495e', textAlign: 'center', padding: '1rem' }}>Loading...</div>
        ) : feesMasters.length === 0 ? (
          <div style={{ color: '#34495e', textAlign: 'center', padding: '1rem' }}>
            No fees masters found. {error ? `Error: ${error}` : 'Create a new fees master.'}
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>Fees Group</TableHeader>
                <TableHeader>Fees Code</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Fine Type</TableHeader>
                <TableHeader>Due Date</TableHeader>
                <TableHeader>Per Day</TableHeader>
                <TableHeader>Fine Amount</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {feesMasters.map((master) => (
                <tr key={master._id}>
                  <TableCell>{master.feesGroup?.name || '-'}</TableCell>
                  <TableCell>{master.feesCode}</TableCell>
                  <TableCell>${parseFloat(master.amount).toFixed(2)}</TableCell>
                  <TableCell>{master.fineType}</TableCell>
                  <TableCell>{new Date(master.dueDate).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{master.perDay}</TableCell>
                  <TableCell>
                    {master.fineAmount ? `$${parseFloat(master.fineAmount).toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEdit(master)}>Edit</ActionButton>
                    <DeleteButton onClick={() => handleDelete(master._id)}>Delete</DeleteButton>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <RecordsCount>Showing {feesMasters.length} records</RecordsCount>
      </Container>
    </>
  );
};

export default FeesMaster;