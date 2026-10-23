import React, { useState } from 'react';
import { ArrowLeft, Volume2, HelpCircle, RotateCcw, Clock, Eye, FileText, ExternalLink } from 'lucide-react';
import { TYPE_CONFIG } from '../constants';
import DrivePreviewModal from '../../../components/modals/DrivePreviewModal';
import { extractDriveUrl } from '../../../utils/driveUtils';

export default function ActiveQuizView({
  activeAssignment,
  activeProgress,
  currentAnswers,
  setCurrentAnswers,
  helpRequested,
  onClose,
  onSpeak,
  onRequestHelp,
  onFinishStage
}) {
  const [previewModalUrl, setPreviewModalUrl] = useState(null);

  if (!activeAssignment) return null;

  const typeCfg = TYPE_CONFIG[activeAssignment.assignmentType || 'assignment'] || TYPE_CONFIG.assignment;
  const currentStage = activeAssignment.stages?.[activeProgress?.currentStageIndex || 0];
  const isLastStage = (activeProgress?.currentStageIndex || 0) + 1 >= (activeAssignment.stages?.length || 1);

  const teacherDriveUrl = (Array.isArray(activeAssignment.resourceLinks) && activeAssignment.resourceLinks.length > 0)
    ? activeAssignment.resourceLinks[0]
    : extractDriveUrl(activeAssignment.instructions || '');

  const studentDriveUrl = activeProgress?.driveLink || extractDriveUrl(activeProgress?.answersJson || '');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#5C2C90] bg-slate-100 px-3 py-1.5 rounded-full mb-2 cursor-pointer"
          >
            <ArrowLeft size={13} /> العودة للتكليفات
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{activeAssignment.title}</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${typeCfg.color}`}>
              {typeCfg.icon} {typeCfg.label}
            </span>
            {activeProgress?.extraMinutesGranted > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Clock size={12} /> +{activeProgress.extraMinutesGranted} دقيقة إضافية ممنوحة
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSpeak(activeAssignment.instructions)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-purple-50 text-[#5C2C90] px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer"
            title="الاستماع للتعليمات"
          >
            <Volume2 size={15} /> استمع
          </button>

          <button
            onClick={() => onRequestHelp('استفسار حول متطلبات التكليف')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white transition-all shadow-xs cursor-pointer ${
              helpRequested ? 'bg-emerald-600' : 'bg-[#E4007C] hover:bg-[#c4006a]'
            }`}
          >
            <HelpCircle size={15} />
            <span>{helpRequested ? 'تم إرسال الاستفسار للمعلم ✅' : 'طلب مساعدة من المعلم'}</span>
          </button>
        </div>
      </div>

      {/* Teacher Revision Request Alert if Returned */}
      {activeProgress?.teacherEncouragementMsg && activeProgress?.status === 1 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <RotateCcw className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-extrabold text-sm block">ملاحظة المعلم لإعادة المراجعة:</span>
            <p className="text-xs mt-1 font-semibold">{activeProgress.teacherEncouragementMsg}</p>
          </div>
        </div>
      )}

      {/* Teacher Drive Attachment Banner */}
      {teacherDriveUrl && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#5C2C90] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <span className="font-black text-sm text-slate-900 block truncate">
                ملف الشرح والتكليف المرفق من المعلم (Google Drive)
              </span>
              <span className="text-xs text-slate-500 font-bold block mt-0.5">
                يمكنك الاطلاع على شيت المعمل وملفات التكليف مباشرة هنا دون مغادرة المنصة
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPreviewModalUrl(teacherDriveUrl)}
            className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Eye size={14} />
            <span>معاينة الملف في المنصة 👁️</span>
          </button>
        </div>
      )}

      <p className="text-slate-600 text-sm leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        {activeAssignment.instructions}
      </p>

      {/* Stages Progress Indicator */}
      {activeAssignment.stages && activeAssignment.stages.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
            <span>المرحلة الحالية: {currentStage?.name}</span>
            <span>{(activeProgress?.currentStageIndex || 0) + 1} من {activeAssignment.stages.length}</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5C2C90] to-[#E4007C] transition-all duration-300 rounded-full"
              style={{
                width: `${Math.min(100, (((activeProgress?.currentStageIndex || 0) + (activeProgress?.status === 4 ? 1 : 0)) / activeAssignment.stages.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Submission Completion State */}
      {activeProgress?.status === 4 ? (
        <div className="text-center py-10 px-4 bg-purple-50/50 rounded-3xl border border-purple-100 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center text-2xl shadow-sm">
            ✓
          </div>
          <h4 className="text-2xl font-black text-[#5C2C90]">تم تسليم الحل بنجاح</h4>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            حصلت على ⭐ {activeProgress.stars || 4} نجوم وسُجّل التسليم في كشف الدرجات.
          </p>

          {/* Show Teacher Grade and Feedback if Graded */}
          {activeProgress.isGraded ? (
            <div className="max-w-md mx-auto bg-white p-5 rounded-2xl border border-purple-200 text-right shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-sm text-slate-900">درجة التقييم:</span>
                <span className="text-xl font-black text-[#5C2C90]">
                  {activeProgress.manualGrade ?? activeProgress.autoScore} / 20 ⭐
                </span>
              </div>
              {activeProgress.teacherFeedback && (
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">ملاحظات المعلم:</span>
                  <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    "{activeProgress.teacherFeedback}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="inline-block bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              ⏳ قيد المراجعة والتقييم من المعلم
            </div>
          )}

          {/* Show Student Submission Drive File Preview if submitted */}
          {studentDriveUrl && (
            <div className="max-w-md mx-auto p-3.5 bg-white rounded-2xl border border-purple-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">ملف تسليمك المعتمد (Drive):</span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(studentDriveUrl)}
                className="text-[#5C2C90] font-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Eye size={13} />
                <span>معاينة ملفك في المنصة 👁️</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              العودة لقائمة التكليفات
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {currentStage?.questions?.map((q, qIdx) => (
            <div key={q.id || qIdx} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
              <div className="font-bold text-base text-slate-900 mb-3 flex items-center justify-between">
                <span>{qIdx + 1}. {q.text}</span>
                <span className="bg-purple-100 text-[#5C2C90] text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {q.points} نقاط
                </span>
              </div>

              {q.type === 1 || q.type === 2 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setCurrentAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                      className={`p-3.5 rounded-xl font-semibold text-sm text-right transition-all border cursor-pointer ${
                        currentAnswers[qIdx] === oIdx
                          ? 'bg-[#5C2C90] text-white border-[#5C2C90] shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    placeholder="اكتب إجابتك أو الصق رابط المشروع/الحل من Google Drive هنا..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E4007C] focus:outline-none"
                    value={currentAnswers[qIdx] || ''}
                    onChange={(e) => setCurrentAnswers((prev) => ({ ...prev, [qIdx]: e.target.value }))}
                  />

                  {extractDriveUrl(currentAnswers[qIdx] || '') && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-xs">
                      <span className="text-[#5C2C90] font-bold">تم رصد رابط ملف Drive لمشروعك</span>
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl(extractDriveUrl(currentAnswers[qIdx]))}
                        className="bg-white hover:bg-purple-100 text-[#5C2C90] border border-purple-200 px-3 py-1 rounded-lg font-black transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>معاينة الرابط قبل التسليم 👁️</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-3">
            <button
              onClick={onFinishStage}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-7 py-3 rounded-xl font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>
                {isLastStage
                  ? 'تسليم التكليف'
                  : 'حفظ ومتابعة المرحلة التالية'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Drive Preview Modal */}
      <DrivePreviewModal
        isOpen={!!previewModalUrl}
        onClose={() => setPreviewModalUrl(null)}
        url={previewModalUrl}
        title={activeAssignment.title || 'معاينة الملف المرفق'}
      />
    </div>
  );
}
