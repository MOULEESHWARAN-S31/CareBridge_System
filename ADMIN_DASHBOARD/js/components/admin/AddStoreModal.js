/**
 * CareBridge Admin Dashboard — AddStoreModal Component
 * Implements Requirements 19 & 20:
 * Multi-section form:
 * - Basic Information (Name, Store ID, Type, License #)
 * - Location (State, District, Taluk, City, Address, PIN, Coords)
 * - Contact (Phone, Email, Contact Person)
 * - Services (Prescription, Generic, Emergency, Availability, Online Requests)
 * - Store Administrator / Pharmacist Assignment
 */

import { adminStore } from '../../store/adminStore.js';

export function createAddStoreModal() {
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.id = 'modal-add-store';

  const defaultStoreId = `MS-SLM-00${adminStore.medicalStores.length + 1}`;
  const pharmacists = adminStore.users.filter(u => u.role === 'Pharmacist' || u.role === 'Medical Store Staff');

  overlay.innerHTML = `
    <div class="admin-modal-card wide">
      <div class="admin-modal-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-teal-600);"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
          <h3 class="admin-modal-title">Register Medical Store / Pharmacy</h3>
        </div>
        <button type="button" class="admin-modal-close-btn" id="btn-close-add-store" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <form id="form-add-store">
        <div class="admin-modal-body">
          <!-- 1. Basic Information -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>1. Store & License Information</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="inp-store-name">Medical Store / Pharmacy Name *</label>
              <input type="text" class="field-input" id="inp-store-name" required placeholder="e.g. Attur Jan Aushadhi Kendra" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-store-id">Store ID *</label>
              <input type="text" class="field-input" id="inp-store-id" required value="${defaultStoreId}" placeholder="e.g. MS-SLM-006" />
            </div>

            <div class="form-field">
              <label class="field-label" for="sel-store-type">Store Type *</label>
              <select class="field-select" id="sel-store-type">
                <option value="Government Medical Store">Government Medical Store</option>
                <option value="Hospital Pharmacy" selected>Hospital Pharmacy</option>
                <option value="Primary Health Centre Pharmacy">Primary Health Centre Pharmacy</option>
                <option value="Public Pharmacy">Public Pharmacy</option>
                <option value="Partner Pharmacy">Partner Pharmacy</option>
              </select>
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-store-license">Registration / Drug License No *</label>
              <input type="text" class="field-input" id="inp-store-license" required placeholder="e.g. TN-PHARM-SLM-0512" />
            </div>
          </div>

          <!-- 2. Location -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>2. Location & Geographic Positioning</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="sel-store-district">District *</label>
              <select class="field-select" id="sel-store-district">
                ${adminStore.districts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-store-taluk">Taluk *</label>
              <input type="text" class="field-input" id="inp-store-taluk" required value="Salem" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-store-city">City / Village *</label>
              <input type="text" class="field-input" id="inp-store-city" required placeholder="e.g. Salem City" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-store-pin">PIN Code *</label>
              <input type="text" class="field-input" id="inp-store-pin" required placeholder="636001" />
            </div>

            <div class="form-field full-width">
              <label class="field-label" for="inp-store-address">Postal Address *</label>
              <textarea class="field-textarea" id="inp-store-address" required placeholder="Premises, street, ward..."></textarea>
            </div>
          </div>

          <!-- 3. Contact & Person -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>3. Contact & Lead Pharmacist</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="inp-store-phone">Phone Number *</label>
              <input type="tel" class="field-input" id="inp-store-phone" required placeholder="+91 427 2415888" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-store-email">Email Address *</label>
              <input type="email" class="field-input" id="inp-store-email" required placeholder="pharmacy@store.gov" />
            </div>

            <div class="form-field full-width">
              <label class="field-label" for="inp-store-contact-person">Store In-Charge / Contact Person *</label>
              <input type="text" class="field-input" id="inp-store-contact-person" required placeholder="e.g. M. Senthil Nathan, Registered Pharmacist" />
            </div>
          </div>

          <!-- 4. Services (Requirement 19 Checkboxes) -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>4. Pharmacy Services & Dispensary Capabilities</span>
          </div>

          <div class="checkbox-grid" id="store-services-grid">
            <label class="checkbox-item"><input type="checkbox" value="Prescription Medicines" checked /> <span>Prescription Medicines</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Generic Medicines" checked /> <span>Generic Medicines</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Emergency Medicines" checked /> <span>Emergency Medicines</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Medicine Availability Updates" checked /> <span>Medicine Availability Updates</span></label>
            <label class="checkbox-item"><input type="checkbox" value="Online Medicine Requests" /> <span>Online Medicine Requests</span></label>
          </div>

          <!-- 5. Store Administrator / Manager Assignment (Requirement 20) -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span>5. Assign Store Manager / Lead Pharmacist (Requirement 20)</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field full-width">
              <label class="field-label" for="sel-store-mgr-assign">Select CareBridge User Account</label>
              <select class="field-select" id="sel-store-mgr-assign">
                <option value="">-- Assign Later / Pending Verification --</option>
                ${pharmacists.map(p => `<option value="${p.userId}">${p.fullName} (${p.role}) - ${p.userId}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button type="button" class="btn-secondary" id="btn-cancel-add-store">Cancel</button>
          <button type="submit" class="btn-primary-action" id="btn-submit-add-store">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Register Medical Store</span>
          </button>
        </div>
      </form>
    </div>
  `;

  const close = () => adminStore.closeModal();
  overlay.querySelector('#btn-close-add-store').addEventListener('click', close);
  overlay.querySelector('#btn-cancel-add-store').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const form = overlay.querySelector('#form-add-store');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedServices = [];
    overlay.querySelectorAll('#store-services-grid input:checked').forEach(cb => {
      selectedServices.push(cb.value);
    });

    const mgrSelect = overlay.querySelector('#sel-store-mgr-assign');
    const selectedMgrOpt = mgrSelect.options[mgrSelect.selectedIndex];

    const storeData = {
      name: overlay.querySelector('#inp-store-name').value,
      storeId: overlay.querySelector('#inp-store-id').value,
      type: overlay.querySelector('#sel-store-type').value,
      licenseNumber: overlay.querySelector('#inp-store-license').value,
      state: 'Tamil Nadu',
      district: overlay.querySelector('#sel-store-district').value,
      taluk: overlay.querySelector('#inp-store-taluk').value,
      cityVillage: overlay.querySelector('#inp-store-city').value,
      pinCode: overlay.querySelector('#inp-store-pin').value,
      address: overlay.querySelector('#inp-store-address').value,
      phone: overlay.querySelector('#inp-store-phone').value,
      email: overlay.querySelector('#inp-store-email').value,
      contactPerson: overlay.querySelector('#inp-store-contact-person').value,
      services: selectedServices,
      status: 'Pending Verification',
      assignedManagerId: mgrSelect.value || null,
      assignedManagerName: mgrSelect.value ? selectedMgrOpt.text : overlay.querySelector('#inp-store-contact-person').value
    };

    adminStore.addMedicalStore(storeData);
    close();
  });

  return overlay;
}
