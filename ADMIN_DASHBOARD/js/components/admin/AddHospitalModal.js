/**
 * CareBridge Admin Dashboard — AddHospitalModal Component
 * Implements Requirements 13 & 14:
 * Multi-section form:
 * - Basic Information (Name, Hospital ID, Type, Govt/Private, Reg #)
 * - Location (State, District, Taluk, City, Address, PIN, Coordinates)
 * - Contact (Phone, Email, Emergency Contact)
 * - Capacity (Total Beds, ICU Beds, Emergency Beds, General Beds)
 * - Services (OPD, Emergency, Pharmacy, Lab, X-Ray, CT, MRI, Ultrasound, Blood Bank, Ambulance, Telemedicine)
 * - Hospital Administrator Assignment
 */

import { adminStore } from '../../store/adminStore.js';

export function createAddHospitalModal() {
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.id = 'modal-add-hospital';

  const defaultHospId = `HOSP-SLM-00${adminStore.hospitals.length + 1}`;
  const hospitalAdmins = adminStore.users.filter(u => u.role === 'Hospital Administrator');

  overlay.innerHTML = `
    <div class="admin-modal-card wide">
      <div class="admin-modal-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-teal-600);"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>
          <h3 class="admin-modal-title">Register Healthcare Facility / Hospital</h3>
        </div>
        <button type="button" class="admin-modal-close-btn" id="btn-close-add-hosp" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <form id="form-add-hospital">
        <div class="admin-modal-body">
          <!-- 1. Basic Information -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>1. Basic Facility Information</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="inp-hosp-name">Hospital Name *</label>
              <input type="text" class="field-input" id="inp-hosp-name" required placeholder="e.g. Government Taluk Hospital, Omalur" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-id">Hospital ID *</label>
              <input type="text" class="field-input" id="inp-hosp-id" required value="${defaultHospId}" placeholder="e.g. HOSP-SLM-007" />
            </div>

            <div class="form-field">
              <label class="field-label" for="sel-hosp-type">Hospital Type *</label>
              <select class="field-select" id="sel-hosp-type">
                <option value="District Hospital">District Hospital</option>
                <option value="Government Hospital">Government Hospital</option>
                <option value="Taluk Hospital" selected>Taluk Hospital</option>
                <option value="Community Health Centre">Community Health Centre</option>
                <option value="Primary Health Centre">Primary Health Centre</option>
                <option value="Specialty Hospital">Specialty Hospital</option>
              </select>
            </div>

            <div class="form-field">
              <label class="field-label" for="sel-hosp-ownership">Sector / Ownership *</label>
              <select class="field-select" id="sel-hosp-ownership">
                <option value="Government" selected>Government</option>
                <option value="Private">Private / Public-Private Partnership</option>
              </select>
            </div>

            <div class="form-field full-width">
              <label class="field-label" for="inp-hosp-reg">Registration / License Number *</label>
              <input type="text" class="field-input" id="inp-hosp-reg" required placeholder="e.g. TN-MED-SLM-4018" />
            </div>
          </div>

          <!-- 2. Location & Geographical Data -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>2. Location & Geographic Positioning</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="sel-hosp-district">District *</label>
              <select class="field-select" id="sel-hosp-district">
                ${adminStore.districts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-taluk">Taluk *</label>
              <input type="text" class="field-input" id="inp-hosp-taluk" required value="Salem" placeholder="e.g. Omalur / Attur" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-city">City / Town / Village *</label>
              <input type="text" class="field-input" id="inp-hosp-city" required placeholder="e.g. Omalur Town" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-pin">PIN Code *</label>
              <input type="text" class="field-input" id="inp-hosp-pin" required placeholder="e.g. 636455" />
            </div>

            <div class="form-field full-width">
              <label class="field-label" for="inp-hosp-address">Complete Postal Address *</label>
              <textarea class="field-textarea" id="inp-hosp-address" required placeholder="Street address, landmarks, premises..."></textarea>
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-lat">Latitude</label>
              <input type="number" step="any" class="field-input" id="inp-hosp-lat" value="11.6643" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-lng">Longitude</label>
              <input type="number" step="any" class="field-input" id="inp-hosp-lng" value="78.1460" />
            </div>
          </div>

          <!-- 3. Contact Details -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>3. Contact & Emergency Channels</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="inp-hosp-phone">Telephone Contact *</label>
              <input type="tel" class="field-input" id="inp-hosp-phone" required placeholder="+91 427 2415000" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-email">Official Health Email *</label>
              <input type="email" class="field-input" id="inp-hosp-email" required placeholder="contact@hospital.tn.gov" />
            </div>

            <div class="form-field full-width">
              <label class="field-label" for="inp-hosp-emergency">Emergency Desk / Ambulance Hotline</label>
              <input type="tel" class="field-input" id="inp-hosp-emergency" value="108 / +91 427 2415911" />
            </div>
          </div>

          <!-- 4. Bed Capacity -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
            <span>4. Bed Capacity & Specialized Wards</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="inp-hosp-beds-total">Total Sanctioned Beds *</label>
              <input type="number" min="5" max="5000" class="field-input" id="inp-hosp-beds-total" required value="150" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-beds-icu">ICU Beds</label>
              <input type="number" min="0" max="500" class="field-input" id="inp-hosp-beds-icu" value="15" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-beds-emg">Emergency / Triage Beds</label>
              <input type="number" min="0" max="200" class="field-input" id="inp-hosp-beds-emg" value="15" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-hosp-beds-gen">General Ward Beds</label>
              <input type="number" min="0" max="4500" class="field-input" id="inp-hosp-beds-gen" value="120" />
            </div>
          </div>

          <!-- 5. Healthcare Services (Requirement 13 Checkboxes) -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>5. Certified Clinical Services Provided</span>
          </div>

          <div class="checkbox-grid" id="hosp-services-grid">
            <label class="checkbox-item"><input type="checkbox" value="OPD" checked /> <span>OPD</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Emergency" checked /> <span>Emergency</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Pharmacy" checked /> <span>Pharmacy</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Laboratory" checked /> <span>Laboratory</span></label>
            <label class="checkbox-item"><input type="checkbox" value="X-Ray" checked /> <span>X-Ray</span></label>
            <label class="checkbox-item"><input type="checkbox" value="CT" /> <span>CT</span></label>
            <label class="checkbox-item"><input type="checkbox" value="MRI" /> <span>MRI</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Ultrasound" checked /> <span>Ultrasound</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Blood Bank" /> <span>Blood Bank</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Ambulance" checked /> <span>Ambulance</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Telemedicine" checked /> <span>Telemedicine</span></label>
          </div>

          <!-- 6. Hospital Administrator Assignment (Requirement 14) -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span>6. Assign Hospital Administrator (Requirement 14)</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field full-width">
              <label class="field-label" for="sel-hosp-admin-assign">Select or Assign Facility Administrator</label>
              <select class="field-select" id="sel-hosp-admin-assign">
                <option value="">-- Assign Later / Pending Verification --</option>
                ${hospitalAdmins.map(a => `<option value="${a.userId}">${a.fullName} (${a.userId}) - ${a.assignedOrgName}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button type="button" class="btn-secondary" id="btn-cancel-add-hosp">Cancel</button>
          <button type="submit" class="btn-primary-action" id="btn-submit-add-hosp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Submit Hospital for Accreditation</span>
          </button>
        </div>
      </form>
    </div>
  `;

  const close = () => adminStore.closeModal();
  overlay.querySelector('#btn-close-add-hosp').addEventListener('click', close);
  overlay.querySelector('#btn-cancel-add-hosp').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const form = overlay.querySelector('#form-add-hospital');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedServices = [];
    overlay.querySelectorAll('#hosp-services-grid input:checked').forEach(cb => {
      selectedServices.push(cb.value);
    });

    const adminSelect = overlay.querySelector('#sel-hosp-admin-assign');
    const selectedAdminOpt = adminSelect.options[adminSelect.selectedIndex];

    const hospitalData = {
      name: overlay.querySelector('#inp-hosp-name').value,
      hospitalId: overlay.querySelector('#inp-hosp-id').value,
      type: overlay.querySelector('#sel-hosp-type').value,
      ownership: overlay.querySelector('#sel-hosp-ownership').value,
      registrationNumber: overlay.querySelector('#inp-hosp-reg').value,
      state: 'Tamil Nadu',
      district: overlay.querySelector('#sel-hosp-district').value,
      taluk: overlay.querySelector('#inp-hosp-taluk').value,
      cityVillage: overlay.querySelector('#inp-hosp-city').value,
      pinCode: overlay.querySelector('#inp-hosp-pin').value,
      address: overlay.querySelector('#inp-hosp-address').value,
      latitude: overlay.querySelector('#inp-hosp-lat').value,
      longitude: overlay.querySelector('#inp-hosp-lng').value,
      phone: overlay.querySelector('#inp-hosp-phone').value,
      email: overlay.querySelector('#inp-hosp-email').value,
      emergencyContact: overlay.querySelector('#inp-hosp-emergency').value,
      totalBeds: overlay.querySelector('#inp-hosp-beds-total').value,
      icuBeds: overlay.querySelector('#inp-hosp-beds-icu').value,
      emergencyBeds: overlay.querySelector('#inp-hosp-beds-emg').value,
      generalBeds: overlay.querySelector('#inp-hosp-beds-gen').value,
      services: selectedServices,
      status: 'Pending Verification',
      assignedAdminId: adminSelect.value || null,
      assignedAdminName: adminSelect.value ? selectedAdminOpt.text : 'Pending Verification'
    };

    adminStore.addHospital(hospitalData);
    close();
  });

  return overlay;
}
