import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ParentHeader({
  user,
  pendingCount = 0,
  onOpenRequestModal
}) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">بوابة ولي الأمر</h2>
          <span className="text-[11px] font-bold text-[#5C2C90] bg-[#5C2C90]/10 px-2.5 py-0.5 rounded-full border border-purple-200">
            {user.fullName || 'ولي الأمر'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          متابعة المستوى الدراسي للأبناء، والحضور والغياب، وإخطارات الإرشاد الطلابي.
        </p>
      </div>

      {/* Actions: Request Button & Summary Pill */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenRequestModal}
          className="flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 px-4 py-2.5 rounded-2xl shadow-md shadow-purple-950/20 transition-all cursor-pointer"
        >
          <Send size={14} />
          <span>+ تقديم طلب أو عذر غياب</span>
        </button>

        {pendingCount > 0 && (
          <div className="bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-bold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>لديك {pendingCount} إشعار يتطلب الاطلاع</span>
          </div>
        )}
      </div>
    </div>
  );
}
