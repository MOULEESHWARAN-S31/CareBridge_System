import { useState } from 'react';
import { 
  Stethoscope, Search, AlertTriangle, Video, Building2, MapPin
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function DoctorManagement() {
  const { doctors } = useHealthData();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const specialtiesList = [
    'General Medicine', 'Pediatrics', 'Cardiology', 'Dermatology', 
    'Gynecology', 'Orthopedics', 'ENT', 'Ophthalmology', 
    'Psychiatry', 'Emergency Medicine'
  ];

  // Specialist shortage warnings
  const specialistShortages = [
    { specialty: 'Cardiology', districtsAffected: ['Dharmapuri', 'Namakkal', 'Erode', 'Tiruchirappalli'], severity: 'High' },
    { specialty: 'Psychiatry', districtsAffected: ['Dharmapuri', 'Salem (Rural Blocks)'], severity: 'Medium' },
    { specialty: 'ENT Specialists', districtsAffected: ['Yercaud Tribal Block', 'Edappadi'], severity: 'Medium' }
  ];

  const filteredDoctors = doctors.filter(doc => {
    if (selectedSpecialty !== 'ALL' && doc.specialization !== selectedSpecialty) return false;
    if (selectedAvailability !== 'ALL' && doc.availability !== selectedAvailability) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.facilityName.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.taluk.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            <span>Doctor & Specialist Clinical Roster Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring of government medical officers, specialist deployments & teleconsultation coverage
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          Total Roster: <strong className="text-emerald-700 font-mono">{doctors.length} Specialists on duty</strong>
        </div>
      </div>

      {/* Specialist Shortage Intelligence Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-600 text-white rounded-xl flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-900">
                Specialist Shortage Detection & Geographic Redistribution Protocol
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                Automatic Alert
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              {specialistShortages.map((s, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-xs">
                  <span className="text-slate-900 font-bold block">{s.specialty} Shortage</span>
                  <span className="text-[11px] text-amber-800 block">
                    {s.districtsAffected.length} areas affected ({s.districtsAffected.join(', ')})
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Mitigation: Tele-specialty consultation scheduled via Central GMCH
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Specialty Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Clinical Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-emerald-700 font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All 10 Specializations</option>
              {specialtiesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Duty Status:</span>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 px-3 py-1.5 rounded-xl outline-none cursor-pointer font-medium shadow-sm"
            >
              <option value="ALL">All Duty Statuses</option>
              <option value="Available">Available for Consult</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Emergency Duty">Emergency Duty</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, hospital facility, specialty or taluk..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Doctors Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => {
          const availabilityBadge = doc.availability === 'Available'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : doc.availability === 'Emergency Duty'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : doc.availability === 'In Consultation'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-slate-100 text-slate-600 border-slate-200';

          return (
            <div 
              key={doc.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                    <span className="text-[11px] font-bold text-emerald-700 block">{doc.specialization}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${availabilityBadge}`}>
                    {doc.availability}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 my-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doc.facilityName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{doc.taluk} Taluk, {doc.district} Dist • {doc.experienceYears} Yrs Exp</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px]">
                  <span className="text-slate-500 block text-[10px]">Today's Load:</span>
                  <strong className="text-slate-900 font-mono">{doc.consultationLoadToday} Patients</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  {doc.teleconsultationAvailable && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-cyan-50 text-cyan-700 px-2 py-1 rounded border border-cyan-200">
                      <Video className="w-3 h-3" /> Teleconsult Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
