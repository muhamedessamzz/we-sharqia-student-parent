import React, { useState } from 'react';
import {
  FileCheck,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Search
} from 'lucide-react';

export default function RequestsTab({
  parentRequests = [],
  onOpenRequestModal
}) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'

  const filteredRequests = parentRequests.filter((req) => {
    if (statusFilter === 'pending') return req.status === 'pending';
    if (statusFilter === 'approved') return req.status === 'approved';
    if (statusFilter === 'rejected') return req.status === 'rejected';
    return true;
  });

  const pendingCount = parentRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = parentRequests.filter((r) => r.status === 'approved').length;

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* 1. Header with Primary Action Button */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold shrink-0">
            <FileCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              الطلبات والاستئذان وأعذار الغياب
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              تقديم أذونات الخروج والأعذار الطبية ومتابعة قرارات واعتماد شؤون الطلاب لحظة بلحظة.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRequestModal}
          className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white font-black text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-purple-950/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Send size={15} />
          <span>+ تقديم طلب أو عذر غياب جديد</span>
        </button>
      </div>

      {/* 2. Filter Navigation Chips */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `جميع الطلبات (${parentRequests.length})` },
            { id: 'pending', label: `قيد المراجعة ⏳ (${pendingCount})` },
            { id: 'approved', label: `معتمدة ومقبولة ✓ (${approvedCount})` },
            { id: 'rejected', label: 'غير معتمدة' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#5C2C90] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Requests List Cards */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/90 shadow-xs space-y-3">
          <FileCheck size={40} className="mx-auto text-slate-300" />
          <h4 className="font-bold text-slate-700 text-sm">لا توجد طلبات مسجلة في هذا القسم</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            يمكنك إرسال طلب استئذان مبكر أو تقديم عذر غياب طبي لإدارة المدرسة بالضغط على زر "تقديم طلب جديد" أعلاه.
          </p>
          <button
            onClick={onOpenRequestModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C2C90] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-xl transition-all cursor-pointer mt-2"
          >
            <span>تقديم طلب الآن</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredRequests.map((req) => {
            const isApproved = req.status === 'approved';
            const isRejected = req.status === 'rejected';
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-5 border transition-all shadow-xs space-y-3 ${
                  isApproved
                    ? 'border-emerald-200 ring-1 ring-emerald-500/10'
                    : isRejected
                    ? 'border-rose-200'
                    : 'border-amber-200/80 ring-1 ring-amber-500/10'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        req.requestType === 'early_leave'
                          ? 'bg-purple-50 text-[#5C2C90] border-purple-200'
                          : req.requestType === 'absence_excuse'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                      }`}
                    >
                      {req.requestType === 'early_leave'
                        ? 'إذن خروج مبكر'
                        : req.requestType === 'absence_excuse'
                        ? 'عذر غياب طبي/ظرف'
                        : 'طلب مقابلة إدارة'}
                    </span>

                    {req.studentName && (
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <User size={12} className="text-slate-400" />
                        <span>الطالب: {req.studentName}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {req.createdAtUtc ? new Date(req.createdAtUtc).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>

                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                      }`}
                    >
                      {isApproved ? 'معتمد ومقبول ✓' : isRejected ? 'مرفوض ✕' : 'قيد المراجعة الإدارية ⏳'}
                    </span>
                  </div>
                </div>

                {/* Reason Text */}
                <div className="text-xs text-slate-700 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">سبب الطلب:</span>
                  {req.reason}
                </div>

                {/* Response / Resolution from Administration */}
                {req.responseNote ? (
                  <div
                    className={`text-xs p-3 rounded-2xl border leading-relaxed ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border-rose-200'
                    }`}
                  >
                    <span className="font-black block mb-0.5">
                      رد شؤون الطلاب وإدارة المدرسة ({req.reviewedByName || 'إدارة المدرسة'}):
                    </span>
                    <p className="text-[11px] leading-relaxed">"{req.responseNote}"</p>
                    {req.reviewedAtUtc && (
                      <span className="text-[10px] opacity-75 font-mono block mt-1">
                        تمت المراجعة في: {new Date(req.reviewedAtUtc).toLocaleString('ar-EG')}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-800 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 flex items-center gap-2">
                    <Clock size={13} className="shrink-0 text-amber-600" />
                    <span>الطلب معروض حالياً على لجنة شؤون الطلاب والبت فيه يتم خلال ساعات الدوام المدرسي.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
