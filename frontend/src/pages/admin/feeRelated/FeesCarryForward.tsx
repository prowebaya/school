import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { fetchFeeBalances, updateFeeBalances } from '../../../redux/feeRelated/feeBalanceActions';
import { fetchAdmissionForms } from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
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
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background-color: white;
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
  background: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")
    no-repeat right 1rem center/1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  padding-left: 2.5rem;
  background: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e")
    no-repeat 1rem center/1.2rem;
`;

const SearchButton = styled.button`
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: #6366f1;
  color: white;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  &:hover {
    background-color: #4f46e5;
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #6366f1;
  color: white;
  padding: 1rem;
  text-align: left;
  font-size: 0.9rem;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
  &:nth-child(even) {
    background-color: #f8fafc;
  }
  &:hover {
    background-color: #f1f5f9;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #1e293b;
  font-size: 0.9rem;
`;

const DueDate = styled.div`
  color: #ef4444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BalanceInput = styled.input`
  width: 100px;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  text-align: right;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const SaveButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.875rem 1.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  &:hover {
    background-color: #059669;
    transform: translateY(-1px);
  }
  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;

const FeesCarryForward = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feeBalances, loading, error, status } = useSelector((state: RootState) => state.feeBalances);
  const { fclassesList } = useSelector((state: RootState) => state.fclass);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [editedBalances, setEditedBalances] = useState({});

  useEffect(() => {
    if (adminID) {
      dispatch(fetchFeeBalances(adminID, { classId: selectedClass, section: selectedSection, searchQuery: appliedSearch }));
      dispatch(fetchAdmissionForms(adminID));
      dispatch(getAllFclasses(adminID));
    } else {
      toast.error('Please log in to view fee balances', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID, selectedClass, selectedSection, appliedSearch]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const handleBalanceChange = (id, value) => {
    setEditedBalances((prev) => ({
      ...prev,
      [id]: parseFloat(value) || 0,
    }));
  };

  const handleSave = () => {
    const balancesToUpdate = Object.entries(editedBalances).map(([id, balance]) => ({
      id,
      balance,
    }));
    dispatch(updateFeeBalances(adminID, balancesToUpdate));
    setEditedBalances({});
    toast.success('Changes saved successfully!', { position: 'top-right', autoClose: 3000 });
  };

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
  };

  const classOptions = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions = fclassesList
    .find((cls) => cls._id === selectedClass)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];

  return (
    <Container>
      <ToastContainer />
      <Header>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Fees Carry Forward
      </Header>

      <FiltersContainer>
        <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls.value} value={cls.value}>
              {cls.label}
            </option>
          ))}
        </Select>

        <Select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} disabled={!selectedClass}>
          <option value="">Select Section</option>
          {sectionOptions.map((sec) => (
            <option key={sec.value} value={sec.value}>
              {sec.label}
            </option>
          ))}
        </Select>
      </FiltersContainer>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </SearchButton>
      </SearchContainer>

      {loading ? (
        <div>Loading...</div>
      ) : feeBalances.length === 0 ? (
        <div>No fee balances available.</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeader>Student Name</TableHeader>
              <TableHeader>Admission No</TableHeader>
              <TableHeader>Admission Date</TableHeader>
              <TableHeader>Due Date</TableHeader>
              <TableHeader>Roll Number</TableHeader>
              <TableHeader>Father Name</TableHeader>
              <TableHeader>Balance ($)</TableHeader>
            </tr>
          </thead>
          <tbody>
            {feeBalances.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.admissionNo}</TableCell>
                <TableCell>{student.admissionDate}</TableCell>
                <TableCell>
                  <DueDate>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {student.dueDate}
                  </DueDate>
                </TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.fatherName}</TableCell>
                <TableCell>
                  <BalanceInput
                    type="number"
                    value={editedBalances[student.id] ?? student.balance}
                    onChange={(e) => handleBalanceChange(student.id, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}

      <SaveButton onClick={handleSave} disabled={Object.keys(editedBalances).length === 0}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        Save All Changes
      </SaveButton>
    </Container>
  );
};

export default FeesCarryForward;