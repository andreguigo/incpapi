const ExcelJS = require('exceljs');
const Customer = require('../models/Customer');

async function exportCustomersExcel (req, res, customers) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Customers');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Full Name', key: 'fullName', width: 30 },
            { header: 'Birth Date', key: 'birthDate', width: 15 },
            { header: 'Phone Customer', key: 'phoneCustomer', width: 15 },
            { header: 'Volunteer Area', key: 'selectedVolunteerArea', width: 25 },
            { header: 'Baptism Date', key: 'baptismDate', width: 15 },
            { header: 'Member Date', key: 'selectedMemberDate', width: 15 },
            { header: 'Image URL', key: 'fileNameUrl', width: 50 },
        ];

        customers.forEach(customer => {
            worksheet.addRow({
                id: customer.id,
                fullName: customer.fullName,
                birthDate: customer.birthDate,
                phoneCustomer: customer.phoneCustomer,
                selectedVolunteerArea: customer.selectedVolunteerArea,
                baptismDate: customer.baptismDate,
                selectedMemberDate: customer.selectedMemberDate,
                fileNameUrl: customer.fileNameUrl
            })
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error exporting customers:', err);
        res.status(500).json({ success: false, message: 'Failed to export customers' });
    }
};

module.exports = { exportCustomersExcel };