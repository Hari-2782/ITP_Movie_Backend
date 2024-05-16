var  express = require("express");
var  router = express.Router();
const Authent = require('../MiddleWares/auth')

//employee
const employeeController = require('../controller/EmployeeController');
router.get('/api/employee',employeeController.getAllEmployee)
router.post('/api/employee',employeeController.createEmployee)
router.put('/api/employee/:id',employeeController.UpdateEmployee)
router.delete('/api/employee/:id',employeeController.deleteEmployee)
//leave
const leaveController = require('../controller/leave_controller')

router.get('/api/leave/',Authent,leaveController.getAllLeaveForEmployee)
router.post('/api/leave',Authent,leaveController.createLeave)

router.put('/api/leave/:id',Authent,leaveController.updateLeave)
router.delete('/api/leave/:id',Authent,leaveController.deleteLeave)




//fileuploads
const fileUploading = require('../controller/fileupload')
router.post('/api/fileupload',fileUploading.EmployeeProfile)
//user
 const user = require('../controller/user_controller');
router.post('/api/login',user.UserLogin);
router.get('/api/user',Authent,user.getUser)



const leavefile=require('../controller/leavefileupload')
router.post('/api/leavefileupload',Authent,leavefile.Leavefileupload)
const leaveapprove=require('../controller/Leavepermit_controller')
router.get('/api/leavepermit',leaveapprove.getAllLeave)
router.put('/api/leavepermit/:id',leaveapprove.UpdateEmployee)
const attendanceController = require('../controller/Attendance_controller');
router.post('/api/attendance/:employeeId', attendanceController.recordAttendance);





module.exports = router;