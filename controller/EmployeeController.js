const employedb = require('../models/Employee_model');
const uuid = require('uuid');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
exports.getAllEmployee= async (req,res)=>{
  try{  
  const employee = await employedb.find()
     res.json(employee);
  }catch(err){
     res.status(500).send({message:err.message||`Error while retrieving Employee information`})
    }
 }
 
const generatePDF = async (emp) => {
  return new Promise(async (resolve, reject) => {
      try {
          console.log("Generating PDF for employee:", emp);

          const doc = new PDFDocument();

          // Buffer to store PDF data
          let buffers = [];

          // Generate QR code
          const url = await QRCode.toDataURL(`${emp._id}`, { errorCorrectionLevel: 'H' });

          // Add QR code image to PDF
          doc.image(url, 50, 50, { width: 100, height: 100 });

          // Add employee details
          doc.text(`WELCOME TO BALA CINEMA `, 170, 20);
          doc.text(`Employee ID: ${emp.EmployeeId}`, 170, 50);
          doc.text(`Employee Name: ${emp.EmployeeName}`, 170, 70);
          doc.text(`Email: ${emp.email}`, 170, 90);
          doc.text(`Department: ${emp.Department}`, 170, 110);
          doc.text(`Date: ${new Date().toLocaleDateString()}`, 170, 130);
          doc.text(`This QR code is for attendance purposes only. .`, 170, 150);
          doc.text(`Do not share it for any malpractices.`, 170, 170);

          // Finalize PDF generation
          doc.on('data', buffers.push.bind(buffers));
          doc.end();

          // Handle PDF generation completion
          doc.on('end', () => {
              const pdfData = Buffer.concat(buffers);
              resolve(pdfData);
          });

      } catch (error) {
          console.error('Error generating PDF:', error);
          reject(error);
      }
  });
};


const sendWelcomeEmail = (toEmail, employeeName, pdfData) => {
    return new Promise((resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'balacinema235@gmail.com', 
                    pass: 'bzfv mdhl rgic rlhu' 
                }
            });

            const mailOptions = {
                from: 'balacinema235@gmail.com', 
                to: toEmail, 
                subject: 'Welcome to Bala Cinema',
                text: `Dear ${employeeName},\n\nWelcome to Bala Cinema! Please find attached your attendance QR code. \n\nRegards,\nThe Bala Cinema Team`,
                attachments: [
                    {
                        filename: `Attendance_QR_Code.pdf`, 
                        content: pdfData // PDF data
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending welcome email:', error);
                    reject(error);
                } else {
                    console.log('Welcome email sent successfully');
                    resolve(info);
                }
            });
        } catch (error) {
            console.error('Error sending welcome email:', error);
            reject(error);
        }
    });
};

exports.createEmployee = async (req, res) => {
    const { EmployeeName, Department, Date_of_Joining, PhotoFileName, email, password, imei } = req.body;

    if (!EmployeeName || !Department || !Date_of_Joining || !PhotoFileName || !email || !password ) {
        return res.status(400).json({ message: 'Content cannot be empty!' });
    }

    try {
        const employee = new employedb({
            EmployeeId: uuid.v4().slice(0, 4),
            EmployeeName,
            Department,
            Date_of_Joining,
            PhotoFileName,
            email,
            password,
        });

        const data = await employee.save();

        const pdfData = await generatePDF({
            _id: data._id,
            EmployeeId: data.EmployeeId,
            EmployeeName: data.EmployeeName,
            email: data.email,
            Department: data.Department
        });

        await sendWelcomeEmail(email, EmployeeName, pdfData);

        // Send the response
        res.status(201).json({ data, pdfData });

    } catch (err) {
        console.error("Error creating employee:", err);
        res.status(500).json({ message: 'Error adding Employee to database', error: err });
    }
};



exports.UpdateEmployee = async (req,res)=>{
  if(!req.body){
      return res
           .status(404)
           .send({message:err.message ||`Error while updating the data cannot be empty`});
   }
  try{  
    const id =req.params.id;
  const data = await employedb.findByIdAndUpdate(id,req.body)
    if(data){
      res.json(data);
    } else{
      res.status(404).send({message:err.message ||`cannot update Employee with identified id ${id} or maybe user not found!`});
    }
  }catch(err){
  res.status(500).send({message: err.message || `error updating Employee information`});
   }
  }
  
  exports.deleteEmployee = async (req,res)=>{
  try{  
    const id = req.params.id
   const data = await employedb.findByIdAndDelete(id)
      if(!data){
          res.status(404).send({message:`Cannot delete Employee with id ${id} maybe id is wrong!`});
      }else{
          res.json({message:`Employee was deleted successfully!`});
      }
    }catch(err){
      res.status(500).send({message:`Could not delete Employee with id ${id}`});
     }
  }