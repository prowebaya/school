import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { searchStudents, resetSearch } from '../../redux/StudentAddmissionDetail/studentSearchHandle';
import { getAllFclasses } from '../../redux/fclass/fclassHandle'; // Assuming this exists
import { RootState, AppDispatch } from '../../redux/store';

interface Option {
  value: string;
  label: string;
}

const Container = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: clamp(1.8rem, 5vw, 2.2rem);
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  width: 100%;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: clamp(0.9rem, 3vw, 1rem);
`;

const StudentSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error, status } = useSelector((state: RootState) => state.studentSearch);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { fclassesList } = useSelector((state: RootState) => state.fclass);
  const adminID = currentUser?._id;

  const [searchParams, setSearchParams] = useState({
    admissionNo: '',
    name: '',
    classId: '',
    section: '',
  });

  useEffect(() => {
    if (adminID) {
      dispatch(getAllFclasses(adminID));
    } else {
      toast.error('Please log in to search students', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, newValue: Option | null) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: newValue ? newValue.value : '',
      ...(name === 'classId' && { section: '' }), // Reset section when class changes
    }));
  };

  const handleSearch = () => {
    if (!adminID) {
      toast.error('Please log in to search students', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(searchStudents(adminID, searchParams));
  };

  const handleReset = () => {
    setSearchParams({ admissionNo: '', name: '', classId: '', section: '' });
    dispatch(resetSearch());
  };

  const classOptions: Option[] = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions: Option[] = fclassesList
    .find((cls) => cls._id === searchParams.classId)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer />
        <Title>Student Search</Title>

        {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <FilterSection>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
              Admission No
            </label>
            <Input
              name="admissionNo"
              value={searchParams.admissionNo}
              onChange={handleInputChange}
              placeholder="Search by Admission No"
            />
          </div>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
              Name
            </label>
            <Input
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              placeholder="Search by Name"
            />
          </div>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
              Class
            </label>
            <Select
              options={classOptions}
              value={classOptions.find((opt) => opt.value === searchParams.classId) || null}
              onChange={(newValue) => handleSelectChange('classId', newValue)}
              placeholder="Select Class"
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  padding: '0.2rem',
                  minWidth: '100%',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
              Section
            </label>
            <Select
              options={sectionOptions}
              value={sectionOptions.find((opt) => opt.value === searchParams.section) || null}
              onChange={(newValue) => handleSelectChange('section', newValue)}
              placeholder="Select Section"
              isClearable
              isSearchable
              isDisabled={!searchParams.classId}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  padding: '0.2rem',
                  minWidth: '100%',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={handleReset} style={{ background: 'linear-gradient(45deg, #e74c3c, #c0392b)' }}>
            Reset
          </Button>
        </FilterSection>

        {loading ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>Loading...</div>
        ) : students.length === 0 ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>
            No students found. Try adjusting your search criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <table style={{ width: '100%', background: 'white', borderRadius: '12px', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Admission No
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Name
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Class
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Section
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Gender
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    DOB
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {student.admissionNo}
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {student.firstName} {student.lastName}
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {typeof student.classId === 'object' && student.classId ? student.classId.name : 'Unknown'}
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {student.section}
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {student.gender || 'N/A'}
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {new Date(student.dob).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </>
  );
};

export default StudentSearch;