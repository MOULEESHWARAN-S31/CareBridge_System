/**
 * CareBridge Admin Dashboard — Bulk Import Medical Stores Module
 * Located under Medical Store Management.
 * Implements exact fields, validation rules, and schema from AddStoreModal.
 */

import { adminStore } from '../../store/adminStore.js';

export const STORE_IMPORT_SCHEMA = {
  name: 'Medical Stores',
  fileName: 'CareBridge_Medical_Stores_Import_Template.xlsx',
  idField: 'Store ID',
  headers: [
    'Medical Store / Pharmacy Name',
    'Store ID',
    'Store Type',
    'Registration / Drug License No',
    'District',
    'Taluk',
    'City / Village',
    'PIN Code',
    'Postal Address',
    'Phone Number',
    'Email Address',
    'Store In-Charge / Contact Person',
    'Pharmacy Services Provided'
  ],
  requiredFields: [
    'Medical Store / Pharmacy Name',
    'Store ID',
    'Store Type',
    'Registration / Drug License No',
    'District',
    'Taluk',
    'City / Village',
    'PIN Code',
    'Postal Address',
    'Phone Number',
    'Email Address',
    'Store In-Charge / Contact Person'
  ],
  fieldRules: {
    'Store Type': {
      type: 'enum',
      allowed: [
        'Government Medical Store',
        'Hospital Pharmacy',
        'Primary Health Centre Pharmacy',
        'Public Pharmacy',
        'Partner Pharmacy'
      ],
      hint: 'Government Medical Store / Hospital Pharmacy / PHC Pharmacy / Public Pharmacy'
    },
    'District': {
      type: 'enum',
      allowed: ['Salem', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
      hint: 'Salem / Chennai / Coimbatore / Madurai / Tiruchirappalli'
    },
    'PIN Code': {
      type: 'pin',
      hint: '6-digit postal code (e.g. 636001)'
    },
    'Phone Number': {
      type: 'phone',
      hint: 'Pharmacy phone (e.g. +91 427 2415888)'
    },
    'Email Address': {
      type: 'email',
      hint: 'Official email address'
    }
  },
  sampleData: [
    {
      'Medical Store / Pharmacy Name': 'Omalur Jan Aushadhi Generic Pharmacy',
      'Store ID': 'MS-SLM-007',
      'Store Type': 'Government Medical Store',
      'Registration / Drug License No': 'TN-PHARM-SLM-0618',
      'District': 'Salem',
      'Taluk': 'Omalur',
      'City / Village': 'Omalur Main Road',
      'PIN Code': '636455',
      'Postal Address': 'Shop 4, Taluk Hospital Complex, Omalur, Salem - 636455',
      'Phone Number': '+91 4290 221888',
      'Email Address': 'janaushadhi.omalur@tn.pharma.gov',
      'Store In-Charge / Contact Person': 'K. Ramanathan, Registered Pharmacist',
      'Pharmacy Services Provided': 'Prescription Medicines, Generic Medicines, Emergency Medicines, Medicine Availability Updates'
    },
    {
      'Medical Store / Pharmacy Name': 'Attur Government Hospital Dispensary',
      'Store ID': 'MS-SLM-008',
      'Store Type': 'Hospital Pharmacy',
      'Registration / Drug License No': 'TN-PHARM-SLM-0722',
      'District': 'Salem',
      'Taluk': 'Attur',
      'City / Village': 'Attur Town',
      'PIN Code': '636102',
      'Postal Address': 'Ground Floor, GH Premises, Attur, Salem - 636102',
      'Phone Number': '+91 4282 240888',
      'Email Address': 'dispensary.attur@tn.pharma.gov',
      'Store In-Charge / Contact Person': 'S. Meenakshi Sundaram, Pharmacist',
      'Pharmacy Services Provided': 'Prescription Medicines, Generic Medicines, Emergency Medicines'
    }
  ]
};

export function createBulkImportStoresView() {
  const container = document.createElement('section');
  container.className = 'module-view-container bulk-import-view';
  container.setAttribute('aria-label', 'Bulk Import Medical Stores Section');

  let uploadedFile = null;
  let validationSummary = null;
  let activePreviewFilter = 'all';
  let isImporting = false;
  let importCompleted = false;
  let importResults = null;

  function downloadExcelTemplate() {
    if (typeof window.XLSX === 'undefined') {
      alert('Excel engine is still initializing. Please wait a moment.');
      return;
    }

    try {
      const wb = window.XLSX.utils.book_new();
      const schema = STORE_IMPORT_SCHEMA;

      // Sheet 1: Import Template
      const templateData = [schema.headers];
      schema.sampleData.forEach(sample => {
        const row = schema.headers.map(h => sample[h] !== undefined ? sample[h] : '');
        templateData.push(row);
      });

      const wsTemplate = window.XLSX.utils.aoa_to_sheet(templateData);
      wsTemplate['!cols'] = schema.headers.map(header => ({
        wch: Math.max(header.length + 6, 20)
      }));
      wsTemplate['!views'] = [{ state: 'frozen', ySplit: 1 }];
      window.XLSX.utils.book_append_sheet(wb, wsTemplate, 'Import Template');

      // Sheet 2: Instructions
      const instructionsData = [
        ['CareBridge Healthcare System — Medical Store Master Bulk Import Guidelines'],
        [''],
        ['General Instructions:'],
        ['1. Do not rename or delete any column headers in Sheet 1 ("Import Template").'],
        ['2. Required columns marked with an asterisk (*) must contain non-empty valid data.'],
        ['3. Columns match the exact fields required by the "+ Add Medical Store" registration form.'],
        ['4. Store ID must be unique across all healthcare facilities.'],
        ['5. Pharmacy Services Provided should be comma-separated.'],
        ['6. Save this workbook in .xlsx format before uploading.'],
        [''],
        ['Column Specifications & Allowed Values:'],
        ['Column Name', 'Required?', 'Format / Data Type', 'Validation Rules & Allowed Options', 'Example Value']
      ];

      schema.headers.forEach(header => {
        const isReq = schema.requiredFields.includes(header);
        const rule = schema.fieldRules?.[header];
        let typeStr = 'Text';
        let ruleStr = 'Standard text';
        let exStr = schema.sampleData[0]?.[header] || '';

        if (rule) {
          if (rule.type === 'enum') {
            typeStr = 'Dropdown Choice';
            ruleStr = `Allowed values: ${rule.allowed.join(', ')}`;
          } else if (rule.type === 'phone') {
            typeStr = 'Phone Number';
            ruleStr = 'Valid telephone or mobile number';
          } else if (rule.type === 'email') {
            typeStr = 'Email';
            ruleStr = 'Valid email address';
          } else if (rule.type === 'pin') {
            typeStr = '6-Digit Postal PIN';
            ruleStr = 'Exact 6 digits';
          }
        }

        instructionsData.push([
          header + (isReq ? ' *' : ''),
          isReq ? 'YES (Required)' : 'Optional',
          typeStr,
          ruleStr,
          exStr
        ]);
      });

      const wsInstructions = window.XLSX.utils.aoa_to_sheet(instructionsData);
      wsInstructions['!cols'] = [
        { wch: 32 },
        { wch: 18 },
        { wch: 22 },
        { wch: 48 },
        { wch: 35 }
      ];
      window.XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

      window.XLSX.writeFile(wb, schema.fileName);
      adminStore.showToast(`Downloaded medical store template: ${schema.fileName}`);
    } catch (err) {
      console.error('Store template download error:', err);
      alert('Failed to generate template: ' + err.message);
    }
  }

  function sanitizeValue(val) {
    if (val === undefined || val === null) return '';
    let str = String(val).trim();
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = str.replace(/^[=+\-@]+/, '');
    }
    return str;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '');
    return clean.length >= 7 && clean.length <= 15;
  }

  function processExcelData(rawJson, headersFound) {
    const schema = STORE_IMPORT_SCHEMA;
    const errors = [];
    const processedRows = [];

    const missingColumns = schema.requiredFields.filter(req => !headersFound.includes(req));
    if (missingColumns.length > 0) {
      errors.push({
        type: 'HEADER_MISSING',
        message: `Missing required column(s): ${missingColumns.join(', ')}`
      });
    }

    const seenIds = new Set();
    const existingIds = new Set(adminStore.medicalStores.map(s => s.storeId.toUpperCase()));

    rawJson.forEach((rowObj, index) => {
      const rowNumber = index + 2;
      const rowErrors = [];
      const sanitizedRow = {};

      schema.headers.forEach(h => {
        sanitizedRow[h] = sanitizeValue(rowObj[h]);
      });

      schema.requiredFields.forEach(reqField => {
        if (!sanitizedRow[reqField]) {
          rowErrors.push(`${reqField} is required`);
        }
      });

      const storeId = sanitizedRow['Store ID'];
      if (storeId) {
        const idUpper = storeId.toUpperCase();
        if (seenIds.has(idUpper)) {
          rowErrors.push(`Duplicate Store ID (${storeId}) in file`);
        } else if (existingIds.has(idUpper)) {
          rowErrors.push(`Store ID (${storeId}) already registered in system`);
        } else {
          seenIds.add(idUpper);
        }
      }

      if (sanitizedRow['Email Address'] && !validateEmail(sanitizedRow['Email Address'])) {
        rowErrors.push('Email Address format is invalid');
      }

      if (sanitizedRow['Phone Number'] && !validatePhone(sanitizedRow['Phone Number'])) {
        rowErrors.push('Phone Number format is invalid');
      }

      if (sanitizedRow['PIN Code'] && !/^\d{6}$/.test(sanitizedRow['PIN Code'])) {
        rowErrors.push('PIN Code must be exactly 6 digits');
      }

      processedRows.push({
        rowNumber,
        data: sanitizedRow,
        isValid: rowErrors.length === 0,
        errors: rowErrors
      });
    });

    const validCount = processedRows.filter(r => r.isValid).length;
    const errorCount = processedRows.filter(r => !r.isValid).length;

    return {
      total: processedRows.length,
      valid: validCount,
      errorCount,
      errors,
      rows: processedRows
    };
  }

  function handleFileSelection(file) {
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'xls') {
      alert('Invalid file format. Please upload an Excel (.xlsx or .xls) file.');
      return;
    }

    uploadedFile = file;
    validationSummary = null;
    importCompleted = false;
    importResults = null;
    activePreviewFilter = 'all';

    render();

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = window.XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = window.XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

        const range = window.XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z1');
        const headersFound = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = worksheet[window.XLSX.utils.encode_cell({ r: 0, c: C })];
          if (cell && cell.v) headersFound.push(String(cell.v).trim());
        }

        validationSummary = processExcelData(rawJson, headersFound);
        render();
      } catch (err) {
        console.error('Store file parsing error:', err);
        alert('Failed to read Excel file: ' + err.message);
        uploadedFile = null;
        render();
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function executeImport() {
    if (!validationSummary || validationSummary.valid === 0 || isImporting) return;

    isImporting = true;
    render();

    setTimeout(() => {
      try {
        const validRows = validationSummary.rows.filter(r => r.isValid);
        let count = 0;

        validRows.forEach(r => {
          const rec = r.data;
          const servicesList = rec['Pharmacy Services Provided']
            ? rec['Pharmacy Services Provided'].split(',').map(s => s.trim()).filter(Boolean)
            : ['Prescription Medicines', 'Generic Medicines'];

          const storeData = {
            name: rec['Medical Store / Pharmacy Name'],
            storeId: rec['Store ID'],
            type: rec['Store Type'] || 'Hospital Pharmacy',
            licenseNumber: rec['Registration / Drug License No'],
            state: 'Tamil Nadu',
            district: rec['District'] || 'Salem',
            taluk: rec['Taluk'] || 'Salem',
            cityVillage: rec['City / Village'],
            pinCode: rec['PIN Code'],
            address: rec['Postal Address'],
            phone: rec['Phone Number'],
            email: rec['Email Address'],
            contactPerson: rec['Store In-Charge / Contact Person'],
            services: servicesList,
            status: 'Pending Verification',
            assignedManagerId: null,
            assignedManagerName: rec['Store In-Charge / Contact Person'] || 'Unassigned'
          };

          adminStore.addMedicalStore(storeData);
          count++;
        });

        adminStore.logAudit(
          'BULK_IMPORT_STORES',
          'Medical Store Management',
          `${count} stores`,
          `Bulk imported ${count} medical stores via Excel template`
        );

        importCompleted = true;
        isImporting = false;
        importResults = {
          processed: validationSummary.total,
          imported: count,
          skipped: validationSummary.errorCount,
          errorList: validationSummary.rows.filter(r => !r.isValid)
        };
        render();
      } catch (err) {
        console.error('Import execution error:', err);
        alert('Import failed: ' + err.message);
        isImporting = false;
        render();
      }
    }, 1000);
  }

  function resetImportState() {
    uploadedFile = null;
    validationSummary = null;
    importCompleted = false;
    importResults = null;
    activePreviewFilter = 'all';
    render();
  }

  function render() {
    const schema = STORE_IMPORT_SCHEMA;

    container.innerHTML = `
      <!-- Header -->
      <div class="module-header-container">
        <div class="module-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <button type="button" class="btn-back-link" id="btn-back-to-stores" title="Return to Medical Store Management">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              <span>Back to Stores</span>
            </button>
            <span style="color: var(--cb-border-medium); font-size: 1.2rem;">/</span>
            <h2 class="module-main-title">Bulk Import Medical Stores</h2>
          </div>
          <span class="module-subtitle">Import multiple medical store records using an Excel template. Fields conform exactly to the "+ Add Medical Store" registration schema.</span>
        </div>
      </div>

      <!-- Two-Column Layout -->
      <div class="bulk-import-grid">
        <!-- Left: Download Template & Instructions -->
        <div class="bulk-card">
          <div class="bulk-card-header">
            <div class="bulk-card-icon-step">1</div>
            <div>
              <h3 class="bulk-card-title">Download Medical Store Excel Template</h3>
              <p class="bulk-card-desc">Download the official template matching all fields from the "+ Add Medical Store" form.</p>
            </div>
          </div>

          <div style="margin-top: 0.5rem;">
            <button type="button" class="btn-primary-action btn-download-template" id="btn-download-store-template">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Download Medical Store Excel Template (.xlsx)</span>
            </button>
          </div>

          <!-- Instructions Box -->
          <div class="bulk-instructions-box" style="margin-top: 1.5rem;">
            <div class="bulk-instruction-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-teal-600);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <strong>Use the provided Excel template to ensure your data is formatted correctly.</strong>
            </div>

            <ul class="bulk-checklist">
              <li><span class="chk-icon">✓</span> Do not change the column names.</li>
              <li><span class="chk-icon">✓</span> Required fields must not be empty.</li>
              <li><span class="chk-icon">✓</span> Store ID must be unique (e.g. MS-SLM-007).</li>
              <li><span class="chk-icon">✓</span> Drug License number must be provided.</li>
              <li><span class="chk-icon">✓</span> Save the file as .xlsx before uploading.</li>
            </ul>

            <div class="bulk-fields-legend">
              <span class="legend-title">Columns matching "+ Add Medical Store" form:</span>
              <div class="field-badges-wrap">
                ${schema.headers.map(h => {
                  const isReq = schema.requiredFields.includes(h);
                  return `
                    <span class="field-badge ${isReq ? 'required-badge' : 'optional-badge'}" title="${isReq ? 'Required Field' : 'Optional Field'}">
                      ${h}${isReq ? ' *' : ''}
                    </span>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Upload Excel File -->
        <div class="bulk-card">
          <div class="bulk-card-header">
            <div class="bulk-card-icon-step">2</div>
            <div>
              <h3 class="bulk-card-title">Upload Excel File</h3>
              <p class="bulk-card-desc">Drag and drop your populated medical store spreadsheet or browse from your computer.</p>
            </div>
          </div>

          ${!uploadedFile ? `
            <div class="bulk-dropzone" id="bulk-dropzone" tabindex="0" role="button" aria-label="Upload Medical Store Excel File drag and drop area">
              <input type="file" id="bulk-file-input" accept=".xlsx, .xls" style="display: none;" />
              <div class="dropzone-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="12" y2="12"/>
                  <line x1="15" y1="15" x2="12" y2="12"/>
                </svg>
              </div>
              <h4 class="dropzone-title">Upload Excel File</h4>
              <p class="dropzone-desc">Drag and drop your .xlsx file here or browse from your computer.</p>
              <button type="button" class="btn-secondary-action" id="btn-browse-file" style="margin-top: 0.75rem;">
                Choose Excel File
              </button>
              <span class="dropzone-hint">Accepts .xlsx and .xls (Max: 10 MB)</span>
            </div>
          ` : `
            <div class="uploaded-file-card">
              <div class="file-info-group">
                <div class="file-icon-square">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div class="file-text-meta">
                  <span class="uploaded-filename">📄 ${uploadedFile.name}</span>
                  <span class="uploaded-filesize">${(uploadedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button type="button" class="btn-remove-file" id="btn-remove-file" title="Remove selected file">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>Remove</span>
              </button>
            </div>

            ${validationSummary ? `
              ${validationSummary.errorCount > 0 || validationSummary.errors.length > 0 ? `
                <div class="bulk-validation-alert error" role="alert">
                  <div class="val-alert-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    <strong>❌ Import validation issues detected</strong>
                  </div>
                  <p class="val-alert-body">
                    ${validationSummary.errors.map(e => `<div>• ${e.message}</div>`).join('')}
                    ${validationSummary.errorCount > 0 ? `<div>${validationSummary.errorCount} store row(s) contain invalid or missing required fields. These rows will be skipped if you proceed.</div>` : ''}
                  </p>
                  
                  ${validationSummary.errorCount > 0 ? `
                    <div class="val-alert-rows-preview">
                      <strong>Sample Error Details:</strong>
                      <ul>
                        ${validationSummary.rows.filter(r => !r.isValid).slice(0, 4).map(r => `
                          <li>Row ${r.rowNumber}: ${r.errors.join(', ')}</li>
                        `).join('')}
                        ${validationSummary.errorCount > 4 ? `<li>...and ${validationSummary.errorCount - 4} more error row(s).</li>` : ''}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              ` : `
                <div class="bulk-validation-alert success" role="alert">
                  <div class="val-alert-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <strong>✓ Validation passed successfully!</strong>
                  </div>
                  <p class="val-alert-body">All ${validationSummary.total} medical store records conform to "+ Add Medical Store" requirements and are ready for import.</p>
                </div>
              `}
            ` : `
              <div class="loading-state-box">
                <div class="cb-spinner"></div>
                <span>Parsing and validating medical store records...</span>
              </div>
            `}
          `}
        </div>
      </div>

      <!-- Preview Section -->
      ${validationSummary && !importCompleted ? `
        <div class="bulk-preview-section">
          <div class="preview-header-bar">
            <div>
              <h3 class="preview-title">Import Preview</h3>
              <span class="preview-subtitle">Verify pharmacy/store records before committing to the CareBridge master database.</span>
            </div>

            <div class="preview-metric-group">
              <div class="metric-pill pill-total">
                <span class="metric-label">Total Records:</span>
                <span class="metric-value">${validationSummary.total}</span>
              </div>
              <div class="metric-pill pill-valid">
                <span class="metric-label">Valid Records:</span>
                <span class="metric-value">${validationSummary.valid}</span>
              </div>
              <div class="metric-pill pill-errors ${validationSummary.errorCount > 0 ? 'alert' : ''}">
                <span class="metric-label">Records with Errors:</span>
                <span class="metric-value">${validationSummary.errorCount}</span>
              </div>
            </div>
          </div>

          <div class="preview-actions-bar">
            <div class="preview-tab-filters">
              <button type="button" class="preview-tab ${activePreviewFilter === 'all' ? 'active' : ''}" data-filter="all">
                All Records (${validationSummary.total})
              </button>
              <button type="button" class="preview-tab ${activePreviewFilter === 'valid' ? 'active' : ''}" data-filter="valid">
                Valid Only (${validationSummary.valid})
              </button>
              <button type="button" class="preview-tab ${activePreviewFilter === 'errors' ? 'active' : ''}" data-filter="errors">
                Errors Only (${validationSummary.errorCount})
              </button>
            </div>

            <div class="preview-action-btn-group">
              <button 
                type="button" 
                class="btn-primary-action btn-execute-import" 
                id="btn-import-stores"
                ${validationSummary.valid === 0 || isImporting ? 'disabled' : ''}
              >
                ${isImporting ? `
                  <span class="btn-spinner"></span>
                  <span>Importing...</span>
                ` : `
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Import Medical Stores (${validationSummary.valid})</span>
                `}
              </button>
            </div>
          </div>

          <div class="data-table-wrapper preview-table-container">
            <table class="cb-table preview-table" id="stores-preview-table">
              <thead>
                <tr>
                  <th style="width: 60px;">Row</th>
                  <th style="width: 130px;">Status</th>
                  ${schema.headers.map(h => `<th>${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${getFilteredPreviewRows().map(row => `
                  <tr class="${row.isValid ? 'row-valid' : 'row-error'}">
                    <td class="font-mono text-center"><strong>${row.rowNumber}</strong></td>
                    <td>
                      ${row.isValid ? `
                        <span class="status-badge active" style="gap: 4px;">
                          ✓ Valid
                        </span>
                      ` : `
                        <span class="status-badge inactive" style="gap: 4px; background: #fee2e2; color: #b91c1c;" title="${row.errors.join(', ')}">
                          ❌ ${row.errors[0] || 'Error'}
                        </span>
                      `}
                    </td>
                    ${schema.headers.map(h => {
                      const val = row.data[h] || '';
                      return `<td>${val || '<span style="color: #94a3b8; font-style: italic;">(empty)</span>'}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- Result Area -->
      ${importCompleted && importResults ? `
        <div class="bulk-result-card">
          <div class="result-icon-celebrate">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <h3 class="result-title">✓ Import completed successfully.</h3>
          <p class="result-subtitle">Medical store records have been verified and added to Medical Store Management for accreditation.</p>

          <div class="result-stats-row">
            <div class="result-stat-box">
              <span class="res-stat-num">${importResults.processed}</span>
              <span class="res-stat-label">records processed</span>
            </div>
            <div class="result-stat-box success">
              <span class="res-stat-num">${importResults.imported}</span>
              <span class="res-stat-label">records imported</span>
            </div>
            <div class="result-stat-box ${importResults.skipped > 0 ? 'warning' : ''}">
              <span class="res-stat-num">${importResults.skipped}</span>
              <span class="res-stat-label">records skipped</span>
            </div>
          </div>

          <div class="result-action-buttons">
            ${importResults.skipped > 0 ? `
              <button type="button" class="btn-secondary-action" id="btn-view-store-error-report">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>View Error Report (${importResults.skipped})</span>
              </button>
            ` : ''}

            <button type="button" class="btn-secondary-action" id="btn-goto-stores-list">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>
              <span>View All Medical Stores</span>
            </button>

            <button type="button" class="btn-primary-action" id="btn-import-another-store">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              <span>Import Another File</span>
            </button>
          </div>
        </div>
      ` : ''}

      <div id="store-error-modal-container"></div>
    `;

    // Attach handlers
    const btnBack = container.querySelector('#btn-back-to-stores');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        adminStore.setNavigation('stores', 'all');
      });
    }

    const btnDownload = container.querySelector('#btn-download-store-template');
    if (btnDownload) {
      btnDownload.addEventListener('click', downloadExcelTemplate);
    }

    const dropzone = container.querySelector('#bulk-dropzone');
    const fileInput = container.querySelector('#bulk-file-input');
    const btnBrowse = container.querySelector('#btn-browse-file');

    if (btnBrowse && fileInput) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileSelection(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFileSelection(e.target.files[0]);
        }
      });
    }

    const btnRemove = container.querySelector('#btn-remove-file');
    if (btnRemove) {
      btnRemove.addEventListener('click', resetImportState);
    }

    container.querySelectorAll('.preview-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activePreviewFilter = tab.getAttribute('data-filter');
        render();
      });
    });

    const btnImport = container.querySelector('#btn-import-stores');
    if (btnImport) {
      btnImport.addEventListener('click', executeImport);
    }

    const btnImportAnother = container.querySelector('#btn-import-another-store');
    if (btnImportAnother) {
      btnImportAnother.addEventListener('click', resetImportState);
    }

    const btnGotoList = container.querySelector('#btn-goto-stores-list');
    if (btnGotoList) {
      btnGotoList.addEventListener('click', () => {
        adminStore.setNavigation('stores', 'all');
      });
    }

    const btnViewErrors = container.querySelector('#btn-view-store-error-report');
    if (btnViewErrors) {
      btnViewErrors.addEventListener('click', renderErrorReportModal);
    }
  }

  function getFilteredPreviewRows() {
    if (!validationSummary || !validationSummary.rows) return [];
    if (activePreviewFilter === 'valid') return validationSummary.rows.filter(r => r.isValid);
    if (activePreviewFilter === 'errors') return validationSummary.rows.filter(r => !r.isValid);
    return validationSummary.rows;
  }

  function renderErrorReportModal() {
    if (!importResults || !importResults.errorList) return;
    const modalRoot = container.querySelector('#store-error-modal-container');
    if (!modalRoot) return;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'admin-modal-backdrop';
    modalBackdrop.innerHTML = `
      <div class="admin-modal-shell" style="max-width: 650px;" role="dialog" aria-modal="true" aria-labelledby="modal-store-error-title">
        <div class="admin-modal-header">
          <div>
            <h3 class="admin-modal-title" id="modal-store-error-title">Medical Store Bulk Import Error Report</h3>
            <span class="admin-modal-desc">${importResults.skipped} medical store records failed validation constraints.</span>
          </div>
          <button type="button" class="admin-modal-close" id="btn-close-store-error" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="admin-modal-body" style="max-height: 400px; overflow-y: auto;">
          <div class="error-report-list">
            ${importResults.errorList.map(errRow => `
              <div class="error-report-item">
                <div class="err-item-badge">Row ${errRow.rowNumber}</div>
                <div class="err-item-content">
                  <div class="err-item-reasons">${errRow.errors.join(' • ')}</div>
                  <div class="err-item-summary">
                    <span>Store: <strong>${errRow.data['Medical Store / Pharmacy Name'] || 'Unnamed'}</strong> (${errRow.data['Store ID'] || 'No ID'})</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-primary-action" id="btn-dismiss-store-error">Done</button>
        </div>
      </div>
    `;

    modalRoot.innerHTML = '';
    modalRoot.appendChild(modalBackdrop);

    const handleClose = () => { modalRoot.innerHTML = ''; };
    modalBackdrop.querySelector('#btn-close-store-error')?.addEventListener('click', handleClose);
    modalBackdrop.querySelector('#btn-dismiss-store-error')?.addEventListener('click', handleClose);
  }

  render();
  return container;
}
