import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Drawer } from '../../components/Styles.tsx';



import Logout from '../Logout.tsx';
import SideBar from './SideBar.tsx';
import AddLibrarian from './AddLibrarian.tsx';
import AdminProfile from './AdminProfile.tsx';
import AdminHomePage from './AdminHomePage.tsx';

import AddStudent from './studentRelated/AddStudent.tsx';
import SeeComplains from './studentRelated/SeeComplains.tsx';
import ShowStudents from './studentRelated/ShowStudents.tsx';
import StudentAttendance from './studentRelated/StudentAttendance.tsx';
import StudentExamMarks from './studentRelated/StudentExamMarks.tsx';
import ViewStudent from './studentRelated/ViewStudent.tsx';

import AddNotice from './noticeRelated/AddNotice.tsx';
import ShowNotices from './noticeRelated/ShowNotices.tsx';

import ShowSubjects from './subjectRelated/ShowSubjects.tsx';
import SubjectForm from './subjectRelated/SubjectForm.tsx';
import ViewSubject from './subjectRelated/ViewSubject.tsx';

import AddTeacher from './teacherRelated/AddTeacher.tsx';
import ChooseClass from './teacherRelated/ChooseClass.tsx';
import ChooseSubject from './teacherRelated/ChooseSubject.tsx';
import ShowTeachers from './teacherRelated/ShowTeachers.tsx';
import TeacherDetails from './teacherRelated/TeacherDetails.tsx';

import AddClass from './classRelated/AddClass.tsx';
import ClassDetails from './classRelated/ClassDetails.tsx';
import ShowClasses from './classRelated/ShowClasses.tsx';
import AccountMenu from '../../components/AccountMenu.tsx';
import ManageLibrarians from './ManageLibrarians.tsx';
import StudentDetail from '../studentall/StudentDetail.tsx';
import StudentDetailPage from '../studentall/StudentDetailPage.tsx';
import StudentAdmissionForm from '../studentall/StudentAdmissionForm.tsx';
import StudentSearch from '../studentall/StudentSearch.tsx';
import BulkDeleteStudents from '../studentall/BulkDeleteStudents.tsx';
import CategoryManager from '../studentall/CategoryManager.tsx';
import HouseStudent from '../studentall/HouseStudent.tsx';
import DisableReason from '../studentall/DisableReason.tsx';
import AdmissionEnquiry from './frontoffice/AdmissionEnquiry.tsx';
import VisitorList from './frontoffice/VisitorList.tsx';
import Phone from './frontoffice/Phone.tsx';
import PostalDispatch from './frontoffice/PostalDispatch.tsx';
import PostalReceive from './frontoffice/PostalReceive.tsx';
import FrontOffice from './frontoffice/FrontOffice.tsx';
import ComplaintPage from '../studentall/ComplaintPage.tsx';
import CollectFeePage from './feeRelated/CollectFeePage.tsx';
import OfflinePayments from './feeRelated/OfflinePayments.tsx';
import SearchFeesPayment from './feeRelated/SearchFeesPayment .tsx';
import SearchDuesFees from './feeRelated/SearchDuesFees.tsx';
import FeesMaster from './feeRelated/FeesMaster.tsx';
import QuickFeesMaster from './feeRelated/QuickFeesMaster.tsx';
import AddFeesGroup from './feeRelated/AddFeesGroup.tsx';
import FeesTypeManager from './feeRelated/FeesTypeManager.tsx';
import FeesDiscountManager from './feeRelated/FeesDiscountManager.tsx';
import FeesCarryForward from './feeRelated/FeesCarryForward.tsx';
import FessReminder from './feeRelated/FessReminder.tsx';
import AddIncome from './income/AddIncome.tsx';
import SearchIncomePage from './income/SearchIncomePage.tsx';
import IncomeHeadPage from './income/IncomeHeadPage.tsx';
import AddExpenses from './Expenses/AddExpenses.tsx';
import SearchExpensesPage from './Expenses/SearchExpensesPage.tsx';
import ExpenseHeadPage from './Expenses/ExpenseHeadPage.tsx';
import GroupExam from './Examination/GroupExam.tsx'
import ExamResult from './Examination/ExamResult.tsx'
import ExamSchedule from './Examination/ExamSchedule.tsx'
import AdmitCardPage from './Examination/AdmitCardPage.tsx';
import PrintAdmitCard from './Examination/PrintAdmitCard.tsx';
import MarksGrade from './Examination/MarksGrade.tsx';
import MarkDivision from './Examination/MarkDivision.tsx';
import TeacherTimetable from './academics/TeacherTimetable.tsx';
import ClassTimetable from './academics/ClassTimetable.tsx';
import AssignClassTeacher from './academics/AssignClassTeacher.tsx';
import PromoteStudents from './academics/PromoteStudents.tsx';
import SubjectGroup from './academics/SubjectGroup.tsx';
import Subjects from './academics/Subjects.tsx';
import Classes from './academics/Classes.tsx';
import Sections from './academics/Sections.tsx';
import BookList from './Library/BookList.tsx';
import IssueReturn from './Library/IssueReturn.tsx';
import TransportFeesMaster from './transport/TransportFeesMaster.tsx';
import PickupPointList from './transport/PickupPointList.tsx';  
import RoutesAdd from './transport/RoutesAdd.tsx';
import VehicleList from './transport/VehicleList.tsx';
import AssignVehicle from './transport/AssignVehicle.tsx';
import RoutePickupPoint from './transport/RoutePickupPoint.tsx';
import TransportFees from './transport/TransportFees.tsx';
import IssueItem from './inventory/IssueItem.tsx';
import AddItemStocks from './inventory/AddItemStocks.tsx';
import ItemList from './inventory/ItemList.tsx';
import ItemCategory from './inventory/ItemCategory.tsx';
import ItemStore from './inventory/ItemStore.tsx';
import ItemSupplier from './inventory/ItemSupplier.tsx';
import DisableStudents from '../studentall/DisableStudents.tsx';
import TeacherForm from '../teacherAll/TeacherForm.jsx';
import ManageTeacher from '../teacherAll/ManageTeacher.jsx';
import MarksheetDesigner from './Examination/MarksheetDesigner.tsx';












const AdminDashboard = () => {
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar 
    open={open} 
    position="absolute" 
    sx={{ backgroundColor: "#9346eb" }} // Applying custom color
>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Admin Dashboard
                        </Typography>
                        <AccountMenu />
                    </Toolbar>
                    
                    
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <SideBar />
                    </List>
                </Drawer>
                <Box component="main" sx={styles.boxStyled}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<AdminHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                        <Route path="/Admin/profile" element={<AdminProfile />} />
                        <Route path="/Admin/complains" element={<SeeComplains />} />
                        <Route path="/Admin/addlibrarian" element={<AddLibrarian />} />
                        <Route path="/Admin/managelibrarians" element={<ManageLibrarians />} />


                        {/* Notice */}
                        <Route path="/Admin/addnotice" element={<AddNotice />} />
                        <Route path="/Admin/notices" element={<ShowNotices />} />

                        {/* Subject */}
                        <Route path="/Admin/subjects" element={<ShowSubjects />} />
                        <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                        <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />

                        <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                        <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />

                        <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                        <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                        {/* Class */}
                        <Route path="/Admin/addclass" element={<AddClass />} />
                        <Route path="/Admin/classes" element={<ShowClasses />} />
                        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
                        <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />

                        {/* Student */}
                        <Route path="/Admin/studentall/disablestudents" element={<DisableStudents />} />
                        <Route path="/Admin/studentall/disablereason" element={<DisableReason />} />
                        <Route path="/Admin/studentall/housestudent" element={<HouseStudent />} />
                        <Route path="/Admin/studentall/bulkdeletestudents" element={<BulkDeleteStudents />} />
                        <Route path="/Admin/studentall/categorymanager" element={<CategoryManager />} />
                        <Route path="/Admin/studentall/studentadmissionform" element={<StudentAdmissionForm />} />
                        <Route path="/Admin/studentall/studentdetail" element={<StudentDetail />} />
                        <Route path="/Admin/studentall/studentsearch" element={<StudentSearch />} />
                        <Route path="/Admin/studentall/studentdetailPage" element={<StudentDetailPage/>} />
                        <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                        <Route path="/Admin/students" element={<ShowStudents />} />
                        <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                        <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
                        <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />
                         
                        {/* Teacher */}
                        <Route path="/Admin/teachers" element={<ShowTeachers />} />
                        <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                        <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                        <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                        <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
                        <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />
                        
                        {/*Frontoffice*/}
                        <Route path="/Admin/frontoffice/admissionenquiry" element={<AdmissionEnquiry/>} />
                        <Route path="/Admin/frontoffice/visitorlist" element={<VisitorList/>} />
                        <Route path="/Admin/frontoffice/phone" element={<Phone/>} />
                        <Route path="/Admin/frontoffice/postaldispatch" element={<PostalDispatch/>} />
                        <Route path="/Admin/frontoffice/postalreceive" element={<PostalReceive/>} />
                        <Route path="/Admin/frontoffice/frontoffice" element={<FrontOffice/>} />
                        <Route path="/Admin/frontoffice/complaintpage" element={<ComplaintPage/>} />

                        {/*Fees*/}
                        <Route path="/Admin/feerelated/collectfeepage" element={<CollectFeePage/>} />
                        <Route path="/Admin/feerelated/offlinepayments" element={<OfflinePayments/>} />
                        <Route path="/Admin/feerelated/searchfeespayment" element={<SearchFeesPayment />} />
                        <Route path="/Admin/feerelated/searchduesfees" element={<SearchDuesFees />} />
                        <Route path="/Admin/feerelated/feesmaster" element={<FeesMaster />} />
                        <Route path="/Admin/feerelated/quickfeesmaster" element={<QuickFeesMaster />} />
                        <Route path="/Admin/feerelated/addfeesgroup" element={<AddFeesGroup />} />
                        <Route path="/Admin/feerelated/feestypemanager" element={<FeesTypeManager />} />
                        <Route path="/Admin/feerelated/feesdiscountmanager" element={<FeesDiscountManager />} />
                        <Route path="/Admin/feerelated/feescarryForward" element={<FeesCarryForward />} />
                        <Route path="/Admin/feerelated/fessreminder" element={<FessReminder />} />
                       
                        {/*income*/}
                        <Route path="/Admin/income/addincome" element={<AddIncome />} />
                        <Route path="/Admin/income/searchincomepage" element={<SearchIncomePage />} />
                        <Route path="/Admin/income/incomeheadpage" element={<IncomeHeadPage />} />


                         {/*Expenses*/}
                         <Route path="/Admin/expenses/addexpenses" element={<AddExpenses />} />
                         <Route path="/Admin/expenses/searchexpensespage" element={<SearchExpensesPage />} />
                         <Route path="/Admin/expenses/expenseheadpage" element={<ExpenseHeadPage />} />


                         {/*Examination*/}
                         <Route path="/Admin/examination/groupexam" element={<GroupExam />} />
                         <Route path="/Admin/examination/examschedule" element={<ExamSchedule />} />
                        
                         <Route path="/Admin/examination/examresult" element={<ExamResult />} />
                         <Route path="/Admin/examination/admitcardpage" element={<AdmitCardPage/>} />
                         <Route path="/Admin/examination/printadmitcard" element={<PrintAdmitCard/>} />
                         <Route path="/Admin/examination/markgrade" element={<MarksGrade/>} />
                         <Route path="/Admin/examination/markdivision" element={<MarkDivision/>} />
                         <Route path="/Admin/examination/marksheetdesigner" element={<MarksheetDesigner/>} />
                         


                          {/*Academics*/}
                          <Route path="/Admin/academics/teachertimetable" element={<TeacherTimetable/>} />
                          <Route path="/Admin/academics/classtimetable" element={<ClassTimetable/>} />
                          <Route path="/Admin/academics/assignclassteacher" element={<AssignClassTeacher/>} />
                          <Route path="/Admin/academics/promotestudents" element={<PromoteStudents/>} />
                          <Route path="/Admin/academics/subjectgroup" element={<SubjectGroup/>} />
                          <Route path="/Admin/academics/subjects" element={<Subjects/>} />
                          <Route path="/Admin/academics/Classes" element={<Classes/>} />
                          <Route path="/Admin/academics/sections" element={<Sections/>} />
                          <Route path="/Admin/library/booklist" element={<BookList/>} />
                          <Route path="/Admin/library/issuereturn" element={<IssueReturn/>} />


                        {/*Transport*/}
                        <Route path="/Admin/transport/transportfeesmaster" element={<TransportFeesMaster/>} />
                        <Route path="/Admin/transport/pickuppointlist" element={<PickupPointList/>} />
                        <Route path="/Admin/transport/RoutesAdd" element={<RoutesAdd/>} />
                        <Route path="/Admin/transport/vehiclelist" element={<VehicleList/>} />
                        <Route path="/Admin/transport/assignvehicle" element={<AssignVehicle/>} />
                        <Route path="/Admin/transport/routepickuppoint" element={<RoutePickupPoint/>} />
                        <Route path="/Admin/transport/TransportFees" element={<TransportFees/>} />

                        {/*Inventory*/}
                        <Route path="/Admin/inventory/IssueItem" element={<IssueItem/>} />
                        <Route path="/Admin/inventory/additemstocks" element={<AddItemStocks/>} />
                        <Route path="/Admin/inventory/itemlist" element={<ItemList/>} />
                        <Route path="/Admin/inventory/itemcategory" element={<ItemCategory/>} />
                        <Route path="/Admin/inventory/itemstore" element={<ItemStore/>} />
                        <Route path="/Admin/inventory/itemsupplier" element={<ItemSupplier/>} />


                        <Route path="/Admin/teacherall/teacherform" element={<TeacherForm/>} />
                        <Route path="/Admin/teacherall/manageteacher" element={<ManageTeacher/>} />




                          



                       



                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

export default AdminDashboard;

const styles = {
    boxStyled: (theme) => ({
        backgroundColor: '#e8c897',  // Force gold color
        color: theme.palette.text.primary,  // Keep theme text color
        flexGrow: 1,
        minHeight: '100vh',
        overflow: 'auto',
    })
    ,
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex",
        flexDirection: "column",
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}