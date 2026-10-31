const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/routes/api.js');
let content = fs.readFileSync(filePath, 'utf8');

const crossRoutes = `
// 18. CROSS-DASHBOARD SHARED SYNCHRONIZATION
const crossDashboardController = require('../controllers/crossDashboardController');

// Facility Medicine Inventory (Hospital <-> Government)
router.get('/hospital/medicines', crossDashboardController.getFacilityMedicines);
router.put('/hospital/medicines/:id', authenticateToken, crossDashboardController.updateFacilityMedicineStock);

// Facility Diagnostics (Hospital <-> Government)
router.get('/hospital/diagnostics', crossDashboardController.getFacilityDiagnostics);
router.put('/hospital/diagnostics/:id', authenticateToken, crossDashboardController.updateFacilityDiagnosticStatus);

// Health Camp Hospital Assignments (Government <-> Hospital Staff)
router.get('/hospital/camp-assignments', crossDashboardController.getHospitalCampAssignments);
router.put('/hospital/camp-assignments/:id', authenticateToken, crossDashboardController.respondToCampAssignment);

// Admin Bulk Import (Transactional PostgreSQL Import)
router.post('/admin/bulk-import/hospitals', authenticateToken, requireRole('ADMIN'), crossDashboardController.bulkImportHospitals);
`;

if (!content.includes('/hospital/medicines')) {
  content = content.replace('module.exports = router;', crossRoutes + '\nmodule.exports = router;');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully appended cross-dashboard routes to api.js');
} else {
  console.log('Cross-dashboard routes already exist');
}

