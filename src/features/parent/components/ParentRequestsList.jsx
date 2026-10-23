import React from 'react';
import { FileCheck, Send, Clock } from 'lucide-react';

export default function ParentRequestsList({
  parentRequests = [],
  onOpenRequestModal
}) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
            <FileCheck size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              طلبات واستئذانات ولي الأمر
            </h3>
            <p className="text-xs text-slate-500">
              متابعة حالة الأعذار، وأذونات الخروج، وردود شؤون الطلاب.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRequestModal}
          className="flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Send size={13} />
          <span>+ تقديم طلب جديد</span>
        </button>
      </div>

      {parentRequests.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-500">لا توجد طلبات مقدمة حاليًا</p>
          <p className="text-[11px] text-slate-400 mt-1">
            يمكنك تقديم عذر غياب أو إذن خروج بالضغط على "تقديم طلب جديد".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {parentRequests.map((req) => {
            const isApproved = req.status === 'approved';
            const isRejected = req.status === 'rejected';

            return (
              <div
                key={req.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isApproved
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isRejected
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-amber-50/40 border-amber-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isApproved
                          ? 'bg-emerald-600 text-white'
                          : isRejected
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {isApproved
                        ? 'تمت الموافقة'
                        : isRejected
                        ? 'مرفوض'
                        : 'قيد المراجعة'}
                    </span>

                    <span className="text-xs font-black text-slate-900">
                      {req.requestType === 'absence_excuse'
                        ? 'عذر غياب'
                        : req.requestType === 'leave_permission'
                        ? 'إذن خروج مبكر'
                        : req.requestType === 'meeting_request'
                        ? 'طلب مقابلة'
                        : 'استفسار'}
                    </span>

                    <span className="text-xs font-bold text-[#5C2C90]">
                      الطالب: {req.studentName} (فصل {req.classroom})
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 font-mono">
                    <Clock size={11} />
                    تاريخ الطلب: {new Date(req.createdAtUtc).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200/50 mb-2">
                  {req.reason}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                  <div className="flex items-center gap-3 text-slate-500 font-bold">
                    <span>الفترة: {req.startDate} إلى {req.endDate}</span>
                    {req.attachmentUrl && (
                      <span className="text-purple-700">المرفقات: {req.attachmentUrl}</span>
                    )}
                  </div>

                  {req.reviewedByStaffName && (
                    <div className="text-[11px] font-black text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      المراجع: {req.reviewedByStaffName}
                      {req.reviewNotes && ` — "${req.reviewNotes}"`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
