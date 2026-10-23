import React, { useState } from 'react';
import { X, Send, FileText, Calendar, Clock, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';

export default function NewParentRequestModal({ isOpen, onClose, user, child, children = [], onRequestCreated }) {
  const currentChild = child || children[0] || {};
  const [selectedChildId, setSelectedChildId] = useState(currentChild.id || '');
  const [selectedChildName, setSelectedChildName] = useState(currentChild.fullName || '');
  const [selectedClassroom, setSelectedClassroom] = useState(currentChild.classroom || 'A1');
  const [requestType, setRequestType] = useState('absence_excuse');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [attachmentNote, setAttachmentNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keep state in sync if currentChild changes
  React.useEffect(() => {
    if (currentChild.id) {
      setSelectedChildId(currentChild.id);
      setSelectedChildName(currentChild.fullName || '');
      setSelectedClassroom(currentChild.classroom || 'A1');
    }
  }, [currentChild.id, currentChild.fullName, currentChild.classroom]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('اكتب سبب الطلب أو العذر.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createParentRequest({
        parentId: user?.id || 'parent-id',
        parentName: user?.fullName || 'ولي الأمر',
        studentId: selectedChildId || user?.studentId || 'std-1',
        studentName: selectedChildName || 'الطالب',
        classroom: selectedClassroom || 'A1',
        requestType,
        startDate,
        endDate: endDate || startDate,
        reason: reason.trim(),
        attachmentUrl: attachmentNote.trim(),
      });

      if (onRequestCreated) {
        onRequestCreated();
      }
      onClose();
    } catch (err) {
      console.error('Failed to create parent request:', err);
      setError(err.message || 'تعذر إرسال الطلب، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 text-right my-auto max-h-[90vh] overflow-y-auto" dir="rtl">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-50 via-white to-purple-50/40 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5C2C90] text-white flex items-center justify-center font-bold">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                تقديم طلب أو عذر غياب
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                قسم شؤون الطلاب · مدرسة WE للتكنولوجيا التطبيقية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Registered Student Info */}
          <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">الطالب المعني بالطلب:</span>
            <span className="text-[#5C2C90] font-black">
              {selectedChildName || currentChild.fullName || 'طالب المدرسة'} {selectedClassroom ? `(فصل ${selectedClassroom})` : ''}
            </span>
          </div>

          {/* Request Type */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              نوع الطلب
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'absence_excuse', label: 'عذر غياب 🏥' },
                { id: 'leave_permission', label: 'استئذان خروج مبكر 🚪' },
                { id: 'meeting_request', label: 'طلب مقابلة 🤝' },
                { id: 'inquiry', label: 'استفسار لشؤون الطلاب ❓' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setRequestType(t.id)}
                  className={`p-3 rounded-2xl text-xs font-black text-right border transition-all cursor-pointer ${
                    requestType === t.id
                      ? 'bg-purple-50 border-[#5C2C90] text-[#5C2C90] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                من تاريخ
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                إلى تاريخ
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                required
              />
            </div>
          </div>

          {/* Reason Text */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              تفاصيل الطلب أو العذر
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب سبب الطلب أو تفاصيل العذر بوضوح..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              required
            />
          </div>

          {/* Attachment / Medical cert note */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              ملاحظات المرفقات أو التقارير (اختياري)
            </label>
            <input
              type="text"
              value={attachmentNote}
              onChange={(e) => setAttachmentNote(e.target.value)}
              placeholder="مثال: أُرسل التقرير الطبي أو المستند مع الطالب"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 shadow-md shadow-purple-950/20 disabled:opacity-50 cursor-pointer"
            >
              <Send size={14} />
              <span>{loading ? 'جارٍ الإرسال...' : 'إرسال الطلب'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
