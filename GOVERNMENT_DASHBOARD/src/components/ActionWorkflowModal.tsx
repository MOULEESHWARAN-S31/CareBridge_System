import React from 'react';
import { X, CheckCircle2, AlertTriangle, UserCheck, Send, Truck, Pill, Droplet, Calendar, Megaphone, Check } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export const ActionWorkflowModal: React.FC = () => {
  const { activeActionAlert, setActiveActionAlert, updateAlertProgressStep } = useHealthData();

  if (!activeActionAlert) return null;

  const stepIcons = [
    AlertTriangle,
    UserCheck,
    Send,
    Send,
    Truck,
    Pill,
    Droplet,
    Calendar,
    Megaphone,
    CheckCircle2
  ];

  const completedCount = activeActionAlert.actionProgressSteps.filter(s => s.completed).length;
  const progressPercentage = Math.round((completedCount / activeActionAlert.actionProgressSteps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white uppercase tracking-wider shadow-xs">
                {activeActionAlert.riskLevel} ALERT WORKFLOW
              </span>
              <span className="text-xs text-slate-500 font-mono">{activeActionAlert.timestamp}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">{activeActionAlert.disease} – {activeActionAlert.villageName} Village</h2>
            <p className="text-xs text-slate-500 mt-1">
              Normal weekly baseline: {activeActionAlert.normalWeeklyCases} cases • Current: <strong className="text-red-600">{activeActionAlert.currentCases} cases (+{activeActionAlert.increasePercentage}%)</strong>
            </p>
          </div>
          <button
            onClick={() => setActiveActionAlert(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-extrabold uppercase text-slate-700">Action Protocol Execution Progress</span>
            <span className="text-xs font-black text-emerald-700">{completedCount} of 10 Steps Complete ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 10-Step Interactive Action Flow */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">
            10-Point Emergency Action Protocol (Click step to complete):
          </h4>

          {activeActionAlert.actionProgressSteps.map((stepItem, idx) => {
            const Icon = stepIcons[idx] || CheckCircle2;
            const isCompleted = stepItem.completed;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (!isCompleted) {
                    updateAlertProgressStep(activeActionAlert.id, idx);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isCompleted ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600 border border-slate-300'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-800 line-through opacity-90' : 'text-slate-900'}`}>
                      {stepItem.step}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {stepItem.timestamp && (
                    <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                      {stepItem.timestamp}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? 'Done' : 'Execute'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="text-xs text-slate-500 font-mono">
            Assigned Officer: <strong className="text-slate-900">{activeActionAlert.assignedOfficer || 'Dr. S. Kumar (DHO)'}</strong>
          </div>
          <button
            onClick={() => setActiveActionAlert(null)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow cursor-pointer"
          >
            Close Protocol Window
          </button>
        </div>
      </div>
    </div>
  );
};
