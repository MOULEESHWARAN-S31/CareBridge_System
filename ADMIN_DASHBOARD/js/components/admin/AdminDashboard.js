/**
 * CareBridge Admin Dashboard — Main Dashboard Orchestrator
 * Assembles Top Header, Sidebar, Summary Metrics, Active Section Viewport,
 * Modals, Slide-out Drawers, and Toast Notifications.
 */

import { adminStore } from '../../store/adminStore.js';
import { createAdminHeader } from './AdminHeader.js';
import { createAdminSidebar } from './AdminSidebar.js';
import { createSummaryCards } from './SummaryCards.js';
import { createUserManagementView } from './UserManagement.js';
import { createHospitalManagementView } from './HospitalManagement.js';
import { createMedicalStoreManagementView } from './MedicalStoreManagement.js';
import { createRolesPermissionsView } from './RolesPermissions.js';
import { createAuditLogsView } from './AuditLogsView.js';

import { createCreateUserModal } from './CreateUserModal.js';
import { createPasswordResetModal } from './PasswordResetModal.js';
import { createAddHospitalModal } from './AddHospitalModal.js';
import { createAddStoreModal } from './AddStoreModal.js';

import { createUserDetailDrawer } from './UserDetailDrawer.js';
import { createHospitalProfileDrawer } from './HospitalProfileDrawer.js';
import { createStoreProfileDrawer } from './StoreProfileDrawer.js';

export function createAdminDashboard(onSwitchToLogin) {
  const shell = document.createElement('div');
  shell.className = 'admin-shell';

  // 1. Top Header
  const header = createAdminHeader(onSwitchToLogin);
  shell.appendChild(header);

  // 2. Body Layout
  const bodyLayout = document.createElement('div');
  bodyLayout.className = 'admin-body-layout';

  // Sidebar
  const sidebar = createAdminSidebar();
  bodyLayout.appendChild(sidebar);

  // Main Viewport
  const viewport = document.createElement('main');
  viewport.className = 'admin-viewport';
  bodyLayout.appendChild(viewport);

  shell.appendChild(bodyLayout);

  // Modal & Drawer Mounts
  const modalContainer = document.createElement('div');
  modalContainer.id = 'admin-modal-root';
  shell.appendChild(modalContainer);

  const drawerContainer = document.createElement('div');
  drawerContainer.id = 'admin-drawer-root';
  shell.appendChild(drawerContainer);

  const toastContainer = document.createElement('div');
  toastContainer.id = 'admin-toast-root';
  shell.appendChild(toastContainer);

  // Dynamic Viewport Render
  function renderViewport() {
    viewport.innerHTML = '';

    // Top Summary Cards
    const summaryCards = createSummaryCards();
    viewport.appendChild(summaryCards);

    // Main section
    let viewEl;
    if (adminStore.activeSection === 'users') {
      viewEl = createUserManagementView();
    } else if (adminStore.activeSection === 'hospitals') {
      viewEl = createHospitalManagementView();
    } else if (adminStore.activeSection === 'stores') {
      viewEl = createMedicalStoreManagementView();
    } else if (adminStore.activeSection === 'roles') {
      viewEl = createRolesPermissionsView();
    } else if (adminStore.activeSection === 'audit') {
      viewEl = createAuditLogsView();
    } else {
      viewEl = createUserManagementView();
    }

    viewport.appendChild(viewEl);
  }

  // Modals & Drawers Render
  function renderOverlays() {
    modalContainer.innerHTML = '';
    if (adminStore.activeModal === 'create-user') {
      modalContainer.appendChild(createCreateUserModal());
    } else if (adminStore.activeModal === 'password-reset' && adminStore.modalPayload) {
      modalContainer.appendChild(createPasswordResetModal(adminStore.modalPayload));
    } else if (adminStore.activeModal === 'add-hospital') {
      modalContainer.appendChild(createAddHospitalModal());
    } else if (adminStore.activeModal === 'add-store') {
      modalContainer.appendChild(createAddStoreModal());
    }

    drawerContainer.innerHTML = '';
    if (adminStore.activeDrawer === 'user-profile' && adminStore.drawerPayload) {
      drawerContainer.appendChild(createUserDetailDrawer(adminStore.drawerPayload));
    } else if (adminStore.activeDrawer === 'hospital-profile' && adminStore.drawerPayload) {
      drawerContainer.appendChild(createHospitalProfileDrawer(adminStore.drawerPayload));
    } else if (adminStore.activeDrawer === 'store-profile' && adminStore.drawerPayload) {
      drawerContainer.appendChild(createStoreProfileDrawer(adminStore.drawerPayload));
    }

    toastContainer.innerHTML = '';
    if (adminStore.toast) {
      const toastEl = document.createElement('div');
      toastEl.className = 'admin-toast-banner';
      toastEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-teal-400);"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${adminStore.toast.message}</span>
      `;
      toastContainer.appendChild(toastEl);
    }
  }

  let lastActiveSection = null;
  let lastSubFilter = null;

  function onStoreUpdate() {
    if (lastActiveSection !== adminStore.activeSection || lastSubFilter !== adminStore.activeSubFilter) {
      lastActiveSection = adminStore.activeSection;
      lastSubFilter = adminStore.activeSubFilter;
      renderViewport();
    }
    renderOverlays();
  }

  renderViewport();
  renderOverlays();
  adminStore.subscribe(onStoreUpdate);

  return shell;
}
