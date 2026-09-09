const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const abhaController = require('../controllers/abhaController');
const hospitalController = require('../controllers/hospitalController');
const doctorController = require('../controllers/doctorController');
const appointmentController = require('../controllers/appointmentController');
const teleconsultationController = require('../controllers/teleconsultationController');
const medicalStoreController = require('../controllers/medicalStoreController');
const prescriptionController = require('../controllers/prescriptionController');
const recordController = require('../controllers/recordController');
const emergencyContactController = require('../controllers/emergencyContactController');
const opdController = require('../controllers/opdController');
const alertCampController = require('../controllers/alertCampController');
const statsController = require('../controllers/statsController');

// 1. AUTHENTICATION (Public login, protected /me)
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authenticateToken, authController.getCurrentUser);

// 2. USER MANAGEMENT (Strictly ADMIN only)
router.get('/users', authenticateToken, requireRole('ADMIN'), userController.getUsers);
router.post('/users', authenticateToken, requireRole('ADMIN'), userController.createUser);
router.put('/users/:id', authenticateToken, requireRole('ADMIN'), userController.updateUser);
router.delete('/users/:id', authenticateToken, requireRole('ADMIN'), userController.deleteUser);

// 3. ABHA PROFILES (CareBridge Mobile lookup and registration)
router.get('/abha/profiles', abhaController.getProfilesByMobile);
router.get('/abha/profiles/:id', abhaController.getProfileById);
router.post('/abha/profiles', abhaController.createProfile);

// 4. HOSPITALS & FACILITIES
// Read is open to all clients (Admin, Government, Patient)
router.get('/hospitals', hospitalController.getHospitals);
router.get('/facilities', hospitalController.getHospitals);
router.get('/hospitals/:id', hospitalController.getHospitalById);
router.get('/facilities/:id', hospitalController.getHospitalById);
// Modifications strictly ADMIN only
router.post('/hospitals', authenticateToken, requireRole('ADMIN'), hospitalController.createHospital);
router.post('/facilities', authenticateToken, requireRole('ADMIN'), hospitalController.createHospital);
router.put('/hospitals/:id', authenticateToken, requireRole('ADMIN'), hospitalController.updateHospital);
router.put('/facilities/:id', authenticateToken, requireRole('ADMIN'), hospitalController.updateHospital);
router.delete('/hospitals/:id', authenticateToken, requireRole('ADMIN'), hospitalController.deleteHospital);
router.delete('/facilities/:id', authenticateToken, requireRole('ADMIN'), hospitalController.deleteHospital);

// 5. DOCTORS & SLOTS
router.get('/doctors', doctorController.getDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.get('/doctors/:id/slots', doctorController.getDoctorSlots);

// 6. APPOINTMENTS
router.get('/appointments', appointmentController.getAppointments);
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id/cancel', appointmentController.cancelAppointment);

// 7. TELECONSULTATIONS
router.get('/teleconsultations', teleconsultationController.getTeleconsultations);
router.post('/teleconsultations', teleconsultationController.createTeleconsultation);

// 8. MEDICAL STORES
router.get('/medical-stores', medicalStoreController.getMedicalStores);
router.post('/medical-stores', authenticateToken, requireRole('ADMIN'), medicalStoreController.createMedicalStore);
router.put('/medical-stores/:id', authenticateToken, requireRole('ADMIN'), medicalStoreController.updateMedicalStore);
router.delete('/medical-stores/:id', authenticateToken, requireRole('ADMIN'), medicalStoreController.deleteMedicalStore);

// 9. PRESCRIPTIONS & MEDICINE ORDERS
router.get('/prescriptions', prescriptionController.getPrescriptions);
router.get('/prescriptions/:id', prescriptionController.getPrescriptionById);
router.get('/medicine-orders', prescriptionController.getMedicineOrders);
router.post('/medicine-orders', prescriptionController.createMedicineOrder);

// 10. HEALTH RECORDS & LAB REPORTS
router.get('/records', recordController.getRecords);
router.post('/records', recordController.createRecord);
router.get('/lab-reports', recordController.getLabReports);

// 11. EMERGENCY CONTACTS
router.get('/emergency-contacts', emergencyContactController.getEmergencyContacts);
router.post('/emergency-contacts', emergencyContactController.addEmergencyContact);
router.put('/emergency-contacts/:id', emergencyContactController.updateEmergencyContact);
router.delete('/emergency-contacts/:id', emergencyContactController.deleteEmergencyContact);

// 12. OPD CARDS
router.get('/opd', opdController.getOpdCard);
router.post('/opd', opdController.createOpdCard);

// 13. HEALTH ALERTS & HEALTH CAMPS & REFERRALS & NOTIFICATIONS
router.get('/health-alerts', alertCampController.getHealthAlerts);
router.post('/health-alerts', authenticateToken, requireRole(['ADMIN', 'GOVERNMENT']), alertCampController.createHealthAlert);
router.get('/health-camps', alertCampController.getHealthCamps);
router.post('/health-camps', authenticateToken, requireRole(['ADMIN', 'GOVERNMENT']), alertCampController.createHealthCamp);
router.get('/referrals', alertCampController.getReferrals);
router.get('/notifications', alertCampController.getNotifications);

// 14. STATS & KPIS
router.get('/stats', statsController.getStats);

module.exports = router;
