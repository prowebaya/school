import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import {
  fetchDuesFees,
  fetchDuesFeesOptions,
} from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../../redux/store';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  background-color: #e8c897;
  min-height: 100vh;
`;

const Header = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.5px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
`;

const Select = styled.select`
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 0.875rem;
  color: #1e293b;
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover {
    border-color: #94a3b8;
  }
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 500px;
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1.25rem 0.875rem 2.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #1e293b;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 2;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.th`
  background-color: #6366f1;
  color: white;
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
`;

const TableRow = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
`;

const FeeGroupList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 120px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const FeeGroupItem = styled.li`
  padding: 0.25rem 0;
  font-size: 0.75rem;
  color: #475569;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
  }
`;

const RecordsCount = styled.div`
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SearchDuesFees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { duesFees = [], duesFeesOptions = {}, loading, error } = useSelector((state) => state.admissionForms);
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;

  const [selectedFeeGroup, setSelectedFeeGroup] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (adminID) {
      dispatch(fetchDuesFeesOptions(adminID));
      dispatch(fetchDuesFees({ adminID }));
    } else {
      toast.error('Please log in to view dues fees', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (adminID) {
      const params = { adminID };
      if (selectedFeeGroup && selectedFeeGroup !== 'all') params.feeGroupId = selectedFeeGroup;
      if (selectedClass) params.classId = selectedClass;
      if (selectedSection) params.section = selectedSection;
      if (searchQuery) params.searchQuery = searchQuery;
      dispatch(fetchDuesFees(params));
    }
  }, [dispatch, adminID, selectedFeeGroup, selectedClass, selectedSection, searchQuery]);

  const handleAddPayment = (student) => {
    navigate('/collect-fee', {
      state: {
        admissionFormId: student._id,
        studentName: student.studentName,
        admissionNo: student.admissionNo,
        class: student.class,
        balance: student.balance,
      },
    });
  };

  const { feeGroups = [], classes = [], sections = [] } = duesFeesOptions;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header>Student Dues Management System</Header>

        {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Fee Group</FilterLabel>
            <Select
              value={selectedFeeGroup}
              onChange={(e) => setSelectedFeeGroup(e.target.value)}
            >
              {feeGroups.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Class</FilterLabel>
            <Select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection(''); // Reset section when class changes
              }}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Section</FilterLabel>
            <Select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">All Sections</option>
              {sections.map((section, index) => (
                <option key={index} value={section}>{section}</option>
              ))}
            </Select>
          </FilterGroup>
        </FiltersContainer>

        <SearchContainer>
          <SearchIcon width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        {loading ? (
          <div style={{ color: '#34495e', textAlign: 'center', padding: '1rem' }}>Loading...</div>
        ) : duesFees.length === 0 ? (
          <div style={{ color: '#34495e', textAlign: 'center', padding: '1rem' }}>
            No dues found. {error ? `Error: ${error}` : 'Try adjusting your filters.'}
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>Class</TableHeader>
                <TableHeader>Admission No</TableHeader>
                <TableHeader>Student Name</TableHeader>
                <TableHeader>Fee Groups</TableHeader>
                <TableHeader>Amount (₹)</TableHeader>
                <TableHeader>Paid (₹)</TableHeader>
                <TableHeader>Discount (₹)</TableHeader>
                <TableHeader>Fine (₹)</TableHeader>
                <TableHeader>Balance (₹)</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {duesFees.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>
                    <FeeGroupList>
                      {student.feeGroups.map((group, idx) => (
                        <FeeGroupItem key={idx}>• {group}</FeeGroupItem>
                      ))}
                    </FeeGroupList>
                  </TableCell>
                  <TableCell>{student.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{student.paid.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{student.discount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{student.fine.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{student.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleAddPayment(student)}>
                      Add Payment
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}

        <RecordsCount>
          Showing {duesFees.length} of {duesFees.length} records
        </RecordsCount>
      </Container>
    </>
  );
};

export default SearchDuesFees;