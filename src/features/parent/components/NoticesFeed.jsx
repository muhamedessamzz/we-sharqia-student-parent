import React, { useState } from 'react';
import {
  Bell,
  AlertOctagon,
  Calendar,
  Scissors,
  Shirt,
  Check,
  CheckCircle2,
  MessageSquare,
  X,
  Send,
  Sparkles
} from 'lucide-react';

export default function NoticesFeed({
  displayNotices = [],
  activeTabFilter,
  setActiveTabFilter,
  totalNoticesCount = 0,
  pendingCount = 0,
  onAcknowledge,
  onContactCounselor
}) {
  const [selectedNoticeForAck, setSelectedNoticeForAck] = useState(null);
  const [parentReplyNote, setParentReplyNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const quickTemplates = [
    'تم التنبيه على الطالب والحرص على الالتزام الكامل بالتعليمات ✓',
    'سيتم الحضور للمدرسة لمقابلة الأخصائي في الموعد المحدد 🤝',
    'تم الاطلاع وسنقوم بالمتابعة الفورية والتواصل مع المدرسة 💜'
  ];

  const handleConfirmAck = async () => {
    if (!selectedNoticeForAck) return;
    setIsSubmitting(true);
    try {
      await onAcknowledge(selectedNoticeForAck.id, parentReplyNote);
      setToastMessage('تم توثيق اطلاعك وتأكيد المتابعة رسمياً لدى إدارة المدرسة والأخصائي الاجتماعي بنجاح ✓');
      setSelectedNoticeForAck(null);
      setParentReplyNote('');
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 relative">
      {/* Success Toast */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-white shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 hover:bg-emerald-700 rounded-lg cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center shadow-xs">
            <Bell size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>إخطارات الأخصائي الاجتماعي والتوجيه السلوكي</span>
              {pendingCount > 0 && (
                <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {pendingCount} جديد
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              متابعة المظهر العام، الزي المدرسي، تنبيهات الغياب، وملاحظات الانضباط المدرسي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTabFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            الكل ({totalNoticesCount})
          </button>
          <button
            onClick={() => setActiveTabFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTabFilter === 'pending' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            تنبيهات نشطة ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTabFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTabFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            تم الاطلاع عليها
          </button>
        </div>
      </div>

      {displayNotices.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          لا توجد إخطارات في هذا القسم حالياً. الطلاب ملتزمون بلائحة الانضباط وقواعد المدرسة.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayNotices.map((n) => {
            const isHaircut = n.category === 'haircut';
            const isAbsence = n.category === 'absence';
            const isDisruption = n.category === 'disruption';
            const isUniform = n.category === 'uniform';
            const isPositive = n.category === 'positive';
            const isSummon = n.category === 'summon';

            const cardBorder = isSummon
              ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-200'
              : isDisruption
              ? 'border-rose-200 bg-rose-50/20'
              : isAbsence
              ? 'border-amber-200 bg-amber-50/20'
              : isPositive
              ? 'border-emerald-300 bg-emerald-50/30'
              : isHaircut
              ? 'border-purple-200 bg-purple-50/20'
              : 'border-indigo-200 bg-indigo-50/20';

            const badgeColor = isSummon
              ? 'bg-rose-600 text-white border-rose-700'
              : isDisruption
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : isAbsence
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : isPositive
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : isHaircut
              ? 'bg-purple-100 text-[#5C2C90] border-purple-300'
              : 'bg-indigo-100 text-indigo-800 border-indigo-300';

            const icon = isSummon ? (
              <AlertOctagon size={16} className="text-rose-600 animate-pulse" />
            ) : isPositive ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : isDisruption ? (
              <AlertOctagon size={16} className="text-rose-600" />
            ) : isAbsence ? (
              <Calendar size={16} className="text-amber-600" />
            ) : isHaircut ? (
              <Scissors size={16} className="text-[#5C2C90]" />
            ) : (
              <Shirt size={16} className="text-indigo-600" />
            );

            const categoryTitle = isSummon
              ? 'استدعاء ولي أمر عاجل 🚨'
              : isDisruption
              ? 'مخالفة سلوكية ولائحة الانضباط'
              : isAbsence
              ? 'إنذار غياب وتجاوز نسبة الحضور'
              : isPositive
              ? 'تكريم وتميز سلوكي وأكاديمي ⭐'
              : isHaircut
              ? 'تنبيه المظهر العام وقص الشعر'
              : 'تنبيه الزي المدرسي المعتمد';

            return (
              <div
                key={n.id}
                className={`rounded-2xl p-4 sm:p-5 border ${cardBorder} shadow-xs flex flex-col justify-between gap-3.5 transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200/60">
                        {icon}
                      </div>
                      <div>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {categoryTitle}
                        </span>
                        <h4 className="font-black text-sm text-slate-900 mt-1">
                          الطالب: {n.studentName}
                        </h4>
                      </div>
                    </div>

                    <div className="text-left text-[11px] text-slate-400 font-mono">
                      <div>{n.date}</div>
                      <div>{n.timestamp}</div>
                    </div>
                  </div>

                  {n.title && n.title !== n.message && (
                    <div className="text-xs font-black text-slate-900">
                      {n.title}
                    </div>
                  )}

                  <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/70 text-xs text-slate-800 leading-relaxed font-medium">
                    {n.message}
                  </div>

                  {n.actionTaken && (
                    <div className="text-[11px] bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-lg text-slate-600 flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">الإجراء المتخذ:</span>
                      <span>{n.actionTaken}</span>
                    </div>
                  )}

                  {n.parentNotes && (
                    <div className="text-[11px] bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 flex items-center gap-1.5">
                      <span className="font-bold">إفادة ولي الأمر:</span>
                      <span>{n.parentNotes}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                  {n.acknowledged ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                      <Check size={13} />
                      <span>تم تأكيد الاطلاع رسمياً ✓</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedNoticeForAck(n);
                        setParentReplyNote('');
                      }}
                      className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>تأكيد الاطلاع وتوثيق الرد</span>
                    </button>
                  )}

                  <button
                    onClick={() => onContactCounselor(n)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>مراسلة الأخصائي الاجتماعي</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Acknowledgment Modal */}
      {selectedNoticeForAck && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    توثيق استلام الإشعار وتأكيد المتابعة
                  </h4>
                  <p className="text-xs text-slate-500">
                    الطالب: {selectedNoticeForAck.studentName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNoticeForAck(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900">{selectedNoticeForAck.title}</div>
              <div className="text-slate-600 leading-relaxed">{selectedNoticeForAck.message}</div>
              {selectedNoticeForAck.actionTaken && (
                <div className="text-slate-500 pt-1 text-[11px]">
                  <span className="font-bold">الإجراء:</span> {selectedNoticeForAck.actionTaken}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                إفادة أو ملاحظة ولي الأمر الموجهة لإدارة المدرسة والأخصائي (اختياري):
              </label>
              <textarea
                rows={3}
                value={parentReplyNote}
                onChange={(e) => setParentReplyNote(e.target.value)}
                placeholder="اكتب ملاحظتك أو تعليقك هنا..."
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:border-[#5C2C90] focus:ring-2 focus:ring-[#5C2C90]/10 transition-all resize-none"
              />

              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#5C2C90]" />
                  <span>ردود سريعة جاهزة:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setParentReplyNote(tmpl)}
                      className="text-[10px] bg-slate-100 hover:bg-purple-50 hover:text-[#5C2C90] text-slate-600 px-2.5 py-1 rounded-xl transition-colors cursor-pointer border border-slate-200/60"
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedNoticeForAck(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmAck}
                className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send size={14} />
                <span>{isSubmitting ? 'جاري التوثيق...' : 'تأكيد وإرسال الإقرار رسمياً'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
