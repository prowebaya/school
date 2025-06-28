import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { fetchReminders, updateReminders } from '../../../redux/feeRelated/reminderActions';
import { RootState, AppDispatch } from '../../../redux/store';
import { getRemindersSuccess } from '../../../redux/feeRelated/reminderSlice';

console.log('Imported fetchReminders:', typeof fetchReminders, fetchReminders);
console.log('Imported updateReminders:', typeof updateReminders, updateReminders);

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
`;

const TableHeader = styled.th`
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #e9f5ff;
    transform: scale(1.02);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
`;

const Select = styled.select`
  padding: 0.3rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const Input = styled.input`
  border: 1px solid #ddd;
  padding: 0.3rem;
  border-radius: 4px;
  width: 80px;
`;

const SaveButton = styled.button`
  background: #3498db;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 1.5rem auto 0;
  box-shadow: 0 3px 6px rgba(52, 152, 219, 0.2);
  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

interface Reminder {
  id: string;
  action: 'Active' | 'Inactive';
  type: 'before' | 'after';
  days: number;
}

const FessReminder: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reminders, loading, error, status } = useSelector((state: RootState) => state.reminders);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  console.log('Redux reminders state:', { reminders, loading, error, status, adminID });

  useEffect(() => {
    if (typeof fetchReminders !== 'function') {
      console.error('fetchReminders is not a function');
      toast.error('Failed to load reminders: Action not found', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (adminID) {
      try {
        dispatch(fetchReminders({ adminID }));
      } catch (err: any) {
        console.error('Error dispatching fetchReminders:', err);
        toast.error(`Failed to load reminders: ${err.message || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } else {
      toast.error('Please log in to manage reminders', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const handleStatusChange = (id: string, field: keyof Reminder, value: string | number) => {
    const updatedReminders = reminders.map((reminder: Reminder) =>
      reminder.id === id ? { ...reminder, [field]: value } : reminder
    );
    dispatch(getRemindersSuccess(updatedReminders));
  };

  const handleSave = async () => {
    if (!reminders || reminders.length === 0) {
      toast.error('No reminders to save. Please add or load reminders.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const invalidReminder = reminders.find(
      (r: Reminder) => !r.id || !r.action || !r.type || !r.days || r.days < 1
    );
    if (invalidReminder) {
      toast.error('All reminders must have valid ID, action, type, and days (at least 1).', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      if (typeof updateReminders !== 'function') {
        throw new Error('updateReminders is not a function');
      }
      console.log('Saving reminders:', reminders);
      await dispatch(updateReminders({ adminID, reminders })).unwrap();
      toast.success('Changes saved successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (err: any) {
      console.error('Error saving reminders:', err);
      toast.error(`Failed to save reminders: ${err.message || 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Title>🎓 Fee Reminder Management</Title>

      <Table>
        <thead>
          <tr>
            <TableHeader>Action</TableHeader>
            <TableHeader>Reminder Type</TableHeader>
            <TableHeader>Days</TableHeader>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>Loading...</TableCell>
            </TableRow>
          ) : reminders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>No reminders available.</TableCell>
            </TableRow>
          ) : (
            reminders.map((reminder: Reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>
                  <Select
                    value={reminder.action}
                    onChange={(e) => handleStatusChange(reminder.id, 'action', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={reminder.type}
                    onChange={(e) => handleStatusChange(reminder.id, 'type', e.target.value)}
                  >
                    <option value="before">Before</option>
                    <option value="after">After</option>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={reminder.days}
                    onChange={(e) => handleStatusChange(reminder.id, 'days', Number(e.target.value))}
                    min="1"
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>

      <SaveButton onClick={handleSave} disabled={loading || reminders.length === 0}>
        💾 Save Changes
      </SaveButton>
    </Container>
  );
};

export default FessReminder;