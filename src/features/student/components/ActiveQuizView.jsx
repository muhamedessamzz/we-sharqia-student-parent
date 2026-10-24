import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  HelpCircle,
  RotateCcw,
  Clock,
  Eye,
  FileText,
  Calendar,
  Timer,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { TYPE_CONFIG } from '../constants';
import DrivePreviewModal from '../../../components/modals/DrivePreviewModal';
import { extractDriveUrl } from '../../../utils/driveUtils';
import {
  formatDateTimeArabic,
  calculateDurationArabic,
  isDeadlinePassed
} from '../../../utils/dateUtils';

function formatSeconds(totalSecs) {
  if (totalSecs == null) return '00:00';
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

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
  const isQuiz = (activeAssignment.assignmentType || '').toLowerCase() === 'quiz' || (activeAssignment.suggestedMinutes > 0);
  const isFinished = activeProgress?.status === 4;

  const teacherDriveUrl = (Array.isArray(activeAssignment.resourceLinks) && activeAssignment.resourceLinks.length > 0)
    ? activeAssignment.resourceLinks[0]
    : extractDriveUrl(activeAssignment.instructions || '');

  const studentDriveUrl = activeProgress?.driveLink || extractDriveUrl(activeProgress?.answersJson || '');

  // Live countdown timer for quizzes
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!isQuiz || isFinished) return null;
    const startTime = new Date(activeProgress?.startedAtUtc || Date.now()).getTime();
    const totalMinutes = (activeAssignment.suggestedMinutes || 15) + (activeProgress?.extraMinutesGranted || 0);
    const endTime = startTime + totalMinutes * 60 * 1000;
    return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!isQuiz || isFinished) return;

    const timer = setInterval(() => {
      const startTime = new Date(activeProgress?.startedAtUtc || Date.now()).getTime();
      const totalMinutes = (activeAssignment.suggestedMinutes || 15) + (activeProgress?.extraMinutesGranted || 0);
      const endTime = startTime + totalMinutes * 60 * 1000;
      const rem = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(rem);

      if (rem <= 0) {
        clearInterval(timer);
        onFinishStage();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuiz, isFinished, activeProgress?.startedAtUtc, activeProgress?.extraMinutesGranted, activeAssignment.suggestedMinutes, onFinishStage]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs fade-in space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#5C2C90] bg-slate-100 px-3 py-1.5 rounded-full mb-2 cursor-pointer transition-colors"
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

          {/* Timing info subtitle */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 mt-2">
            {activeAssignment.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-[#5C2C90]" />
                <span>آخر موعد للإتاحة (الديدلاين):</span>
                <span className="text-slate-800 font-extrabold">{formatDateTimeArabic(activeAssignment.dueDate)}</span>
                {isDeadlinePassed(activeAssignment.dueDate) && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                    انتهى الموعد (تسليم متأخر)
                  </span>
                )}
              </span>
            )}
            {isQuiz && activeAssignment.suggestedMinutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-[#E4007C]" />
                <span>مدة الاختبار من بدء الحل:</span>
                <span className="text-slate-800 font-extrabold">{activeAssignment.suggestedMinutes} دقيقة</span>
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

      {/* Live Countdown Timer for Quiz */}
      {isQuiz && !isFinished && timeLeft !== null && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all shadow-xs ${
          timeLeft <= 120
            ? 'bg-rose-50 border-rose-300 text-rose-900 animate-pulse'
            : timeLeft <= 300
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
        }`}>
          <div className="flex items-center gap-2.5">
            <Timer size={20} className={timeLeft <= 120 ? 'text-rose-600 animate-spin' : 'text-[#5C2C90]'} />
            <div>
              <span className="text-xs sm:text-sm font-black block">
                {timeLeft <= 0 ? 'انتهى الوقت المحدد للاختبار! جاري تسليم إجاباتك...' : 'الوقت المتبقي لإنهاء الاختبار:'}
              </span>
              <span className="text-[11px] opacity-80">
                بدأ احتساب الوقت من لحظة فتحك للاختبار
              </span>
            </div>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-black tracking-widest px-4 py-1.5 rounded-xl bg-white/90 border border-current shadow-2xs" dir="ltr">
            {formatSeconds(timeLeft)}
          </div>
        </div>
      )}

      {/* Teacher Revision Request Alert if Returned */}
      {activeProgress?.teacherEncouragementMsg && activeProgress?.status === 1 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <RotateCcw className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-extrabold text-sm block">ملاحظة المعلم لإعادة المراجعة والتعديل:</span>
            <p className="text-xs mt-1 font-semibold">{activeProgress.teacherEncouragementMsg}</p>
          </div>
        </div>
      )}

      {/* Teacher Drive Attachment Banner */}
      {teacherDriveUrl && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
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

      {/* Instructions */}
      {activeAssignment.instructions && (
        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {activeAssignment.instructions}
        </p>
      )}

      {/* Stages Progress Indicator */}
      {activeAssignment.stages && activeAssignment.stages.length > 0 && (
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
            <span>المرحلة الحالية: {currentStage?.name || 'الأسئلة'}</span>
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
        <div className="text-center py-10 px-4 bg-purple-50/50 rounded-3xl border border-purple-100 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center text-2xl shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-[#5C2C90]">تم تسليم الحل بنجاح</h4>
            <p className="text-slate-600 text-sm max-w-md mx-auto mt-1">
              حصلت على ⭐ {activeProgress.stars || 4} نجوم وسُجّل التسليم في كشف الدرجات.
            </p>
          </div>

          {/* Timestamp & Duration Tracking Card */}
          <div className="bg-white p-5 rounded-2xl border border-purple-200 text-right shadow-xs space-y-3 max-w-md mx-auto">
            <div className="text-xs font-black text-slate-500 border-b pb-2 flex items-center justify-between">
              <span>بيانات توقيت حل وتسليم الاختبار</span>
              {activeProgress.isLate ? (
                <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md text-[11px] font-bold">
                  متأخر عن الديدلاين ⚠️
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[11px] font-bold">
                  في الموعد المحدد ✅
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">وقت بدء الحل:</span>
                <span className="font-bold text-slate-800 font-mono text-[11px]">
                  {formatDateTimeArabic(activeProgress.startedAtUtc)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">وقت التسليم النهائي:</span>
                <span className="font-bold text-slate-800 font-mono text-[11px]">
                  {formatDateTimeArabic(activeProgress.finishedAtUtc)}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-600 font-bold">الوقت المستغرق في الحل:</span>
                <span className="font-black text-[#5C2C90] text-sm">
                  {calculateDurationArabic(activeProgress.startedAtUtc, activeProgress.finishedAtUtc)}
                </span>
              </div>
            </div>
          </div>

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
          {currentStage?.questions?.map((q, qIdx) => {
            const isTF = q.type === 2;
            const isMCQ = q.type === 1;
            const isEssay = q.type === 3;

            // Normalize options: if True/False and no options provided, fallback to ['صح', 'خطأ']
            const options = (isTF && (!q.options || q.options.length === 0))
              ? ['صح', 'خطأ']
              : (q.options || []);

            return (
              <div key={q.id || qIdx} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
                <div className="font-bold text-base text-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-[#5C2C90] flex items-center justify-center text-xs font-black shrink-0">
                      {qIdx + 1}
                    </span>
                    <span>{q.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {isMCQ ? 'اختيار من متعدد' : isTF ? 'صح أو خطأ' : 'سؤال مقالي'}
                    </span>
                    <span className="bg-purple-100 text-[#5C2C90] text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                      {q.points} نقاط
                    </span>
                  </div>
                </div>

                {isMCQ || isTF ? (
                  <div className={`grid gap-2.5 ${isTF ? 'grid-cols-2' : options.length > 4 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {options.map((opt, oIdx) => {
                      const isSelected = currentAnswers[qIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setCurrentAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                          className={`p-3.5 rounded-xl font-semibold text-sm text-right transition-all border cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#5C2C90] text-white border-[#5C2C90] shadow-sm'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'border-white bg-white text-[#5C2C90]' : 'border-slate-300'
                          }`}>
                            {isSelected && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      placeholder="اكتب إجابتك أو الصق رابط المشروع/الحل من Google Drive أو GitHub هنا..."
                      rows={4}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E4007C] focus:outline-none leading-relaxed"
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
            );
          })}

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-bold">
              تأكد من إجابة جميع الأسئلة قبل الضغط على تسليم
            </span>
            <button
              onClick={onFinishStage}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-7 py-3 rounded-xl font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>
                {isLastStage
                  ? 'تسليم الحل النهائي'
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

