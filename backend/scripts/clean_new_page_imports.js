const fs = require('fs');
const path = require('path');

function removeUnusedImports(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [target, replacement] of replacements) {
    content = content.replace(target, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${path.basename(filePath)}`);
}

const baseDir = path.join(__dirname, '../../GOVERNMENT_DASHBOARD/src/pages');

// VillageMonitoring.tsx: 'Users'
removeUnusedImports(path.join(baseDir, 'district/VillageMonitoring.tsx'), [
  [', Users,', ',']
]);

// StateAnnouncements.tsx: 'Calendar', 'AlertTriangle'
removeUnusedImports(path.join(baseDir, 'state/StateAnnouncements.tsx'), [
  ['Calendar, ', ''],
  ['CheckCircle2, AlertTriangle,', 'CheckCircle2,']
]);

// StateBlood.tsx: 'MapPin'
removeUnusedImports(path.join(baseDir, 'state/StateBlood.tsx'), [
  ['MapPin, ', '']
]);

// StateFacilities.tsx: 'CheckCircle2', 'AlertTriangle'
removeUnusedImports(path.join(baseDir, 'state/StateFacilities.tsx'), [
  [', CheckCircle2', ''],
  ['AlertTriangle, ', '']
]);

// StateSurveillance.tsx: 'RefreshCw', 'Cell', 'ruleAlerts'
removeUnusedImports(path.join(baseDir, 'state/StateSurveillance.tsx'), [
  ['RefreshCw, ', ''],
  [', Cell', ''],
  ['districts, isOfflineMock, ruleAlerts', 'districts, isOfflineMock']
]);

console.log('All unused imports cleaned successfully');

