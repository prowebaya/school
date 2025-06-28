import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  updatePromotion,
  promotePromotions,
  clearPromotionError,
} from '../../../redux/promotion/promotionActions';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
import { fetchAdmissionForms } from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../../redux/store';

const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgb(237, 198, 100), rgb(20, 114, 244));
  min-height: 100vh;
  position: relative;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  color: rgb(79, 81, 225);
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Section = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
  display: flex;
  align-items: center;
  gap: 15px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Label = styled.label`
  font-size: 16px;
  color: #34495e;
  font-weight: 600;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  max-width: 200px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s ease;
  &:hover {
    background: #2980b9;
  }
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    padding: 12px;
    text-align: center;
    font-size: 15px;
    border-bottom: 1px solid #ddd;
  }
  th {
    background: #3498db;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  tr:hover {
    background-color: #e9ecef;
  }
  input[type="checkbox"], input[type="radio"] {
    margin: 0 5px;
  }
  label {
    font-size: 14px;
    color: #34495e;
    margin: 0 5px;
  }
  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #27ae60;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-weight: bold;
  opacity: ${props => (props.show ? '1' : '0')};
  transition: opacity 0.5s ease;
`;

interface Promotion {
  _id: string;
  admissionNo: string;
  name: string;
  fatherName: string;
  dob: string;
  class: string;
  section: string;
  currentResult: 'Pass' | 'Fail';
  nextSessionStatus: 'Continue' | 'Leave';
  session: string;
  admin: string;
  selected: boolean;
}

const PromoteStudents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { promotionsList, loading, error } = useSelector((state: RootState) => state.promotion);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { fclassesList, error: fclassError } = useSelector((state: RootState) => state.fclass);
  const { admissionForms, error: admissionError } = useSelector((state: RootState) => state.admissionForms);
  const adminID = currentUser?._id;

  const sessions = ['2023-24', '2024-25', '2025-26'];

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [promoteSession, setPromoteSession] = useState('');
  const [promoteClass, setPromoteClass] = useState('');
  const [promoteSection, setPromoteSection] = useState('');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (!adminID || !/^[0-9a-fA-F]{24}$/.test(adminID)) {
      toast.error('Invalid admin ID. Please log in again.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(getAllFclasses(adminID));
    dispatch(fetchAdmissionForms(adminID));
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error || fclassError || admissionError) {
      const errorMessage = error || fclassError || admissionError || 'An error occurred';
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
      dispatch(clearPromotionError());
    }

    console.log('fclassesList:', fclassesList); // Debug classes
    const mappedPromotions = admissionForms
      .filter(form => {
        const className = typeof form.classId === 'object' && form.classId ? form.classId.name : 
                         fclassesList.find(cls => cls._id === form.classId)?.name || '';
        return (
          (!selectedClass || className === selectedClass) &&
          (!selectedSection || form.section === selectedSection) &&
          (!promoteSession || true)
        );
      })
      .map(form => ({
        _id: form._id,
        admissionNo: form.admissionNo,
        name: `${form.firstName} ${form.lastName}`,
        fatherName: form.parents.father.name,
        dob: form.dob,
        class: typeof form.classId === 'object' && form.classId ? form.classId.name : 
               fclassesList.find(cls => cls._id === form.classId)?.name || '',
        section: form.section,
        currentResult: 'Pass' as 'Pass' | 'Fail',
        nextSessionStatus: 'Continue' as 'Continue' | 'Leave',
        session: promoteSession || sessions[0] || '',
        admin: adminID,
        selected: false,
      }));

    setPromotions(mappedPromotions);
    if (showTable && mappedPromotions.length === 0) {
      toast.warn('No promotions found for the selected criteria', { position: 'top-right', autoClose: 3000 });
    }
  }, [error, fclassError, admissionError, admissionForms, fclassesList, selectedClass, selectedSection, promoteSession, adminID, dispatch, showTable]);

  const classOptions = fclassesList.map(cls => ({ value: cls.name, label: cls.name }));
  const sectionOptions = fclassesList
    .find(cls => cls.name === selectedClass)
    ?.sections.map(sec => ({ value: sec, label: sec })) || [];
  const promoteSectionOptions = fclassesList
    .find(cls => cls.name === promoteClass)
    ?.sections.map(sec => ({ value: sec, label: sec })) || [];

  console.log('promoteSectionOptions:', promoteSectionOptions); // Debug sections

  const handleSearch = () => {
    if (!fclassesList.length || !admissionForms.length) {
      toast.error('Classes or admission forms are still loading. Please wait.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (selectedClass && selectedSection && promoteSession && promoteClass && promoteSection) {
      setShowTable(true);
    } else {
      toast.error('Please select all criteria before searching.', { position: 'top-right', autoClose: 3000 });
    }
  };

  const handlePromotionSelect = (index: number) => {
    const updatedPromotions = [...promotions];
    updatedPromotions[index].selected = !updatedPromotions[index].selected;
    setPromotions(updatedPromotions);
  };

  const handleCurrentResultChange = async (index: number, result: 'Pass' | 'Fail') => {
    const promotion = promotions[index];
    try {
      await dispatch(updatePromotion(promotion._id, { currentResult: result }, adminID));
      const updatedPromotions = [...promotions];
      updatedPromotions[index].currentResult = result;
      setPromotions(updatedPromotions);
      toast.success('Promotion result updated successfully', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error('Failed to update promotion result', { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleNextSessionStatusChange = async (index: number, status: 'Continue' | 'Leave') => {
    const promotion = promotions[index];
    try {
      await dispatch(updatePromotion(promotion._id, { nextSessionStatus: status }, adminID));
      const updatedPromotions = [...promotions];
      updatedPromotions[index].nextSessionStatus = status;
      setPromotions(updatedPromotions);
      toast.success('Promotion status updated successfully', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error('Failed to update promotion status', { position: 'top-right', autoClose: 3000 });
    }
  };

  const handlePromote = async () => {
    const selectedPromotions = promotions.filter(promotion => promotion.selected);
    if (selectedPromotions.length === 0) {
      toast.error('Please select at least one record to promote.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const promotionIds = selectedPromotions.map(promotion => promotion._id);
    try {
      const response = await dispatch(promotePromotions(promotionIds, promoteClass, promoteSection, promoteSession, adminID));
      setNotificationMessage(response.payload.message);
      setShowNotification(true);
      setShowTable(false);
      setSelectedClass('');
      setSelectedSection('');
      setPromoteSession('');
      setPromoteClass('');
      setPromoteSection('');
      setPromotions(promotions.map(p => ({ ...p, selected: false }))); // Clear selections
      dispatch(fetchAdmissionForms(adminID));
      toast.success('Promotions completed successfully', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error(error.message || 'Failed to promote students', { position: 'top-right', autoClose: 3000 });
    }
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (!fclassesList.length || !admissionForms.length) {
    return <Container>Loading classes and admission forms...</Container>;
  }

  return (
    <Container>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</div>}

      <Title>Select Criteria</Title>
      <Section>
        <div>
          <Label>Class <span style={{ color: 'red' }}>*</span></Label>
          <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select</option>
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Section <span style={{ color: 'red' }}>*</span></Label>
          <Select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select</option>
            {sectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Section>

      <Title>Promote in Next Session</Title>
      <Section>
        <div>
          <Label>Promote in Session <span style={{ color: 'red' }}>*</span></Label>
          <Select value={promoteSession} onChange={(e) => setPromoteSession(e.target.value)}>
            <option value="">Select</option>
            {sessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Class <span style={{ color: 'red' }}>*</span></Label>
          <Select value={promoteClass} onChange={(e) => setPromoteClass(e.target.value)}>
            <option value="">Select</option>
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Section <span style={{ color: 'red' }}>*</span></Label>
          <Select
            value={promoteSection}
            onChange={(e) => setPromoteSection(e.target.value)}
            disabled={!promoteClass}
          >
            <option value="">Select</option>
            {promoteSectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </Section>

      {showTable && promotions.length > 0 && (
        <TableSection>
          <Title>Promotion List</Title>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Admission No</th>
                <th>Name</th>
                <th>Father Name</th>
                <th>Date of Birth</th>
                <th>Current Result</th>
                <th>Next Session Status</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={promotion.selected}
                      onChange={() => handlePromotionSelect(index)}
                    />
                  </td>
                  <td>{promotion.admissionNo}</td>
                  <td>{promotion.name}</td>
                  <td>{promotion.fatherName}</td>
                  <td>{promotion.dob}</td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name={`currentResult-${index}`}
                        checked={promotion.currentResult === 'Pass'}
                        onChange={() => handleCurrentResultChange(index, 'Pass')}
                      />
                      Pass
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`currentResult-${index}`}
                        checked={promotion.currentResult === 'Fail'}
                        onChange={() => handleCurrentResultChange(index, 'Fail')}
                      />
                      Fail
                    </label>
                  </td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name={`nextSessionStatus-${index}`}
                        checked={promotion.nextSessionStatus === 'Continue'}
                        onChange={() => handleNextSessionStatusChange(index, 'Continue')}
                      />
                      Continue
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`nextSessionStatus-${index}`}
                        checked={promotion.nextSessionStatus === 'Leave'}
                        onChange={() => handleNextSessionStatusChange(index, 'Leave')}
                      />
                      Leave
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            onClick={handlePromote}
            disabled={promotions.filter(p => p.selected).length === 0 || !promoteClass || !promoteSection || !promoteSession}
          >
            Promote
          </Button>
        </TableSection>
      )}

      <Notification show={showNotification}>
        {notificationMessage}
      </Notification>
    </Container>
  );
};

export default PromoteStudents;