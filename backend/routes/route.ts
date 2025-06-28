const router = require('express').Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.ts');

// const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.ts');
const { complainCreate, complainList } = require('../controllers/complain-controller.ts');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.ts');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance } = require('../controllers/student_controller.ts');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller');
// const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail,  deleteTeachersByClass,  updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.ts');
const { 
    librarianRegister, 
    librarianLogIn, 
    getLibrarians, 
    getLibrarianDetail, 
    deleteLibrarian 
} = require("../controllers/librarian-controller.ts");

// const { 
//     createSubjectGroup, 
//     getSubjectGroups, 
//     getSubjectGroupById, 
//     updateSubjectGroup, 
//     deleteSubjectGroup 
//   } = require('../controllers/subjectGroupController.ts');
  
//   router.post("/subjectgroups", createSubjectGroup);
//   router.get("/subjectgroups", getSubjectGroups);
//   router.get("/subjectgroups/:id", getSubjectGroupById);
//   router.put("/subjectgroups/:id", updateSubjectGroup);
//   router.delete("/subjectgroups/:id", deleteSubjectGroup);

      
const {
    getComplaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
  } = require('../controllers/complaintController');
  
  router.get('/complaints/:adminID', getComplaints);
  router.post('/complaint', addComplaint);
  router.put('/complaint/:id', updateComplaint);
  router.delete('/complaint/:id', deleteComplaint);

const classController = require('../controllers/fclass-controller');
const sectionController = require('../controllers/section-controller');


// Class Routes
router.get('/classes/:adminID', classController.getClasses);
router.post('/class', classController.addClass);
router.put('/class/:id', classController.updateClass);
router.delete('/class/:id', classController.deleteClass);

// Section Routes
router.get('/sections/:adminID', sectionController.getSections);
router.post('/section', sectionController.addSection);
router.put('/section/:id', sectionController.updateSection);
router.delete('/section/:id', sectionController.deleteSection);

const admissionEnquiryController = require('../controllers/admissionEnquiry-controller');

console.log('Registering admission-enquiry routes');
router.get('/admission-enquiries/:adminID', admissionEnquiryController.getAdmissionEnquiries);
router.post('/admission-enquiry', admissionEnquiryController.addAdmissionEnquiry);
router.put('/admission-enquiry/:id', admissionEnquiryController.updateAdmissionEnquiry);
router.delete('/admission-enquiry/:id', admissionEnquiryController.deleteAdmissionEnquiry);
const multer = require('multer');
const path = require('path');
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed'));
  },
});
const postalDispatchController = require('../controllers/postalDispatch-controller');
router.get('/postal-dispatches/:adminID',  postalDispatchController.getPostalDispatches);
router.post('/postal-dispatch',  upload.single('document'), postalDispatchController.addPostalDispatch);
router.put('/postal-dispatch/:id',  upload.single('document'), postalDispatchController.updatePostalDispatch);
router.delete('/postal-dispatch/:id',  postalDispatchController.deletePostalDispatch);



const postalReceiveController = require('../controllers/postalReceive-controller');
router.get('/postal-receives/:adminID',  postalReceiveController.getPostalReceives);
router.post('/postal-receive',  upload.single('document'), postalReceiveController.addPostalReceive);
router.put('/postal-receive/:id',  upload.single('document'), postalReceiveController.updatePostalReceive);
router.delete('/postal-receive/:id',  postalReceiveController.deletePostalReceive);
const{
  getPhoneCallLogs,
  addPhoneCallLog,
  updatePhoneCallLog,
  deletePhoneCallLog,
} = require("../controllers/phoneController");

router.get("/phoneCallLogs/:adminID", getPhoneCallLogs);
router.post("/phoneCallLog", addPhoneCallLog);
router.put("/phoneCallLog/:id", updatePhoneCallLog);
router.delete("/phoneCallLog/:id", deletePhoneCallLog);

const {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} = require('../controllers/frontOfficeController');

// Routes
router.get('/entries/:adminID/:type', getEntries); // Get entries by type and admin
router.post('/entry', addEntry); // Add new entry
router.put('/entry/:id', updateEntry); // Update entry
router.delete('/entry/:id', deleteEntry); // Delete entry


const { getVisitors, addVisitor, updateVisitor, deleteVisitor } = require('../controllers/visitorController');

router.get('/visitors/:adminID', getVisitors);
router.post('/visitor', addVisitor);
router.put('/visitor/:id', updateVisitor);
router.delete('/visitor/:id', deleteVisitor);

const { getIncomes, addIncome, updateIncome, deleteIncome, searchIncomes } = require('../controllers/incomeController');

router.get('/incomes/:adminID', getIncomes);
router.get('/incomes/search/:adminID', searchIncomes);
router.post('/income', addIncome);
router.put('/income/:id', updateIncome);
router.delete('/income/:id', deleteIncome);


const {
  getIncomeHeads,
  addIncomeHead,
  updateIncomeHead,
  deleteIncomeHead,
} = require('../controllers/incomeHeadController');

router.get('/income-heads/:adminID', getIncomeHeads);
router.post('/income-head', addIncomeHead);
router.put('/income-head/:id', updateIncomeHead);
router.delete('/income-head/:id', deleteIncomeHead);

const expenseController = require('../controllers/expenseController');

console.log('Registering expense routes');
router.get('/expenses/:adminID', expenseController.getExpenses);
router.post('/expense', upload.single('attachedFile'), expenseController.addExpense);
router.put('/expense/:id', upload.single('attachedFile'), expenseController.updateExpense);
router.delete('/expense/:id', expenseController.deleteExpense);


// const { getExpenseHeads, addExpenseHead } = require('../controllers/expenseHeadController');

// router.get('/expense-heads/:adminID', getExpenseHeads);
// router.post('/expense-head', addExpenseHead);




const expenseHeadController = require('../controllers/expense-head-controller');

console.log('Registering expense head routes');
router.get('/expense-heads/:adminID', expenseHeadController.getExpenseHeads);
router.post('/expense-head', expenseHeadController.addExpenseHead);
router.put('/expense-head/:id', expenseHeadController.updateExpenseHead);
router.delete('/expense-head/:id', expenseHeadController.deleteExpenseHead);

const transportRouteController = require('../controllers/route-controller');

router.get('/transport-routes/:adminID', transportRouteController.getTransportRoutes);
router.post('/transport-route', transportRouteController.addTransportRoute);
router.put('/transport-route/:id', transportRouteController.updateTransportRoute);
router.delete('/transport-route/:id', transportRouteController.deleteTransportRoute);

const vehicleController = require('../controllers/vehicle-controller');

// Vehicle Routes
router.get('/vehicles/:adminID', vehicleController.getVehicles);
router.post('/vehicle', vehicleController.addVehicle);
router.put('/vehicle/:id', vehicleController.updateVehicle);
router.delete('/vehicle/:id', vehicleController.deleteVehicle);


const assignmentController = require('../controllers/assignment-controller');

router.get('/assignments/:adminID', assignmentController.getAssignments);
router.post('/assignment', assignmentController.addAssignment);
router.put('/assignment/:id', assignmentController.updateAssignment);
router.delete('/assignment/:id', assignmentController.deleteAssignment);


const pickupPointController = require('../controllers/pickup-point-controller');

router.get('/pickup-points/:adminID', pickupPointController.getPickupPoints);
router.post('/pickup-point', pickupPointController.addPickupPoint);
router.put('/pickup-point/:id', pickupPointController.updatePickupPoint);
router.delete('/pickup-point/:id', pickupPointController.deletePickupPoint);


const routePickupPointController = require('../controllers/route-pickup-point-controller');

router.get('/route-pickup-points/:adminID', routePickupPointController.getRoutePickupPoints);
router.post('/route-pickup-point', routePickupPointController.addRoutePickupPoint);
router.put('/route-pickup-point/:id', routePickupPointController.updateRoutePickupPoint);
router.delete('/route-pickup-point/:id', routePickupPointController.deleteRoutePickupPoint);


const {
  getAdmissionForms,
  addAdmissionForm,
  updateAdmissionForm,
  deleteAdmissionForm,
} = require('../controllers/student-addmission-controller');

router.get('/admissionForms/:adminID', getAdmissionForms);
router.post('/admissionForm', addAdmissionForm);
router.put('/admissionForm/:id', updateAdmissionForm);
router.delete('/admissionForm/:id', deleteAdmissionForm);

// const searchStudentController = require('../controllers/search-student-controller');

// router.get('/search-class/:adminID', searchStudentController.getClasses);
// router.get('/search-student', searchStudentController.searchStudents);


const { searchStudents } = require('../controllers/student-search-controller');

router.get('/searchStudents/:adminID', searchStudents);


const { getAllStudents, bulkDeleteStudents } = require('../controllers/bulk-delete-controller');

router.get('/bulkDeleteStudents/:adminID', getAllStudents);
router.delete('/bulkDeleteStudents/:adminID', bulkDeleteStudents);


const { getAllCategories, createCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/categories/:adminID', getAllCategories);
router.post('/categories/:adminID', createCategory);
router.delete('/categories/:adminID/:categoryId', deleteCategory);

const { getAllHouses, createHouse, deleteHouse } = require('../controllers/houseController');

router.get('/houses/:adminID', getAllHouses);
router.post('/houses/:adminID', createHouse);
router.delete('/houses/:adminID/:houseId', deleteHouse);

const { getAllReasons, createReason, updateReason, deleteReason } = require('../controllers/reasonController');

router.get('/reasons/:adminID', getAllReasons);
router.post('/reasons/:adminID', createReason);
router.put('/reasons/:adminID/:reasonId', updateReason);
router.delete('/reasons/:adminID/:reasonId', deleteReason);

const {
  getAllDisabledStudents,
  createDisabledStudent,
  updateDisabledStudent,
  deleteDisabledStudent,
} = require('../controllers/disabledStudentController');

router.get('/disabled-students/:adminID', getAllDisabledStudents);
router.post('/disabled-students/:adminID', createDisabledStudent);
router.put('/disabled-students/:adminID/:disabledStudentId', updateDisabledStudent);
router.delete('/disabled-students/:adminID/:disabledStudentId', deleteDisabledStudent);


const teacherController = require('../controllers/teacherController');

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err.message.includes('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};
console.log('Registering teacher form routes');

// Define file fields for upload
const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'certificates', maxCount: 1 },
]);

router.post('/teacher-form', uploadFields, handleMulterError, teacherController.addTeacherForm);
router.get('/teachers', teacherController.getAllTeachers);
router.put('/teachers/:id', uploadFields, handleMulterError, teacherController.updateTeacher);
router.delete('/teachers/:id', teacherController.deleteTeacher);


const feeCollectionController = require('../controllers/feeCollectionController');

console.log('Registering fee collection routes');
router.get('/fee-collections/:adminID', feeCollectionController.getFeeCollections);
router.post('/fee-collection', feeCollectionController.addFeeCollection);
router.put('/fee-collection/:id', feeCollectionController.updateFeeCollection);
router.delete('/fee-collection/:id', feeCollectionController.deleteFeeCollection);


const offlinePaymentController = require('../controllers/offlinePaymentController');

console.log('Registering offline payment routes');
router.get('/offline-payments/:adminID', offlinePaymentController.getOfflinePayments);
router.post('/offline-payment', offlinePaymentController.addOfflinePayment);
router.put('/offline-payment/:id', offlinePaymentController.updateOfflinePayment);
router.delete('/offline-payment/:id', offlinePaymentController.deleteOfflinePayment);

const paymentSearchController = require('../controllers/paymentSearchController');

console.log('Registering payment search routes');
router.get('/search-payments', paymentSearchController.searchPayments);


const feeGroupController = require('../controllers/feeGroupController');

console.log('Registering fee group routes');
router.get('/fee-groups/:adminID', feeGroupController.getFeeGroups);
router.post('/fee-group', feeGroupController.addFeeGroup);
router.put('/fee-group/:id', feeGroupController.updateFeeGroup);
router.delete('/fee-group/:id', feeGroupController.deleteFeeGroup);


const feeTypeController = require('../controllers/feeTypeController');

console.log('Registering fee type routes');
router.get('/fee-types/:adminID', feeTypeController.getFeeTypes);
router.post('/fee-type', feeTypeController.addFeeType);
router.put('/fee-type/:id', feeTypeController.updateFeeType);
router.delete('/fee-type/:id', feeTypeController.deleteFeeType);


const feesMasterController = require('../controllers/feesMasterController');

console.log('Registering fees master routes');
router.get('/fees-masters/:adminID', feesMasterController.getFeesMasters);
router.post('/fees-master', feesMasterController.addFeesMaster);
router.put('/fees-master/:id', feesMasterController.updateFeesMaster);
router.delete('/fees-master/:id', feesMasterController.deleteFeesMaster);

const duesFeesController = require('../controllers/duesFeesController');

console.log('Registering dues fees routes');
router.get('/dues-fees', duesFeesController.searchDuesFees);
router.get('/dues-fees-options/:adminID', duesFeesController.getDuesFeesOptions);


const quickFeesMasterController = require('../controllers/quickFeesMasterController');

console.log('Registering quick fees master routes');
router.post('/quick-fees-master', quickFeesMasterController.generateInstallmentPlan);
router.get('/quick-fees-options/:adminID', quickFeesMasterController.getQuickFeesOptions);

const feeBalanceController = require('../controllers/feeBalanceController');

console.log('Registering fee balance routes');
router.get('/fee-balances/:adminID', feeBalanceController.getFeeBalances);
router.put('/fee-balances', feeBalanceController.updateFeeBalances);




const discountController = require('../controllers/discountController');

console.log('Registering discount routes');
router.get('/discounts/:adminID', discountController.getDiscounts);
router.post('/discounts/:adminID', discountController.createDiscount);
router.put('/discounts/:adminID/:id', discountController.updateDiscount);
router.delete('/discounts/:adminID/:id', discountController.deleteDiscount);


const reminderController = require('../controllers/reminderController');

console.log('Registering reminder routes');
router.get('/reminders/:adminID', reminderController.getReminders);
router.put('/reminders/:adminID', reminderController.updateReminders);

  const {
                createStore, 
                getStores, 
                updateStore, 
                deleteStore, 
                getStoreById 
              } 
              = require('../controllers/store-controller');


/* const { 
  addItemStock,
  getAllItemStocks,
  getItemStockDetails,
  updateItemStock,
  deleteItemStock
} = require('../controllers/Item');
   */


  /* const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController.ts'); */
 const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController'); // Supplier Controller








const {
addItemStock,
getAllItemStocks,
getItemStockById,
updateItemStock,
deleteItemStock,
//clearItemStockErrorAction
} = require('../controllers/AdditemController');


const {
  createIssueItemStock,
  getAllIssueItemStocks,
  getIssueItemStockDetails,
  updateIssueItemStock,
  deleteIssueItemStock,
  clearIssueItemStockErrorAction
} = require('../controllers/issueItemStockController'); // No .ts extension



const {
  createDivision,
  getDivisions,
  getDivisionById,
  updateDivision,
  deleteDivision

}= require('../controllers/division.controller'); 
// Route to create a division
//router.post('/divisions', createDivision);
router.post('/DivisionCreate', createDivision);
// Route to get all divisions by adminID (query parameter)
//router.get('/divisions', getDivisions);
router.get('/DivisionList', getDivisions);
// Route to get a division by its ID (URL param)
router.get('/Divisions/:id', getDivisionById);
// Route to update a division by ID
router.put('/Divisions/:id', updateDivision);
// Route to delete a division by ID and adminID in body
router.delete('/Divisions/:id', deleteDivision);


const {
  createMarkGrade,
  getAllMarkGrades,
  updateMarkGrade,
  deleteMarkGrade
} = require('../controllers/MarkGradeController');


router.post('/markgrade', createMarkGrade); // Singular
router.get('/markgrade', getAllMarkGrades); // Singular
router.put('/markgrade/:id', updateMarkGrade); // Singular
router.delete('/markgrade/:id', deleteMarkGrade); // Singular

// Issue Item Stock Routes
              
const issueItemController = require('../controllers/issueItemStockController');

// Routes for issue items
router.get('/issue-items/:adminID', issueItemController.getIssueItems); // Get all issue items
router.post('/issue-item', issueItemController.addIssueItem); // Add new issue item
router.put('/issue-item/:id', issueItemController.updateIssueItem); // Update issue item
router.delete('/issue-item/:id', issueItemController.deleteIssueItem); 


// Item Routes (consistent with /suppliers style)
const itemController = require('../controllers/itemController');

router.get('/items/:adminID', itemController.getAllItems);
router.post('/items', itemController.addItem);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);


router.post('/itemstocks', addItemStock);               // Create Item
router.get('/itemstocks', getAllItemStocks);               // Get all Items
router.get('/itemstocks/:id', getItemStockById);        // Get Item by ID
router.put('/itemstocks/:id', updateItemStock);            // Update Item
router.delete('/itemstocks/:id', deleteItemStock);         // Delete Item
 



/* router.post('/itemstocks', upload.single('document'), addItemStock);               // Create ItemStock with file
router.put('/itemstocks/:id', upload.single('document'), updateItemStock);         // Update ItemStock with file
router.get('/itemstocks', getAllItemStocks);                                       // Get all ItemStocks
router.get('/itemstocks/:id', getItemStockById);                                   // Get ItemStock by ID
router.delete('/itemstocks/:id', deleteItemStock); 
 */
       

// Subject Group routes (Newly added)

router.post('/suppliers', createSupplier);               // Create Supplier
router.get('/suppliers', getSuppliers);                  // Get all Suppliers
router.get('/suppliers/:id', getSupplierById);           // Get Supplier by ID
router.put('/suppliers/:id', updateSupplier);            // Update Supplier
router.delete('/suppliers/:id', deleteSupplier);         // Delete Supplier



const {
  createCategoryCard,
  getCategoryCards,
  getCategoryCardById,
  updateCategoryCard,
  deleteCategoryCard
} = require('../controllers/category2Controller.ts');

// Create CategoryCard
router.post('/categoryCards', createCategoryCard);

// Get all CategoryCards (optionally by adminID)
router.get('/categoryCards', getCategoryCards);

// Get CategoryCard by ID
router.get('/categoryCards/:id', getCategoryCardById);

// Update CategoryCard by ID
router.put('/categoryCards/:id', updateCategoryCard);

// Delete CategoryCard by ID
router.delete('/categoryCards/:id', deleteCategoryCard);





router.post('/StoreCreate', createStore);
router.get('/StoreList', getStores);
router.put('/Store/:id', updateStore);
router.delete('/Store/:id', deleteStore);
router.get('/Store/:id', getStoreById);


const stockItemController = require('../controllers/stockItemController');



router.get('/stock-items/:adminID',  stockItemController.getStockItems);
router.post('/stock-item',  upload.single('document'), stockItemController.addStockItem);
router.put('/stock-item/:id', upload.single('document'), stockItemController.updateStockItem);
router.delete('/stock-item/:id', stockItemController.deleteStockItem);


const examGroupController = require('../controllers/exam-group-controller');

router.get('/exam-groups/:adminID', examGroupController.getExamGroups);
router.post('/exam-group', examGroupController.addExamGroup);
router.put('/exam-group/:id', examGroupController.updateExamGroup);
router.delete('/exam-group/:id', examGroupController.deleteExamGroup);



const examScheduleController = require('../controllers/exam-schedule-controller');

router.get('/exam-schedules/:adminID', examScheduleController.getExamSchedules);
router.post('/exam-schedule', examScheduleController.addExamSchedule);
router.put('/exam-schedule/:id', examScheduleController.updateExamSchedule);
router.delete('/exam-schedule/:id', examScheduleController.deleteExamSchedule);



const examResultController = require('../controllers/exam-result-controller');

router.get('/exam-results/:adminID', examResultController.getExamResults);
router.post('/exam-result', examResultController.addExamResult);
router.put('/exam-result/:id', examResultController.updateExamResult);
router.delete('/exam-result/:id', examResultController.deleteExamResult);


const admitCardController = require('../controllers/admit-card-controller');

router.get('/admit-cards/:adminID', admitCardController.getAdmitCards);
router.post('/admit-card', admitCardController.addAdmitCard);
router.put('/admit-card/:id', admitCardController.updateAdmitCard);
router.delete('/admit-card/:id', admitCardController.deleteAdmitCard);




const marksheetController = require('../controllers/marksheet-controller');

router.get('/marksheets/:adminID', marksheetController.getMarksheets);
router.post('/marksheet', marksheetController.addMarksheet);
router.put('/marksheet/:id', marksheetController.updateMarksheet);
router.delete('/marksheet/:id', marksheetController.deleteMarksheet);


const transportFeesController = require('../controllers/transport-fees-controller');

router.get('/transport-fees/:adminID', transportFeesController.getTransportFees);
router.post('/transport-fees', transportFeesController.addTransportFees);
router.put('/transport-fees/:id', transportFeesController.updateTransportFees);
router.delete('/transport-fees/:id', transportFeesController.deleteTransportFees);
router.post('/transport-fees/copy', transportFeesController.copyTransportFees);



const addTransportFeeController = require('../controllers/add-transport-fee-controller');

router.get('/add-transport-fees/:adminID', addTransportFeeController.getAddTransportFees);
router.post('/add-transport-fee', addTransportFeeController.addAddTransportFee);
router.put('/add-transport-fee/:id', addTransportFeeController.updateAddTransportFee);
router.delete('/add-transport-fee/:id', addTransportFeeController.deleteAddTransportFee);


const promotionController = require('../controllers/promoteStudentController');

router.get('/promotions', promotionController.getPromotions);
router.put('/promotion/:id', promotionController.updatePromotion);
router.post('/promote-promotions', promotionController.promotePromotions);


const subjectGroupController = require('../controllers/subjectGroupController');

router.get('/subject-groups', subjectGroupController.getSubjectGroups);
router.post('/subject-group', subjectGroupController.addOrUpdateSubjectGroup);
router.delete('/subject-group/class', subjectGroupController.deleteClassFromGroup);

const subjectiveController = require('../controllers/subjectiveController');

router.get('/subjectives/:adminID', subjectiveController.getSubjectives);
router.post('/subjective', subjectiveController.addSubjective);
router.put('/subjective/:id', subjectiveController.updateSubjective);
router.delete('/subjective/:id', subjectiveController.deleteSubjective);

const classTeacherAssignmentController = require('../controllers/class-teacher-assignment-controller');

router.get('/class-teacher-assignments/:adminID', classTeacherAssignmentController.getClassTeacherAssignments);
router.get('/teachers/:adminID', classTeacherAssignmentController.getTeachers);
router.post('/class-teacher-assignment', classTeacherAssignmentController.addClassTeacherAssignment);
router.put('/class-teacher-assignment/:id', classTeacherAssignmentController.updateClassTeacherAssignment);
router.delete('/class-teacher-assignment/:id', classTeacherAssignmentController.deleteClassTeacherAssignment);

const timetableController = require('../controllers/timetableController');

// Debug: Log controller import
console.log('timetableController imported:', timetableController);

router.get('/:adminID/:teacherId', timetableController.getTeacherTimetable);
router.post('/attendance/:adminID', timetableController.addAttendance);
router.post('/:adminID', timetableController.addTimetable);















































































































// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail)
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// Student

router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn)

router.get("/Students/:id", getStudents)
router.get("/Student/:id", getStudentDetail)

router.delete("/Students/:id", deleteStudents)
router.delete("/StudentsClass/:id", deleteStudentsByClass)
router.delete("/Student/:id", deleteStudent)

router.put("/Student/:id", updateStudent)

router.put('/UpdateExamResult/:id', updateExamResult)

router.put('/StudentAttendance/:id', studentAttendance)

router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance)

// Teacher

// router.post('/TeacherReg', teacherRegister);
// router.post('/TeacherLogin', teacherLogIn)

// router.get("/Teachers/:id", getTeachers)
// router.get("/Teacher/:id", getTeacherDetail)

// // router.delete("/Teachers/:id", deleteTeachers)
// router.delete("/TeachersClass/:id", deleteTeachersByClass)
// // router.delete("/Teacher/:id", deleteTeacher)

// router.put("/TeacherSubject", updateTeacherSubject)

// router.post('/TeacherAttendance/:id', teacherAttendance)

// Notice

router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices)
router.delete("/Notice/:id", deleteNotice)

router.put("/Notice/:id", updateNotice)

// Complain

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);

// Sclass

// router.post('/SclassCreate', sclassCreate);

// router.get('/SclassList/:id', sclassList);
// router.get("/Sclass/:id", getSclassDetail)

// router.get("/Sclass/Students/:id", getSclassStudents)

// router.delete("/Sclasses/:id", deleteSclasses)
// router.delete("/Sclass/:id", deleteSclass)

// Subject

// router.post('/SubjectCreate', subjectCreate);

// router.get('/AllSubjects/:id', allSubjects);
// router.get('/ClassSubjects/:id', classSubjects);
// router.get('/FreeSubjectList/:id', freeSubjectList);
// router.get("/Subject/:id", getSubjectDetail)

// router.delete("/Subject/:id", deleteSubject)
// router.delete("/Subjects/:id", deleteSubjects)
// router.delete("/SubjectsClass/:id", deleteSubjectsByClass)

//librarian
 // ✅ `.ts` hata diya agar file `.js` hai

// ✅ Librarian Routes
router.post("/LibrarianReg", librarianRegister);
router.post("/LibrarianLogin", librarianLogIn);
router.get("/Librarians", getLibrarians);
router.get("/Librarian/:id", getLibrarianDetail);
router.delete("/Librarian/:id", deleteLibrarian);

//sections

// Section






module.exports = router;