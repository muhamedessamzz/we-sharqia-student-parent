import React from 'react';
import { AlertCircle, Clock, Bell } from 'lucide-react';

export default function AnnouncementsBanner({ announcements = [] }) {
  if (announcements.length === 0) return null;

  return (
    <div className="space-y-2">
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className={`rounded-2xl p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
            ann.importance === 'urgent'
              ? 'bg-rose-50/90 border-rose-200 text-rose-900'
              : ann.importance === 'quiz'
              ? 'bg-purple-50/90 border-purple-200 text-purple-950'
              : 'bg-sky-50/90 border-sky-200 text-sky-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
              {ann.importance === 'urgent' ? (
                <AlertCircle className="text-rose-600" size={18} />
              ) : ann.importance === 'quiz' ? (
                <Clock className="text-[#5C2C90]" size={18} />
              ) : (
                <Bell className="text-sky-600" size={18} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-black text-sm">{ann.title}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    ann.importance === 'urgent'
                      ? 'bg-rose-200 text-rose-800'
                      : ann.importance === 'quiz'
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-sky-200 text-sky-800'
                  }`}
                >
                  {ann.importance === 'urgent' ? 'عاجل' : ann.importance === 'quiz' ? 'اختبار' : 'تنبيه'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  المعلم: {ann.teacherName} {ann.classroom ? `• فصل ${ann.classroom}` : ''}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{ann.content}</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0 self-end sm:self-center">
            {new Date(ann.createdAtUtc).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}
    </div>
  );
}
