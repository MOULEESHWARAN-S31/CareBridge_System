const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../GOVERNMENT_DASHBOARD/scripts/test_government_dashboard.js');
let content = fs.readFileSync(filePath, 'utf8');

const suite5Code = `
async function runCompleteGovernmentSuite() {
  console.log('\\n============================================================');
  console.log('🏛️  Suite 5: Government Workspaces & Persistent CRUD Verification');
  console.log('============================================================\\n');

  const appCode = fs.readFileSync(path.join('src', 'App.tsx'), 'utf8');

  // Verify all new modules are routed
  const newRoutes = [
    { path: 'state/surveillance', comp: 'StateSurveillance', desc: 'S03: Disease Surveillance & Heatmaps' },
    { path: 'state/facilities', comp: 'StateFacilities', desc: 'S04: Facility Capacity Monitoring' },
    { path: 'state/medicines', comp: 'StateMedicine', desc: 'S05: Medicine & Diagnostics Intelligence' },
    { path: 'state/blood', comp: 'StateBlood', desc: 'S06: Blood Bank Directory' },
    { path: 'state/announcements', comp: 'StateAnnouncements', desc: 'S11: State Public Announcements' },
    { path: 'district/hospitals', comp: 'DistrictHospitalsPHCs', desc: 'D02: District Hospitals & PHCs' },
    { path: 'district/villages', comp: 'VillageMonitoring', desc: 'D03: Village/Block Health Monitoring' },
    { path: 'district/diagnostics', comp: 'DiagnosticAvailability', desc: 'D07: Diagnostic Availability' }
  ];

  newRoutes.forEach(r => {
    assert(
      appCode.includes(\`path="\${r.path}"\`) && appCode.includes(\`<\${r.comp} />\`),
      \`Route "/dashboard/\${r.path}" correctly maps to <\${r.comp} /> (\${r.desc})\`
    );
  });

  // Verify Backend API integration
  try {
    const meRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/government/me',
      method: 'GET',
      headers: { 'Authorization': \`Bearer \${governmentAuthToken}\` }
    });
    assert(meRes.status === 200, \`GET /api/government/me returned HTTP 200 (Got: \${meRes.status})\`);
    assert(meRes.body?.governmentRole === 'DISTRICT_ADMIN', \`Verified server-authenticated role: \${meRes.body?.governmentRole}\`);
    assert(meRes.body?.authorizedDistrict === 'Salem', \`Verified authorized district scope: \${meRes.body?.authorizedDistrict}\`);

    const campsRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/government/camps',
      method: 'GET',
      headers: { 'Authorization': \`Bearer \${governmentAuthToken}\` }
    });
    assert(campsRes.status === 200, \`GET /api/government/camps returned HTTP 200 (Got: \${campsRes.status})\`);
    assert(Array.isArray(campsRes.body) && campsRes.body.length > 0, \`Loaded \${campsRes.body?.length || 0} persistent camp proposals from PostgreSQL\`);

    const commRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/government/community-requests',
      method: 'GET',
      headers: { 'Authorization': \`Bearer \${governmentAuthToken}\` }
    });
    assert(commRes.status === 200, \`GET /api/government/community-requests returned HTTP 200 (Got: \${commRes.status})\`);
    assert(Array.isArray(commRes.body) && commRes.body.length > 0, \`Loaded \${commRes.body?.length || 0} persistent community requests from PostgreSQL\`);

    const auditsRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/government/audit-events',
      method: 'GET',
      headers: { 'Authorization': \`Bearer \${governmentAuthToken}\` }
    });
    assert(auditsRes.status === 200, \`GET /api/government/audit-events returned HTTP 200 (Got: \${auditsRes.status})\`);
    assert(Array.isArray(auditsRes.body) && auditsRes.body.length > 0, \`Loaded \${auditsRes.body?.length || 0} persistent audit events from PostgreSQL\`);

    // Verify Cross-district isolation rejection
    const crossDistrictRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/government/camps?district=Madurai',
      method: 'GET',
      headers: { 'Authorization': \`Bearer \${governmentAuthToken}\` }
    });
    assert(crossDistrictRes.status === 403, \`Cross-district access rejected with HTTP 403 (Got: \${crossDistrictRes.status})\`);
  } catch (err) {
    assert(false, \`Backend Suite 5 verification failed: \${err.message}\`);
  }
}
`;

content = content.replace('await runStateAndDistrictSuite();', 'await runStateAndDistrictSuite();\n  await runCompleteGovernmentSuite();');
content = content.replace('async function main() {', suite5Code + '\nasync function main() {');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated test runner with Suite 5');

