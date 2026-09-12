import { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, ArrowRight, Sparkles, FileText 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useHealthData } from '../context/HealthDataContext';
import { MOCK_AI_PREDICTION } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function AIPrediction() {
  const { createNewAlert } = useHealthData();
  const navigate = useNavigate();
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl text-slate-900 shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI EPIDEMIOLOGICAL RISK ENGINE
            </span>
            <span className="text-xs text-emerald-700 font-mono font-bold">MODEL V4.2 • HIGH CONFIDENCE (91%)</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">AI-Assisted Outbreak Risk Prediction</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Predictive machine learning algorithm synthesizing OPD symptom spikes, NS1 positive rates, rainfall data, and vector mobility.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAnalysisModal(true)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 text-emerald-600" /> View Technical Model Analysis
          </button>
        </div>
      </div>

      {/* MANDATORY AI DISCLAIMER BANNER */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3 text-amber-950 text-xs font-medium shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <strong>AI-ASSISTED PREDICTION DISCLAIMER:</strong> This module provides data-driven risk estimation based on synthetic epidemiological algorithms to support early government intervention. It is intended for early warning and planning assistance — <strong>AI predictions do NOT guarantee future outbreak occurrences</strong>.
        </div>
      </div>

      {/* Main Prediction Score Card & Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Dial Card (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Village Flagged</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{MOCK_AI_PREDICTION.villageName} Village</h3>
            <p className="text-xs text-red-600 font-bold">{MOCK_AI_PREDICTION.disease}</p>
          </div>

          {/* Score Circle Gauge */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-8 border-red-500/20 flex flex-col items-center justify-center bg-red-50/50 shadow-inner">
              <span className="text-4xl font-black text-red-600">{MOCK_AI_PREDICTION.riskScore}</span>
              <span className="text-xs font-extrabold text-red-800 uppercase tracking-widest mt-0.5">/ 100 RISK</span>
            </div>
            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold uppercase shadow-sm">
              {MOCK_AI_PREDICTION.riskLevel}
            </div>
          </div>

          <div className="w-full space-y-3">
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs font-bold text-red-950 text-left leading-relaxed">
              🔮 <strong>AI Forecast:</strong> "{MOCK_AI_PREDICTION.forecastMessage}"
            </div>

            <button
              onClick={() => {
                createNewAlert('Mecheri', 'AI-Flagged Dengue Outbreak Prevention Protocol');
                navigate('/dashboard/alerts');
              }}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              ⚡ Take Preventive Action Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Indicators Checklist (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Key Outbreak Risk Indicators Detected</h3>
                <p className="text-xs text-slate-500">Automated signals triggering high risk score in Mecheri block</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Confidence Score: {MOCK_AI_PREDICTION.confidence}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {MOCK_AI_PREDICTION.indicators.map((ind, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      ind.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{ind.label}</div>
                      <div className="text-[11px] text-slate-500">{ind.value}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    ind.status === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-400 text-slate-950'
                  }`}>
                    {ind.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Vector: <em>Aedes aegypti</em></span>
            <span>Recommended Response Time: <strong>Immediate (&lt; 6 Hours)</strong></span>
          </div>
        </div>
      </div>

      {/* Forecast Trend Graph */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">7-Day & 14-Day Predictive Case Curve</h3>
            <p className="text-xs text-slate-500">Solid line: Historical cases • Dashed line: AI Projected trajectory without intervention</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="w-3 h-0.5 bg-red-600"></span> Historical
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-3 h-0.5 bg-indigo-600 stroke-dasharray"></span> AI Projected
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_AI_PREDICTION.trendChart} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="historical" name="Observed Cases" stroke="#ef4444" strokeWidth={3} dot={{ r: 6 }} />
              <Line type="monotone" dataKey="predicted" name="AI Projected Trend" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">AI Model Methodology & Weight Matrix</h3>
              <button onClick={() => setShowAnalysisModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Algorithm Architecture:</strong> XGBoost Ensemble + Temporal Graph Convolutional Network trained on historical Tamil Nadu Directorate of Public Health datasets (2018–2025).
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 font-mono text-slate-800">
                <div>• OPD Fever Surge Weight: 35%</div>
                <div>• NS1 Rapid Kit Positivity: 30%</div>
                <div>• Spatial Neighbor Cluster Score: 20%</div>
                <div>• Rainfall & Stagnant Vector Index: 15%</div>
              </div>
              <p className="text-slate-500">
                Data input sources: Hospital E-Health Record Registries, Daily OPD logs, Epidemiological Surveillance registries, and local meteorological feeds.
              </p>
            </div>
            <button onClick={() => setShowAnalysisModal(false)} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors">
              Close Technical Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
