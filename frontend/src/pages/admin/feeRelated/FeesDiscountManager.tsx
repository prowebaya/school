import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../../../redux/feeRelated/discountActions';
import { RootState, AppDispatch } from '../../../redux/store';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #e8c897;
  min-height: 100vh;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #475569;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const SwitchButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  background-color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background-color: #6366f1;
    border-color: #6366f1;
    color: white;
  }
  &.active {
    background-color: #6366f1;
    color: white;
    border-color: #6366f1;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #6366f0 0%, #8b5cf6 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
  }
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  padding-left: 2.5rem;
  background: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e")
    no-repeat 1rem center/1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #f8fafc;
  padding: 1rem;
  text-align: left;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #1e293b;
  font-size: 0.9rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
`;

const FeesDiscountManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discounts, loading, error, status } = useSelector((state: RootState) => state.discounts);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage' as 'percentage' | 'amount',
    percentage: '',
    amount: '',
    useCount: '',
    expiry: '',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchDiscounts({ adminID, searchQuery }));
    } else {
      toast.error('Please log in to manage discounts', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID, searchQuery]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error('Name and code are required', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const discountData = {
        name: formData.name,
        code: formData.code,
        type: formData.type,
        percentage: formData.type === 'percentage' && formData.percentage ? Number(formData.percentage) : undefined,
        amount: formData.type === 'amount' && formData.amount ? Number(formData.amount) : undefined,
        useCount: formData.useCount ? Number(formData.useCount) : undefined,
        expiry: formData.expiry || undefined,
        description: formData.description || undefined,
      };
      console.log('Discount Data for Update:', discountData);

      if (editingId) {
        await dispatch(updateDiscount({ adminID, id: editingId, discountData })).unwrap();
        toast.success('Discount updated successfully', { position: 'top-right', autoClose: 3000 });
      } else {
        await dispatch(createDiscount({ adminID, discountData })).unwrap();
        toast.success('Discount created successfully', { position: 'top-right', autoClose: 3000 });
      }

      setFormData({
        name: '',
        code: '',
        type: 'percentage',
        percentage: '',
        amount: '',
        useCount: '',
        expiry: '',
        description: '',
      });
      setEditingId(null);
    } catch (error: any) {
      console.error('Update/Create Discount Error:', error);
      toast.error(`Failed to ${editingId ? 'update' : 'create'} discount: ${error.message || 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (discount: any) => {
    setFormData({
      name: discount.name,
      code: discount.code,
      type: discount.type,
      percentage: discount.percentage || '',
      amount: discount.amount || '',
      useCount: discount.useCount || '',
      expiry: discount.expiry || '',
      description: discount.description || '',
    });
    setEditingId(discount.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteDiscount({ adminID, id })).unwrap();
      toast.success('Discount deleted successfully', { position: 'top-right', autoClose: 3000 });
    } catch (error: any) {
      console.error('Delete Discount Error:', error);
      toast.error(`Failed to delete discount: ${error.message || 'Unknown error'}`, { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Header>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Manage Fee Discounts
      </Header>

      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <InputGroup>
              <Label>Discount Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Discount Code *</Label>
              <Input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </InputGroup>
          </FormGrid>

          <SwitchContainer>
            <SwitchButton
              type="button"
              className={formData.type === 'percentage' ? 'active' : ''}
              onClick={() => setFormData({ ...formData, type: 'percentage' })}
            >
              Percentage
            </SwitchButton>
            <SwitchButton
              type="button"
              className={formData.type === 'amount' ? 'active' : ''}
              onClick={() => setFormData({ ...formData, type: 'amount' })}
            >
              Fixed Amount
            </SwitchButton>
          </SwitchContainer>

          <FormGrid>
            {formData.type === 'percentage' ? (
              <InputGroup>
                <Label>Percentage (%) *</Label>
                <Input
                  type="number"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                  required
                />
              </InputGroup>
            ) : (
              <InputGroup>
                <Label>Amount ($) *</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </InputGroup>
            )}

            <InputGroup>
              <Label>Use Count</Label>
              <Input
                type="number"
                value={formData.useCount}
                onChange={(e) => setFormData({ ...formData, useCount: e.target.value })}
              />
            </InputGroup>

            <InputGroup>
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              />
            </InputGroup>
          </FormGrid>

          <PrimaryButton type="submit" disabled={loading}>
            {editingId ? 'Update Discount' : 'Create Discount'}
          </PrimaryButton>
        </form>
      </FormContainer>

      <TableContainer>
        <SearchInput
          type="text"
          placeholder="Search discounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <div>Loading...</div>
        ) : discounts.length === 0 ? (
          <div>No discounts available.</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Code</TableHeader>
                <TableHeader>Percentage</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Use Count</TableHeader>
                <TableHeader>Expiry Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.code}</TableCell>
                  <TableCell>{d.percentage || '-'}</TableCell>
                  <TableCell>{d.amount ? `$${d.amount}` : '-'}</TableCell>
                  <TableCell>{d.useCount || 'Unlimited'}</TableCell>
                  <TableCell>{d.expiry || '-'}</TableCell>
                  <TableCell>
                    <ActionButton
                      style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}
                      onClick={() => handleEdit(d)}
                    >
                      ✏️ Edit
                    </ActionButton>
                    <ActionButton
                      style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                      onClick={() => handleDelete(d.id)}
                    >
                      🗑️ Delete
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
};

export default FeesDiscountManager;