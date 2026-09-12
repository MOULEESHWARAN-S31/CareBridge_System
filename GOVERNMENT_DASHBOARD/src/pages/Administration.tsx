import React, { useState } from 'react';
import { 
  ShieldCheck, UserPlus, CheckCircle2, 
  Search, Shield, MapPin, X
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { type UserRole, type UserAccount } from '../data/mockData';

export default function Administration() {
  const { 
    registeredUsers, 
    createRegisteredUser, 
    auditLogs,
    districts
  } = useHealthData();

  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Form State for User Creation
  const [newUser, setNewUser] = useState({
    fullName: '',
    role: 'Doctor' as UserRole,
    district: 'Salem',
    employeeId: '',
    mobileNumber: '',
    email: '',
    assignedOrgName: '',
    password: 'Password@123'
  });

  const [createdSuccessUser, setCreatedSuccessUser] = useState<UserAccount | null>(null);

  const handleGenerateId = () => {
    const distCode = newUser.district ? newUser.district.substring(0, 3).toUpperCase() : 'TN';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNewUser(prev => ({
      ...prev,
      employeeId: `EMP-${distCode}-${randomNum}`
    }));
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.district || !newUser.employeeId) {
      alert('Please fill all required fields: Name, District, and Login ID.');
      return;
    }

    const created = createRegisteredUser({
      userId: newUser.employeeId,
      employeeId: newUser.employeeId,
      fullName: newUser.fullName,
      role: newUser.role,
      district: newUser.district,
      mobileNumber: newUser.mobileNumber || '+91 98400-00000',
      email: newUser.email || `${newUser.employeeId.toLowerCase()}@carebridge.tn.gov.in`,
      assignedOrgName: newUser.assignedOrgName || `${newUser.district} District Healthcare Center`,
      status: 'Active',
      password: newUser.password
    });

    setCreatedSuccessUser(created);
  };

  const filteredUsers = registeredUsers.filter(u => 
    u.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.employeeId.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.district.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
              Government Healthcare Administration
            </span>
            <span className="text-xs text-slate-500 font-mono">• Master Governance & Access Control</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">System Administration & Access Control</h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign district credentials, manage staff access, create system logins, and monitor security audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              handleGenerateId();
              setCreateUserModalOpen(true);
            }}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Create User / Generate Login ID
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-3 rounded-2xl gap-2 shadow-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Registered Users & District Assignments ({registeredUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          System Security Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Healthcare Users & District Jurisdiction</h3>
              <p className="text-xs text-slate-500">Authorized personnel accounts tied to district-isolated data boundaries</p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, role or district..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Officer Name</th>
                  <th className="p-3">Role Tier</th>
                  <th className="p-3">Assigned District</th>
                  <th className="p-3">Assigned Organization</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-800">{u.employeeId}</td>
                    <td className="p-3 font-bold text-slate-900">{u.fullName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-teal-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      {u.district}
                    </td>
                    <td className="p-3 text-slate-600">{u.assignedOrgName || `${u.district} Health Directorate`}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{u.mobileNumber}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Security & Action Audit Trail Log</h3>
              <p className="text-xs text-slate-500">Immutable logging of officer actions, logins, and user registrations</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
              DISHA Standard v2.4 Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Officer / User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action Executed</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.user}</td>
                    <td className="p-3 text-slate-600">{log.role}</td>
                    <td className="p-3 font-bold text-teal-800">{log.action}</td>
                    <td className="p-3 text-slate-500">{log.module}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-700 text-white rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create Healthcare User & Assign District</h3>
                  <p className="text-xs text-slate-500">Generate login credentials and bind account to a specific district</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setCreateUserModalOpen(false);
                  setCreatedSuccessUser(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {createdSuccessUser ? (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">User Successfully Provisioned!</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Credentials generated and bound to <strong>{createdSuccessUser.district} District</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Employee / Login ID:</span>
                      <strong className="text-teal-800">{createdSuccessUser.employeeId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Officer Name:</span>
                      <span className="text-slate-900 font-sans font-bold">{createdSuccessUser.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Role:</span>
                      <span className="text-slate-900 font-sans">{createdSuccessUser.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">District:</span>
                      <span className="text-teal-700 font-sans font-bold">{createdSuccessUser.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Default Password:</span>
                      <span className="text-slate-900">{createdSuccessUser.password}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={() => {
                        setCreatedSuccessUser(null);
                        setNewUser({
                          fullName: '',
                          role: 'Doctor',
                          district: 'Salem',
                          employeeId: '',
                          mobileNumber: '',
                          email: '',
                          assignedOrgName: '',
                          password: 'Password@123'
                        });
                        handleGenerateId();
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Create Another
                    </button>
                    <button
                      onClick={() => {
                        setCreateUserModalOpen(false);
                        setCreatedSuccessUser(null);
                      }}
                      className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Officer / Doctor Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. K. Meenakshi, MD"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Role Tier *</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none focus:border-teal-600 cursor-pointer"
                      >
                        <option value="Doctor">Doctor (Clinical & Telemedicine)</option>
                        <option value="Hospital Administrator">Hospital Administrator (Facility Scope)</option>
                        <option value="District Administrator">District Administrator (DHO Scope)</option>
                        <option value="State Administrator">State Administrator (Statewide Access)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned District Jurisdiction *</label>
                      <select
                        value={newUser.district}
                        onChange={(e) => {
                          const dist = e.target.value;
                          setNewUser(prev => ({ ...prev, district: dist }));
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none focus:border-teal-600 cursor-pointer font-bold text-teal-800"
                      >
                        {districts.map(d => (
                          <option key={d.id} value={d.name}>{d.name} District</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-slate-700">Official Login Employee ID *</label>
                        <button
                          type="button"
                          onClick={handleGenerateId}
                          className="text-[10px] text-teal-700 hover:underline font-bold"
                        >
                          Regenerate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={newUser.employeeId}
                        onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-teal-900 font-mono font-bold outline-none focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Mobile Number</label>
                      <input
                        type="text"
                        placeholder="e.g. +91 94432-11000"
                        value={newUser.mobileNumber}
                        onChange={(e) => setNewUser({ ...newUser, mobileNumber: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Hospital / Facility</label>
                      <input
                        type="text"
                        placeholder={`e.g. ${newUser.district} District Headquarters Hospital`}
                        value={newUser.assignedOrgName}
                        onChange={(e) => setNewUser({ ...newUser, assignedOrgName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                    <input
                      type="text"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCreateUserModalOpen(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Create User & Save
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
