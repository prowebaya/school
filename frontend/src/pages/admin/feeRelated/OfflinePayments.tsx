import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import {
  fetchOfflinePayments,
  updateOfflinePayment,
} from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
import { RootState, AppDispatch } from '../../../redux/store';

interface Option {
  value: string;
  label: string;
}

interface Payment {
  id: number;
  admissionNo: string;
  name: string;
  class: string;
  paymentDate: string;
  submitDate: string;
  amount: number;
  status: string;
  paymentId: string;
  admissionFormId: string;
}

const Container = styled.div`
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background-color: #e8c897;
  min-height: 100vh;
`;

const Heading = styled.h2`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 15px;
  background-color: #e8c897;
  border-radius: 15px;
`;

const Search = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 15px;
  border: 1px solid #ccc;
  font-size: 16px;
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

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 15px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background-color: #579df2;
  text-align: center;
  padding: 12px;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
`;

const Pending = styled.span`
  color: #ff9800;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #fff3e0;
`;

const Approved = styled.span`
  color: #4caf50;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #e8f5e9;
`;

const Rejected = styled.span`
  color: #f44336;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #ffebee;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popup = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  width: 350px;
  text-align: center;
`;

const ApproveButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const OfflinePayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { offlinePayments = [], loading, error } = useSelector((state: RootState) => state.admissionForms);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { fclassesList } = useSelector((state: RootState) => state.fclass);
  const adminID = currentUser?._id;

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [filterSection, setFilterSection] = useState<string | null>(null);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchOfflinePayments(adminID));
      dispatch(getAllFclasses(adminID));
    } else {
      toast.error('Please log in to view offline payments', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  const openPopup = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPayment(null);
  };

  const updateStatus = () => {
    if (selectedPayment && adminID) {
      dispatch(updateOfflinePayment(selectedPayment.id, { status: 'Approved', adminID })).then(() => {
        toast.success('Payment status updated to Approved', { position: 'top-right', autoClose: 3000 });
        dispatch(fetchOfflinePayments(adminID));
        closePopup();
      });
    }
  };

  const handleFilterClassChange = (newValue: Option | null) => {
    setFilterClass(newValue ? newValue.value : null);
    setFilterSection(null);
  };

  const handleFilterSectionChange = (newValue: Option | null) => {
    setFilterSection(newValue ? newValue.value : null);
  };

  const filteredPayments = offlinePayments.filter((payment: Payment) => {
    let matchesClass = true;
    let matchesSection = true;
    let matchesSearch = true;

    if (filterClass) {
      const classMatch = payment.class.includes(fclassesList.find((cls) => cls._id === filterClass)?.name || '');
      matchesClass = classMatch;
    }

    if (filterSection) {
      matchesSection = payment.class.includes(`(${filterSection})`);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch =
        payment.id.toString().includes(searchQuery) ||
        payment.admissionNo.toString().includes(searchQuery) ||
        payment.name.toLowerCase().includes(query) ||
        payment.class.toLowerCase().includes(query) ||
        payment.status.toLowerCase().includes(query) ||
        payment.paymentId.includes(searchQuery);
    }

    return matchesClass && matchesSection && matchesSearch;
  });

  const classOptions: Option[] = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions: Option[] = fclassesList
    .find((cls) => cls._id === filterClass)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Heading>Offline Bank Payments</Heading>

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

        <Search
          type="text"
          placeholder="🔍 Search payments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>Loading...</div>
        ) : filteredPayments.length === 0 ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>
            No payments found. {error ? `Error: ${error}` : 'Try adjusting filters.'}
          </div>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Request ID</Th>
                  <Th>Admission No</Th>
                  <Th>Name</Th>
                  <Th>Class</Th>
                  <Th>Payment Date</Th>
                  <Th>Submit Date</Th>
                  <Th>Amount (₹)</Th>
                  <Th>Status</Th>
                  <Th>Payment ID</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <Td>{payment.id}</Td>
                    <Td>{payment.admissionNo}</Td>
                    <Td>{payment.name}</Td>
                    <Td>{payment.class}</Td>
                    <Td>{payment.paymentDate}</Td>
                    <Td>{payment.submitDate}</Td>
                    <Td>₹{payment.amount}</Td>
                    <Td>
                      {payment.status === 'Pending' ? (
                        <Pending>{payment.status}</Pending>
                      ) : payment.status === 'Approved' ? (
                        <Approved>{payment.status}</Approved>
                      ) : (
                        <Rejected>{payment.status}</Rejected>
                      )}
                    </Td>
                    <Td>{payment.paymentId}</Td>
                    <Td>
                      <ActionButton onClick={() => openPopup(payment)}>⋮</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}

        {isPopupOpen && selectedPayment && (
          <PopupOverlay>
            <Popup>
              <h3>Payment Details</h3>
              <p><strong>Name:</strong> {selectedPayment.name}</p>
              <p><strong>Class:</strong> {selectedPayment.class}</p>
              <p><strong>Amount:</strong> ₹{selectedPayment.amount}</p>
              <p>
                <strong>Status:</strong>{' '}
                {selectedPayment.status === 'Pending' ? (
                  <Pending>{selectedPayment.status}</Pending>
                ) : selectedPayment.status === 'Approved' ? (
                  <Approved>{selectedPayment.status}</Approved>
                ) : (
                  <Rejected>{selectedPayment.status}</Rejected>
                )}
              </p>
              {selectedPayment.status === 'Pending' && (
                <ApproveButton onClick={updateStatus}>Approve</ApproveButton>
              )}
              <CloseButton onClick={closePopup}>Close</CloseButton>
            </Popup>
          </PopupOverlay>
        )}
      </Container>
    </>
  );
};

export default OfflinePayments;