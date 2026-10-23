import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { TYPE_CONFIG } from '../constants';

export default function AssignmentsHomeTab({
  assignments = [],
  progressMap = {},
  doneCount = 0,
  gradedCount = 0,
  onStartAssignment
}) {
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredAssignments = assignments.filter((a) => {
    if (typeFilter === 'all') return true;
    return (a.assignmentType || 'assignment').toLowerCase() === typeFilter.toLowerCase();
  });

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500">إجمالي التكليفات</span>
          <div className="text-3xl font-black text-[#5C2C90] mt-1">{assignments.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500">المكتملة</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">{doneCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500">المهام المقيّمة</span>
          <div className="text-3xl font-black text-[#FF6900] mt-1">{gradedCount}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h3 className="text-base font-black text-slate-900">التكليفات الدراسية</h3>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'all' ? 'bg-[#5C2C90] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الكل ({assignments.length})
          </button>
          <button
            onClick={() => setTypeFilter('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'quiz' ? 'bg-[#5C2C90] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اختبارات قصيرة
          </button>
          <button
            onClick={() => setTypeFilter('task')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'task' ? 'bg-[#5C2C90] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مهام عملية
          </button>
          <button
            onClick={() => setTypeFilter('assignment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'assignment' ? 'bg-[#5C2C90] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            واجبات
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400">
            لا توجد تكليفات حاليًا.
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const prog = progressMap[asg.id];
            const isDone = prog?.status === 4 || prog?.status === 'done';
            const isGraded = prog?.isGraded;
            const isReturned = prog?.status === 1 && prog?.teacherEncouragementMsg;
            const typeCfg = TYPE_CONFIG[asg.assignmentType || 'assignment'] || TYPE_CONFIG.assignment;

            return (
              <div
                key={asg.id}
                className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  isReturned
                    ? 'border-r-4 border-r-amber-500 border-amber-200 bg-amber-50/20'
                    : isDone
                    ? 'border-r-4 border-r-emerald-500 border-slate-200/80'
                    : 'border-r-4 border-r-[#5C2C90] border-slate-200/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeCfg.color}`}>
                      {typeCfg.icon} {typeCfg.label}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{asg.title}</h4>
                    {isGraded ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-black bg-purple-100 text-[#5C2C90]">
                        الدرجة: {prog.manualGrade ?? prog.autoScore} / 20 ⭐
                      </span>
                    ) : isDone ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
                        تم التسليم
                      </span>
                    ) : isReturned ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <RotateCcw size={11} /> مطلوب إعادة التسليم
                      </span>
                    ) : prog ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-pink-50 text-[#E4007C]">
                        قيد التنفيذ
                      </span>
                    ) : (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                        جديد
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    {asg.suggestedMinutes} دقيقة مقترحة · {asg.stages?.length || 1} أسئلة/مراحل
                    {asg.targetClassroom ? ` · مخصص لفصل ${asg.targetClassroom}` : ' · متاح للجميع'}
                  </p>

                  {isReturned && (
                    <p className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg inline-block border border-amber-200">
                      ملاحظة المعلم: "{prog.teacherEncouragementMsg}"
                    </p>
                  )}

                  {isGraded && prog.teacherFeedback && (
                    <p className="text-xs text-purple-800 font-semibold bg-purple-50 px-2.5 py-1 rounded-lg inline-block border border-purple-100">
                      ملاحظة المعلم: "{prog.teacherFeedback}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onStartAssignment(asg)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto ${
                    isReturned
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                      : isDone
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-[#5C2C90] hover:bg-[#4a2175] text-white shadow-sm'
                  }`}
                >
                  {isReturned ? 'تعديل وإعادة التسليم' : isDone ? 'عرض الحل' : prog ? 'استكمال الحل' : 'بدء التكليف'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
