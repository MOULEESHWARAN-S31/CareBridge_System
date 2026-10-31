const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/routes/api.js');
let content = fs.readFileSync(filePath, 'utf8');

const addition = `
// 17. GOVERNMENT DASHBOARD OPERATIONS
const governmentController = require('../controllers/governmentController');

// Profile & Authorized Scope
router.get('/government/me', authenticateToken, requireGovernmentScope('ANY'), governmentController.getGovernmentProfile);

// Camp Proposals (Full lifecycle)
router.get('/government/camps', authenticateToken, requireGovernmentScope('ANY'), governmentController.getCampProposals);
router.post('/government/camps', authenticateToken, requireGovernmentScope('ANY'), governmentController.createCampProposal);
router.put('/government/camps/:id/status', authenticateToken, requireGovernmentScope('ANY'), governmentController.updateCampStatus);

// Community Requests
router.get('/government/community-requests', authenticateToken, requireGovernmentScope('ANY'), governmentController.getCommunityRequests);
router.put('/government/community-requests/:id/status', authenticateToken, requireGovernmentScope('ANY'), governmentController.updateCommunityRequestStatus);
router.post('/government/community-requests/:id/convert', authenticateToken, requireGovernmentScope('ANY'), governmentController.convertCommunityRequestToCamp);

// Resource Requests (District -> State)
router.get('/government/resource-requests', authenticateToken, requireGovernmentScope('ANY'), governmentController.getResourceRequests);
router.post('/government/resource-requests', authenticateToken, requireGovernmentScope('ANY'), governmentController.createResourceRequest);
router.put('/government/resource-requests/:id', authenticateToken, requireGovernmentScope('ANY'), governmentController.updateResourceRequest);

// Medicine Requisitions
router.get('/government/medicine-requisitions', authenticateToken, requireGovernmentScope('ANY'), governmentController.getMedicineRequisitions);
router.post('/government/medicine-requisitions', authenticateToken, requireGovernmentScope('ANY'), governmentController.createMedicineRequisition);

// Audit Events
router.get('/government/audit-events', authenticateToken, requireGovernmentScope('ANY'), governmentController.getAuditEvents);
router.post('/government/audit-events', authenticateToken, requireGovernmentScope('ANY'), governmentController.createAuditEvent);

// Announcements
router.get('/government/announcements', authenticateToken, requireGovernmentScope('ANY'), governmentController.getAnnouncements);
router.post('/government/announcements', authenticateToken, requireGovernmentScope('ANY'), governmentController.createAnnouncement);
router.put('/government/announcements/:id/status', authenticateToken, requireGovernmentScope('ANY'), governmentController.updateAnnouncementStatus);

`;

if (!content.includes('/government/camps')) {
  content = content.replace('module.exports = router;', addition + '\nmodule.exports = router;');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated api.js with government endpoints');
} else {
  console.log('Routes already present in api.js');
}

