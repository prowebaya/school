import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { fetchAdmissionForms } from '../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../redux/store';

interface Option {
  value: string;
  label: string;
}

const PromoteStudents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admissionForms = [], loading, error: reduxError } = useSelector((state: RootState) => state.admissionForms);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  const [selectedClassSection, setSelectedClassSection] = useState<string | null>(null);
  const [promoteSession, setPromoteSession] = useState<string>('2017-18');
  const [promoteClass, setPromoteClass] = useState<string | null>(null);
  const [promoteSection, setPromoteSection] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(false);

  const fclassesList = useSelector((state: RootState) => state.fclass.fclassesList || []);
  const sectionsList = useSelector((state: RootState) => state.sections.sectionsList || []);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAdmissionForms(adminID));
    } else {
      toast.error('Please log in to view student data', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  const classOptions: Option[] = fclassesList.map((cls: any) => ({ value: cls._id, label: cls.name }));
  const sectionOptions: Option[] = selectedClassSection
    ? fclassesList
        .find((cls: any) => cls._id === selectedClassSection.split('|')[0])
        ?.sections.map((sec: string) => ({ value: sec, label: sec })) || []
    : [];

  const handleSearch = () => {
    if (selectedClassSection && promoteSession && promoteClass && promoteSection) {
      const [classId, section] = selectedClassSection.split('|');
      const filteredStudents = admissionForms.filter((form: any) => {
        const formClassId = typeof form.classId === 'string' ? form.classId : form.classId?._id;
        return formClassId === classId && form.section === section;
      });
      setStudents(filteredStudents);
      setShowTable(true);
      if (filteredStudents.length === 0) {
        toast.warn('No students found for the selected criteria.', { position: 'top-right', autoClose: 3000 });
      }
    } else {
      toast.warn('Please select all criteria before searching.', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div>
      <h2>Promote Students</h2>
      <div>
        <Select
          options={classOptions}
          value={classOptions.find((opt) => opt.value === (selectedClassSection?.split('|')[0] || null))}
          onChange={(newValue) => setSelectedClassSection(newValue ? `${newValue.value}|${sectionOptions[0]?.value || ''}` : null)}
          placeholder="Select Class & Section"
          isClearable
        />
        <Select
          options={sectionOptions}
          value={sectionOptions.find((opt) => opt.value === (selectedClassSection?.split('|')[1] || null))}
          onChange={(newValue) =>
            setSelectedClassSection((prev) => (prev ? `${prev.split('|')[0]}|${newValue?.value || ''}` : null))
          }
          placeholder="Select Section"
          isDisabled={!selectedClassSection}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showTable && (
        <table>
          <thead>
            <tr>
              <th>Admission No</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student._id}>
                <td>{student.admissionNo}</td>
                <td>{`${student.firstName} ${student.lastName}`}</td>
                <td>
                  <button>Promote</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {loading && <div>Loading...</div>}
      {reduxError && <div>Error: {reduxError}</div>}
    </div>
  );
};

export default PromoteStudents;