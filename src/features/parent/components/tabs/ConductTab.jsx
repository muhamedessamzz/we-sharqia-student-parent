import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  Sparkles,
  Send,
  X,
  Shirt,
  Info
} from 'lucide-react';

export default function ConductTab({
  child,
  notices = [],
  onAcknowledgeNotice,
  onContactCounselor,
  onSelectCertStudent
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedNoticeForAck, setSelectedNoticeForAck] = useState(null);
  const [parentReplyNote, setParentReplyNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Filter notices for this child
  const childNotices = notices.filter(
    (n) => n.studentName && child?.fullName && (child.fullName.includes(n.studentName) || n.studentName.includes(child.fullName))
  );

  const pendingNotices = childNotices.filter((n) => !n.acknowledged);

  const filteredNotices = childNotices.filter((n) => {
    if (filterCategory === 'pending') return !n.acknowledged;
    if (filterCategory === 'acknowledged') return n.acknowledged;
    if (filterCategory === 'positive') return n.category === 'positive';
    if (filterCategory === 'uniform') return n.category === 'uniform';
    if (filterCategory === 'absence') return n.category === 'absence';
    if (filterCategory === 'disruption' || filterCategory === 'summon') {
      return n.category === 'disruption' || n.category === 'summon';
    }
    return true;
  });

  const quickTemplates = [
    'تم التنبيه على الطالب والحرص على الالتزام الكامل بالتعليمات ✓',
    'سيتم الحضور للمدرسة لمقابلة الأخصائي في الموعد المحدد 🤝',
    'تم الاطلاع وسنقوم بالمتابعة الفورية والتواصل مع المدرسة 💜'
  ];

  const handleConfirmAck = async (noticeId, note) => {
    setIsSubmitting(true);
    try {
      await onAcknowledgeNotice(noticeId, note);
      setSuccessToast('تم توثيق اطلاعك وتأكيد المتابعة رسمياً لدى إدارة المدرسة بنجاح ✓');
      setSelectedNoticeForAck(null);
      setParentReplyNote('');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* 1. Header Info */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              الانضباط والسلوك والإنذارات المدرسية
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              متابعة الزي الموحد، الحضور والطابور، الإنذارات الرسمية، وإمكانية التوقيع وتأكيد المتابعة.
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {pendingNotices.length > 0 ? (
            <div className="bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{pendingNotices.length} إشعار يتطلب توقيع ولي الأمر</span>
            </div>
          ) : (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>كافة الإخطارات موقعة ومؤكدة رسمياً</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Filter Navigation Chips */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `الكل (${childNotices.length})` },
            { id: 'pending', label: `بانتظار توقيعك (${pendingNotices.length})` },
            { id: 'acknowledged', label: 'تم الاطلاع والتأكيد' },
            { id: 'uniform', label: 'الزي والمظهر العام' },
            { id: 'absence', label: 'الغياب والتأخير' },
            { id: 'disruption', label: 'ملاحظات سلوكية واستدعاء' },
            { id: 'positive', label: 'شهادات التكريم 🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-[#5C2C90] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Notices Feed List */}
      {filteredNotices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-emerald-700 bg-emerald-50/40 border border-emerald-200 shadow-xs space-y-2">
          <CheckCircle2 size={40} className="mx-auto text-emerald-600 mb-2" />
          <h4 className="font-black text-sm sm:text-base text-emerald-800">
            ✓ لا توجد ملاحظات أو مخالفات مسجلة في هذا القسم
          </h4>
          <p className="text-xs text-emerald-600 font-medium">
            سجل الطالب منضبط وملتزم بلائحة السلوك والزي المعتمدة لمدارس WE.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const isPositive = notice.category === 'positive';
            const isSummon = notice.category === 'summon';
            const isAbsence = notice.category === 'absence';
            const isUniform = notice.category === 'uniform';
            const isAcknowledged = notice.acknowledged;

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs space-y-4 ${
                  !isAcknowledged
                    ? 'border-rose-300 ring-2 ring-rose-500/10'
                    : isPositive
                    ? 'border-emerald-200'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        isPositive
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isSummon
                          ? 'bg-rose-600 text-white border-rose-700'
                          : isAbsence
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : isUniform
                          ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {isPositive ? 'تكريم وتميز 🏅' : isSummon ? 'استدعاء ولي أمر ⚠️' : isAbsence ? 'إنذار غياب وتأخير 📅' : isUniform ? 'تنبيه الزي الموحد 👔' : 'ملاحظة سلوكية'}
                    </span>

                    <h4 className="font-black text-sm sm:text-base text-slate-900">
                      {notice.title}
                    </h4>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono self-start sm:self-auto">
                    {notice.date} {notice.timestamp}
                  </span>
                </div>

                {/* Details Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  {notice.message}
                </p>

                {notice.actionTaken && (
                  <div className="text-xs text-slate-700 bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
                    <span className="font-black text-[#5C2C90]">الإجراء الإداري المتخذ: </span>
                    <span>{notice.actionTaken}</span>
                  </div>
                )}

                {/* Parent Notes Display if already acknowledged */}
                {notice.parentNotes && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                    <span className="font-black">إفادة وتأكيد ولي الأمر: </span>
                    <span>"{notice.parentNotes}"</span>
                  </div>
                )}

                {/* Footer Actions & Status */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">الجهة المصدرة: {notice.issuedBy || 'الأخصائي الاجتماعي'}</span>
                    <span className="text-slate-300">·</span>
                    {isAcknowledged ? (
                      <span className="text-emerald-700 font-black text-xs flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>تم تأكيد الاطلاع رسمياً</span>
                      </span>
                    ) : (
                      <span className="text-rose-600 font-black text-xs flex items-center gap-1">
                        <AlertTriangle size={13} />
                        <span>بانتظار توقيع ولي الأمر</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isPositive && (
                      <button
                        onClick={() => onSelectCertStudent && onSelectCertStudent(child)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Award size={13} className="text-amber-600" />
                        <span>طباعة شهادة التقدير 🏆</span>
                      </button>
                    )}

                    <button
                      onClick={() => onContactCounselor(notice)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="مراسلة الأخصائي الاجتماعي واتساب"
                    >
                      <MessageSquare size={13} />
                      <span>مراسلة الأخصائي</span>
                    </button>

                    {!isAcknowledged && (
                      <button
                        onClick={() => {
                          setSelectedNoticeForAck(notice);
                          setParentReplyNote('تم التنبيه على الطالب والحرص على الالتزام الكامل بالتعليمات ✓');
                        }}
                        className="bg-[#5C2C90] hover:bg-[#431e6c] text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        <span>تأكيد الاطلاع وتوثيق الرد</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Acknowledgment Input Form if open */}
                {selectedNoticeForAck?.id === notice.id && (
                  <div className="mt-3 p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2.5 animate-fade-in">
                    <label className="text-xs font-black text-slate-800 block">
                      إفادة وملاحظات ولي الأمر للمدرسة:
                    </label>
                    <input
                      type="text"
                      placeholder="اكتب ردك أو اختر قالباً جاهزاً من الأسفل..."
                      value={parentReplyNote}
                      onChange={(e) => setParentReplyNote(e.target.value)}
                      className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
                    />

                    <div className="flex flex-wrap gap-1.5">
                      {quickTemplates.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setParentReplyNote(tmpl)}
                          className="text-[10px] font-bold bg-white hover:bg-purple-100 text-[#5C2C90] px-2 py-1 rounded-lg border border-purple-200 cursor-pointer"
                        >
                          {tmpl}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        disabled={isSubmitting}
                        onClick={() => handleConfirmAck(notice.id, parentReplyNote)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'جارٍ الحفظ...' : 'تأكيد التوقيع والاطلاع رسمياً ✓'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedNoticeForAck(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
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
