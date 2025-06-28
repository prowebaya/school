import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import {
  generateInstallmentPlan,
  fetchQuickFeesOptions,
  fetchAdmissionForms,
} from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  background-color: #e8c897;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  &:invalid {
    border-color: #ef4444;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2);
  }
`;

const Required = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

const Icon = styled.svg`
  width: 20px;
  height: 20px;
`;

const QuickFeesMaster: React.FC = () => {
  const dispatch = useDispatch();
  const admissionFormsState = useSelector((state: any) => state.admissionForms);
  const quickFeesOptions = admissionFormsState?.quickFeesOptions ?? { classes: [], sections: [] };
  const admissionForms = admissionFormsState?.admissionForms ?? [];
  const loading = admissionFormsState?.loading ?? false;
  const error = admissionFormsState?.error ?? null;
  const { currentUser } = useSelector((state: any) => state.user);
  const adminID = currentUser?._id;

  const [formData, setFormData] = useState({
    classId: '',
    section: '',
    studentId: '',
    totalFees: '',
    firstInstallment: '',
    balanceFees: '',
    installments: '1',
    dueDateDay: '3',
    fineType: 'Fix Amount',
    fineValue: '',
  });
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { classes = [], sections = [] } = quickFeesOptions;

  // Fetch data on mount
  useEffect(() => {
    if (adminID) {
      dispatch(fetchQuickFeesOptions(adminID));
      dispatch(fetchAdmissionForms(adminID)).catch((err: any) => {
        console.error('Initial fetchAdmissionForms failed:', err);
        setFetchError(err.message || 'Failed to load student data. Please try refreshing the page.');
      });
    } else {
      toast.error('Please log in to generate fees plans', { position: 'top-right', autoClose: 3000 });
      setFetchError('User not authenticated. Please log in.');
    }
    console.log('QuickFeesMaster Redux state:', {
      admissionFormsState,
      quickFeesOptions,
      admissionForms,
      classes,
      sections,
      loading,
      error,
    });
  }, [dispatch, adminID]);

  // Debug form data and filtered students
  useEffect(() => {
    console.log('Form data updated:', formData);
    console.log('Filtered students:', filteredStudents);
  }, [formData, admissionForms]);

  // Calculate balance fees dynamically
  useEffect(() => {
    const total = parseFloat(formData.totalFees) || 0;
    const first = parseFloat(formData.firstInstallment) || 0;
    const balance = total - first;
    setFormData((prev) => ({
      ...prev,
      balanceFees: isNaN(balance) ? '' : balance.toFixed(2),
    }));
  }, [formData.totalFees, formData.firstInstallment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'classId' ? { section: '', studentId: '' } : {}),
      ...(name === 'section' ? { studentId: '' } : {}),
    }));
  };

  const handleRetryFetch = async () => {
    if (!adminID) {
      toast.error('Please log in to retry fetching student data', { position: 'top-right', autoClose: 3000 });
      return;
    }
    try {
      await dispatch(fetchAdmissionForms(adminID));
      setFetchError(null);
      toast.success('Student data refreshed successfully', { position: 'top-right', autoClose: 3000 });
    } catch (err: any) {
      console.error('Retry fetchAdmissionForms failed:', err);
      setFetchError(err.message || 'Failed to refresh student data. Please try again.');
      toast.error(err.message || 'Failed to refresh student data. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.classId || !formData.section || !formData.studentId || !formData.totalFees || !formData.balanceFees || !formData.dueDateDay) {
      toast.error('Please fill all required fields', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!adminID) {
      toast.error('Please log in to perform this action', { position: 'top-right', autoClose: 3000 });
      return;
    }

    // Refetch admission forms to ensure data is up-to-date
    try {
      await dispatch(fetchAdmissionForms(adminID));
    } catch (err: any) {
      console.error('fetchAdmissionForms in handleSubmit failed:', err);
      toast.error(err.message || 'Failed to refresh student data. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Recompute filtered students after refetching
    const latestFilteredStudents = admissionForms.filter(
      (form: any) => {
        const studentClassId = typeof form.classId === 'string' ? form.classId : form.classId?._id || '';
        const matchesClass = studentClassId === formData.classId;
        const matchesSection = !formData.section || form.section === formData.section;
        return matchesClass && matchesSection;
      }
    );

    // Validate that the selected studentId still matches the classId and section
    const selectedStudent = latestFilteredStudents.find((form: any) => form._id === formData.studentId);
    if (!selectedStudent) {
      toast.error(
        'The selected student is no longer available or does not match the selected class/section. Please reselect the student.',
        { position: 'top-right', autoClose: 3000 }
      );
      setFormData((prev) => ({ ...prev, studentId: '' }));
      return;
    }

    const totalFees = parseFloat(formData.totalFees);
    const firstInstallment = parseFloat(formData.firstInstallment) || 0;
    const balanceFees = parseFloat(formData.balanceFees);

    // Validate numeric inputs
    if (isNaN(totalFees) || totalFees <= 0) {
      toast.error('Total fees must be a valid positive number', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (isNaN(balanceFees) || balanceFees < 0) {
      toast.error('Balance fees must be a valid non-negative number', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (firstInstallment < 0) {
      toast.error('First installment cannot be negative', { position: 'top-right', autoClose: 3000 });
      return;
    }

    // Round to 2 decimal places to avoid floating-point issues
    const roundedTotalFees = parseFloat(totalFees.toFixed(2));
    const roundedFirstInstallment = parseFloat(firstInstallment.toFixed(2));
    const roundedBalanceFees = parseFloat(balanceFees.toFixed(2));

    if (roundedTotalFees !== roundedFirstInstallment + roundedBalanceFees) {
      toast.error(
        `Total fees (${roundedTotalFees}) must equal first installment (${roundedFirstInstallment}) plus balance fees (${roundedBalanceFees})`,
        { position: 'top-right', autoClose: 3000 }
      );
      return;
    }

    if (formData.fineType !== 'Fix Amount' && formData.fineType !== 'Percentage') {
      toast.error('Invalid fine type', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (formData.fineValue && parseFloat(formData.fineValue) < 0) {
      toast.error('Fine value cannot be negative', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const payload = {
      classId: formData.classId,
      section: formData.section,
      studentId: formData.studentId,
      totalFees: roundedTotalFees,
      firstInstallment: roundedFirstInstallment,
      balanceFees: roundedBalanceFees,
      installments: parseInt(formData.installments),
      dueDateDay: parseInt(formData.dueDateDay),
      fineType: formData.fineType,
      fineValue: parseFloat(formData.fineValue) || 0,
      adminID,
    };

    console.log('Submitting payload:', payload);

    try {
      await dispatch(generateInstallmentPlan(payload));
      toast.success('Installment plan generated successfully', { position: 'top-right', autoClose: 3000 });
      setFormData({
        classId: '',
        section: '',
        studentId: '',
        totalFees: '',
        firstInstallment: '',
        balanceFees: '',
        installments: '1',
        dueDateDay: '3',
        fineType: 'Fix Amount',
        fineValue: '',
      });
    } catch (error: any) {
      const errorMessage = error.message || error;
      if (errorMessage.includes('404')) {
        toast.error(
          'Failed to generate installment plan: The server could not find the endpoint. Please contact support.',
          { position: 'top-right', autoClose: 5000 }
        );
      } else if (errorMessage.includes('Student not found or does not match class/section')) {
        toast.error(
          'Failed to generate installment plan: The selected student does not match the class or section. Please reselect the student.',
          { position: 'top-right', autoClose: 5000 }
        );
        setFormData((prev) => ({ ...prev, studentId: '' }));
      } else {
        toast.error(
          `Failed to generate installment plan: ${errorMessage}. Please try again or contact support.`,
          { position: 'top-right', autoClose: 5000 }
        );
      }
    }
  };

  // Filter sections based on selected class
  const filteredSections = formData.classId
    ? classes.find((cls: any) => cls._id === formData.classId)?.sections || []
    : [];

  // Filter students from admissionForms based on selected class and section
  const filteredStudents = admissionForms.filter(
    (form: any) => {
      const studentClassId = typeof form.classId === 'string' ? form.classId : form.classId?._id || '';
      const matchesClass = studentClassId === formData.classId;
      const matchesSection = !formData.section || form.section === formData.section;
      console.log('Filtering student:', {
        student: {
          id: form._id,
          firstName: form.firstName,
          lastName: form.lastName,
          classId: studentClassId,
          section: form.section,
        },
        studentClassId,
        formDataClassId: formData.classId,
        section: formData.section,
        matchesClass,
        matchesSection,
      });
      return matchesClass && matchesSection;
    }
  );

  // Determine if the form is valid for submission
  const isFormValid = () => {
    const totalFees = parseFloat(formData.totalFees);
    const firstInstallment = parseFloat(formData.firstInstallment) || 0;
    const balanceFees = parseFloat(formData.balanceFees);
    return (
      formData.classId &&
      formData.section &&
      formData.studentId &&
      !isNaN(totalFees) &&
      totalFees > 0 &&
      !isNaN(balanceFees) &&
      balanceFees >= 0 &&
      firstInstallment >= 0 &&
      !isNaN(parseFloat(totalFees.toFixed(2))) &&
      parseFloat(totalFees.toFixed(2)) === parseFloat((firstInstallment + balanceFees).toFixed(2)) &&
      formData.dueDateDay &&
      (formData.fineValue ? parseFloat(formData.fineValue) >= 0 : true) &&
      !fetchError // Disable form submission if there's a fetch error
    );
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header>
          <Icon fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </Icon>
          Quick Fees Master
        </Header>

        {loading && (
          <div style={{ color: '#34495e', textAlign: 'center', marginBottom: '1rem' }}>
            Loading...
          </div>
        )}

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {fetchError && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>
            {fetchError}
            <RetryButton onClick={handleRetryFetch}>Retry Fetching Student Data</RetryButton>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormGrid>
            <InputGroup>
              <Label>
                Class
                <Required>*</Required>
              </Label>
              <Select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                disabled={!!fetchError}
              >
                <option value="">Select Class</option>
                {classes.map((cls: any) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>
                Section
                <Required>*</Required>
              </Label>
              <Select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                disabled={!formData.classId || !!fetchError}
              >
                <option value="">Select Section</option>
                {filteredSections.map((section: string) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>
                Student
                <Required>*</Required>
              </Label>
              <Select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                disabled={!formData.section || !!fetchError}
              >
                <option value="">Select Student</option>
                {filteredStudents.length === 0 && formData.section ? (
                  <option value="" disabled>
                    No students found
                  </option>
                ) : (
                  filteredStudents.map((form: any) => (
                    <option key={form._id} value={form._id}>
                      {`${form.firstName} ${form.lastName || ''}`}
                    </option>
                  ))
                )}
              </Select>
            </InputGroup>
          </FormGrid>

          <FormGrid>
            <InputGroup>
              <Label>
                Total Fees
                <Required>*</Required>
              </Label>
              <div style={{ position: 'relative' }}>
                <Input
                  type="number"
                  name="totalFees"
                  value={formData.totalFees}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  disabled={!!fetchError}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                  }}
                >
                  ₹
                </span>
              </div>
            </InputGroup>

            <InputGroup>
              <Label>1st Installment</Label>
              <Input
                type="number"
                name="firstInstallment"
                value={formData.firstInstallment}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={!!fetchError}
              />
            </InputGroup>

            <InputGroup>
              <Label>
                Balance Fees
                <Required>*</Required>
              </Label>
              <Input
                type="number"
                name="balanceFees"
                value={formData.balanceFees}
                onChange={handleChange}
                required
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={!!fetchError}
              />
            </InputGroup>

            <InputGroup>
              <Label>Installments</Label>
              <Select
                name="installments"
                value={formData.installments}
                onChange={handleChange}
                disabled={!!fetchError}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Select>
            </InputGroup>
          </FormGrid>

          <FormGrid>
            <InputGroup>
              <Label>Due Date Day</Label>
              <div style={{ position: 'relative' }}>
                <Input
                  type="number"
                  name="dueDateDay"
                  value={formData.dueDateDay}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  required
                  disabled={!!fetchError}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                  }}
                >
                  📅
                </span>
              </div>
            </InputGroup>

            <InputGroup>
              <Label>Fine Type</Label>
              <Select
                name="fineType"
                value={formData.fineType}
                onChange={handleChange}
                disabled={!!fetchError}
              >
                <option value="Fix Amount">Fix Amount</option>
                <option value="Percentage">Percentage</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Fine Value</Label>
              <Input
                type="number"
                name="fineValue"
                value={formData.fineValue}
                onChange={handleChange}
                placeholder={formData.fineType === 'Percentage' ? '%' : '₹'}
                min="0"
                step="0.01"
                disabled={!!fetchError}
              />
            </InputGroup>
          </FormGrid>

          <Button type="submit" disabled={loading || !isFormValid()}>
            {loading ? (
              'Generating...'
            ) : (
              <>
                <Icon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </Icon>
                Generate Installment Plan
              </>
            )}
          </Button>
        </form>
      </Container>
    </>
  );
};

export default QuickFeesMaster;