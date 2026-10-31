const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/layouts/DashboardLayout.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace stateAdminSection and districtAdminSection with full 12 State + 15 District modules
const oldStateSection = `  const stateAdminSection = {
    title: 'State Administration (Tamil Nadu)',
    items: [
      { path: '/dashboard/state/overview', icon: LayoutDashboard, label: 'State Command Center', exact: true },
      { path: '/dashboard/state/districts', icon: BarChart3, label: 'District Comparisons' },
      { path: '/dashboard/state/resources', icon: ArrowRightLeft, label: 'State Resource Allocation' },
      { path: '/dashboard/state/camps', icon: Tent, label: 'Health Camp Oversight' },
      { path: '/dashboard/state/requests', icon: AlertTriangle, label: 'District Escalations' },
      { path: '/dashboard/state/reports', icon: FileBarChart, label: 'Statewide Health Digest' },
    ]
  };

  const districtAdminSection = {
    title: \`District Administration (\${districtName || 'Salem'})\`,
    items: [
      { path: '/dashboard/district/overview', icon: LayoutDashboard, label: 'District Command', exact: true },
      { path: '/dashboard/district/camps', icon: Tent, label: 'Health Camp Roster' },
      { path: '/dashboard/district/community-requests', icon: Users, label: 'Citizen Camp Requests' },
      { path: '/dashboard/district/medicines', icon: Pill, label: 'Medicines & Diagnostics' },
      { path: '/dashboard/district/blood', icon: Siren, label: 'Blood Bank Network' },
      { path: '/dashboard/district/queue', icon: Activity, label: 'OPD Appointments & Queue' },
      { path: '/dashboard/district/referrals', icon: ArrowRightLeft, label: 'Patient Referrals' },
      { path: '/dashboard/district/follow-ups', icon: Heart, label: 'High-Risk Follow-Ups' },
      { path: '/dashboard/district/notifications', icon: Bell, label: 'Public Notices Broadcast' },
      { path: '/dashboard/district/reports', icon: FileText, label: 'District Reports & Audit' },
    ]
  };`;

const newStateSection = `  const stateAdminSection = {
    title: 'State Administration (Tamil Nadu)',
    items: [
      { path: '/dashboard/state/overview', icon: LayoutDashboard, label: 'S01: State Overview', exact: true },
      { path: '/dashboard/state/districts', icon: BarChart3, label: 'S02: District Comparison' },
      { path: '/dashboard/state/surveillance', icon: Activity, label: 'S03: Disease Surveillance' },
      { path: '/dashboard/state/facilities', icon: Building2, label: 'S04: Facility Monitoring' },
      { path: '/dashboard/state/medicines', icon: Pill, label: 'S05: Medicine & Diagnostics' },
      { path: '/dashboard/state/blood', icon: Siren, label: 'S06: Blood Service Monitoring' },
      { path: '/dashboard/state/camps', icon: Tent, label: 'S07: Health Camp Oversight' },
      { path: '/dashboard/state/resources', icon: ArrowRightLeft, label: 'S08: Resource Coordination' },
      { path: '/dashboard/state/requests', icon: AlertTriangle, label: 'S10: Escalations & Approvals' },
      { path: '/dashboard/state/announcements', icon: Bell, label: 'S11: State Announcements' },
      { path: '/dashboard/state/reports', icon: FileBarChart, label: 'S12: State Reports & Audit' },
    ]
  };

  const districtAdminSection = {
    title: \`District Administration (\${districtName || 'Salem'})\`,
    items: [
      { path: '/dashboard/district/overview', icon: LayoutDashboard, label: 'D01: District Overview', exact: true },
      { path: '/dashboard/district/hospitals', icon: Building2, label: 'D02: Hospitals & PHCs' },
      { path: '/dashboard/district/villages', icon: MapPin, label: 'D03: Village/Block Health' },
      { path: '/dashboard/district/camps', icon: Tent, label: 'D04: Health Camp Management' },
      { path: '/dashboard/district/community-requests', icon: Users, label: 'D05: Community Requests' },
      { path: '/dashboard/district/medicines', icon: Pill, label: 'D06: Medicine Inventory' },
      { path: '/dashboard/district/diagnostics', icon: Activity, label: 'D07: Diagnostic Availability' },
      { path: '/dashboard/district/blood', icon: Siren, label: 'D08: Blood Bank Network' },
      { path: '/dashboard/district/queue', icon: Activity, label: 'D09: Appointments & Queue' },
      { path: '/dashboard/district/referrals', icon: ArrowRightLeft, label: 'D10: Referral Monitoring' },
      { path: '/dashboard/district/follow-ups', icon: Heart, label: 'D11: Follow-Up Monitoring' },
      { path: '/dashboard/district/notifications', icon: Bell, label: 'D12: District Notifications' },
      { path: '/dashboard/district/reports', icon: FileText, label: 'D14/D15: Reports & Audit' },
    ]
  };`;

if (content.includes('State Command Center')) {
  content = content.replace(oldStateSection, newStateSection);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated DashboardLayout navigation sections');
} else {
  console.log('Navigation sections already updated or format mismatched');
}

