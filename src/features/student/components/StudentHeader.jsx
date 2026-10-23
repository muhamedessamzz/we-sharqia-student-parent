import React from 'react';
import { FileText, Award } from 'lucide-react';
import { GRADE_NAMES } from '../constants';

export default function StudentHeader({
  user,
  totalStars = 0,
  gradedCount = 0,
  onOpenReportCard,
  onOpenCertificate
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            أهلًا بك، {user.fullName}
          </h2>
          {(user.grade || user.classroom) && (
            <span className="text-[11px] font-bold text-[#5C2C90] bg-[#5C2C90]/10 px-2.5 py-0.5 rounded-full border border-[#5C2C90]/20 flex items-center gap-1.5">
              <span>{GRADE_NAMES[user.grade] || (user.grade ? `الصف ${user.grade}` : '')}</span>
              {user.grade && user.classroom && <span>•</span>}
              {user.classroom && <span className="font-mono">فصل {user.classroom}</span>}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">بوابة الطالب · التكليفات والمهارات الرقمية</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        <button
          onClick={onOpenReportCard}
          className="flex items-center gap-1.5 text-xs font-black text-[#5C2C90] bg-purple-50 hover:bg-purple-100 border border-purple-200/90 px-3 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
          title="عرض وطباعة كشف الدرجات"
        >
          <FileText size={14} />
          <span>كشف الدرجات</span>
        </button>

        <button
          onClick={onOpenCertificate}
          className="flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 px-3 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
          title="عرض وطباعة شهادة التقدير"
        >
          <Award size={14} className="text-amber-600" />
          <span>شهادة التقدير</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl text-amber-800">
          <span className="text-base">⭐</span>
          <div className="text-right">
            <span className="text-xs font-bold block">{totalStars}</span>
            <span className="text-[10px] text-amber-700/70 font-medium">النجوم</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200/80 px-3 py-1.5 rounded-xl text-[#5C2C90]">
          <span className="text-base">🎯</span>
          <div className="text-right">
            <span className="text-xs font-bold block">{gradedCount} مهمة</span>
            <span className="text-[10px] text-[#5C2C90]/70 font-medium">مقيّمة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
