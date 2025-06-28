import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { OnChangeValue } from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import {
  fetchAdmissionForms,
  addFeeCollection,
} from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
import { RootState, AppDispatch } from '../../../redux/store';

interface Option {
  value: string;
  label: string;
}

interface FeeCollectionForm {
  admissionFormId: string;
  feeType: string;
  amount: string;
  dueDate: string;
}

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  background-color: #e8c897;
  min-height: 100vh;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Filters = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.5rem 0.8rem 3rem;
  border-radius: 30px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
`;

const SearchIcon = styled.svg`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.th`
  background-color: #4a90e2;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 500;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgb(234, 200, 115);
  color: #2c3e50;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, rgb(64, 230, 64) 0%, #63b4ff 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
`;

const CollectFeePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admissionForms, loading, error } = useSelector((state: RootState) => state.admissionForms);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { fclassesList } = useSelector((state: RootState) => state.fclass);
  const adminID = currentUser?._id;

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [filterSection, setFilterSection] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [feeFormData, setFeeFormData] = useState<FeeCollectionForm>({
    admissionFormId: '',
    feeType: '',
    amount: '',
    dueDate: '',
  });

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAdmissionForms(adminID));
      dispatch(getAllFclasses(adminID));
    } else {
      toast.error('Please log in to view students', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  const handleFilterClassChange = (newValue: OnChangeValue<Option, false>) => {
    setFilterClass(newValue ? newValue.value : null);
    setFilterSection(null);
  };

  const handleFilterSectionChange = (newValue: OnChangeValue<Option, false>) => {
    setFilterSection(newValue ? newValue.value : null);
  };

  const handleCollectFee = (student: any) => {
    setSelectedStudent(student);
    setFeeFormData({
      admissionFormId: student._id,
      feeType: '',
      amount: '',
      dueDate: '',
    });
    setShowModal(true);
  };

  const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      toast.error('Please log in to collect fees', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!feeFormData.feeType || !feeFormData.amount || !feeFormData.dueDate) {
      toast.error('All fee fields are required', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(addFeeCollection(feeFormData, adminID)).then(() => {
      toast.success('Fee collected successfully!', { position: 'top-right', autoClose: 3000 });
      setShowModal(false);
      setFeeFormData({ admissionFormId: '', feeType: '', amount: '', dueDate: '' });
    });
  };

  const classOptions: Option[] = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions: Option[] = fclassesList
    .find((cls) => cls._id === filterClass)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];

  const filteredStudents = admissionForms.filter((student) => {
    let matchesClass = true;
    let matchesSection = true;
    let matchesSearch = true;

    if (filterClass) {
      const classId = typeof student.classId === 'string' ? student.classId : student.classId?._id;
      matchesClass = classId === filterClass;
    }

    if (filterSection) {
      matchesSection = student.section === filterSection;
    }

    if (searchKeyword) {
      const query = searchKeyword.toLowerCase();
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      matchesSearch =
        student.admissionNo.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        fullName.includes(query);
    }

    return matchesClass && matchesSection && matchesSearch;
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header>Student Fee Collection</Header>

        {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <Filters>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: '0.9rem', color: '#2c3e50', fontWeight: 500 }}>Filter by Class</label>
            <Select
              options={classOptions}
              value={classOptions.find((opt) => opt.value === filterClass) || null}
              onChange={handleFilterClassChange}
              placeholder="Select Class"
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  padding: '0.2rem',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: '0.9rem', color: '#2c3e50', fontWeight: 500 }}>Filter by Section</label>
            <Select
              options={sectionOptions}
              value={sectionOptions.find((opt) => opt.value === filterSection) || null}
              onChange={handleFilterSectionChange}
              placeholder="Select Section"
              isClearable
              isSearchable
              isDisabled={!filterClass}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  padding: '0.2rem',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
        </Filters>

        <SearchBar>
          <SearchIcon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search students..."
            value={searchKeyword}
            onChange={handleSearch}
          />
        </SearchBar>

        {loading ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>Loading...</div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>
            No students found. {error ? `Error: ${error}` : 'Try adjusting filters.'}
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>Class</TableHeader>
                <TableHeader>Section</TableHeader>
                <TableHeader>Admission No</TableHeader>
                <TableHeader>Student Name</TableHeader>
                <TableHeader>Father Name</TableHeader>
                <TableHeader>Date of Birth</TableHeader>
                <TableHeader>Mobile No.</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <TableCell>
                    {typeof student.classId === 'object' && student.classId ? student.classId.name : 
                     typeof student.classId === 'string' ? fclassesList.find((cls) => cls._id === student.classId)?.name || 'Unknown' : 
                     'Unknown'}
                  </TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{student.parents.father.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(student.dob).toLocaleDateString()}</TableCell>
                  <TableCell>{student.parents.father.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleCollectFee(student)}>
                      Collect Fee
                    </ActionButton>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div style={{ marginTop: '1.5rem', color: '#95a5a6', fontSize: '0.9rem', textAlign: 'center' }}>
          Showing {filteredStudents.length} of {filteredStudents.length} records
        </div>

        {showModal && (
          <>
            <ModalOverlay onClick={() => setShowModal(false)} />
            <Modal>
              <h3>Collect Fee for {selectedStudent.firstName} {selectedStudent.lastName}</h3>
              <FormContainer onSubmit={handleFeeSubmit}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#2c3e50', fontWeight: 500 }}>Fee Type</label>
                  <Input
                    name="feeType"
                    value={feeFormData.feeType}
                    onChange={handleFeeInputChange}
                    placeholder="Fee Type (e.g., Tuition, Transport)"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#2c3e50', fontWeight: 500 }}>Amount</label>
                  <Input
                    type="number"
                    name="amount"
                    value={feeFormData.amount}
                    onChange={handleFeeInputChange}
                    placeholder="Amount"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#2c3e50', fontWeight: 500 }}>Due Date</label>
                  <Input
                    type="date"
                    name="dueDate"
                    value={feeFormData.dueDate}
                    onChange={handleFeeInputChange}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1rem' }}>
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    style={{ background: 'linear-gradient(45deg, #e74c3c, #c0392b)' }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </FormContainer>
            </Modal>
          </>
        )}
      </Container>
    </>
  );
};

export default CollectFeePage;