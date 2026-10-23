import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Laptop,
  Printer,
  Sparkles,
  Coffee,
  UserCheck,
  ShieldCheck,
  Info
} from 'lucide-react';
import { api } from '../../../../api/client';
import fallbackSchedule from '../../../../data/school_schedule.json';

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export default function ScheduleTab({ activeStudent }) {
  const classroom = activeStudent?.classroom || 'A1';
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('all');

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      try {
        const data = await api.getClassSchedule(classroom);
        if (Array.isArray(data) && data.length > 0) {
          setSchedules(data);
        } else {
          // Fallback to local JSON
          const localItems = fallbackSchedule.classes.filter(
            (c) => c.classroom.toUpperCase() === classroom.toUpperCase()
          );
          setSchedules(localItems);
        }
      } catch (err) {
        console.warn('Parent schedule error, using local fallback:', err);
        const localItems = fallbackSchedule.classes.filter(
          (c) => c.classroom.toUpperCase() === classroom.toUpperCase()
        );
        setSchedules(localItems);
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, [classroom]);

  const itemsByDay = DAYS_AR.reduce((acc, day) => {
    acc[day] = schedules
      .filter((s) => s.dayOfWeek === day || s.dayName === day)
      .sort((a, b) => a.periodNumber - b.periodNumber);
    return acc;
  }, {});

  const displayedDays = activeDay === 'all' ? DAYS_AR : [activeDay];

  return (
    <div className="space-y-6 fade-in" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#5C2C90] via-[#461975] to-[#2B0E49] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
                <Sparkles size={13} />
                الجدول المدرسي الرسمي المعتمد
              </span>
              <span className="text-purple-200 text-xs font-bold bg-white/10 px-3 py-1 rounded-full">
                العام الدراسي 2026 / 2027
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              جدول الحصص الأسبوعي — فصل {classroom} ({activeStudent?.fullName || 'الطالب'})
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 font-bold max-w-xl">
              يمكن لولي الأمر متابعة المواد الدراسية اليومية لابنه، المعلمين والمهندسين المسند إليهم التدريس، ومواعيد المعامل والفسح والانصراف.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center self-start md:self-auto">
            <Clock size={20} className="text-amber-300" />
            <div className="text-right">
              <div className="text-xs font-black text-amber-300">مواعيد اليوم الدراسي</div>
              <div className="text-[11px] text-purple-200 font-mono font-bold">8:00 ص — 3:30 م (8 حصص)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Break Times & Navigation */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Break times notification */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
          <Coffee size={16} className="text-[#5C2C90]" />
          <span>مواعيد الفسح:</span>
          <span className="bg-purple-50 text-[#5C2C90] border border-purple-200 px-2.5 py-0.5 rounded-lg font-mono">
            الفسحة 1: 10:30 - 11:00
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono">
            الفسحة 2: 1:30 - 1:50
          </span>
        </div>

        {/* Day Filter & Print */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveDay('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeDay === 'all'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            كل الأيام
          </button>
          {DAYS_AR.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeDay === day
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            title="طباعة كشف الجدول"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Timetable Items */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs bg-white rounded-3xl border border-slate-200">
          جارٍ تحميل الجدول...
        </div>
      ) : schedules.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs bg-white rounded-3xl border border-slate-200">
          لا يوجد جدول متاح حالياً.
        </div>
      ) : (
        <div className="space-y-4">
          {displayedDays.map((day) => {
            const dayItems = itemsByDay[day] || [];
            return (
              <div
                key={day}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Day Header */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-purple-50 via-slate-50 to-white border-b border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#5C2C90] text-white flex items-center justify-center font-black text-xs">
                      {day[0]}
                    </span>
                    <span className="font-black text-sm text-slate-900">
                      يوم {day} ({dayItems.length} حصص)
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#5C2C90] bg-white px-3 py-1 rounded-full border border-purple-200 font-mono">
                    {dayItems.filter((i) => i.isLab || i.isLabSession).length} حصص معملية وتطبيقية
                  </span>
                </div>

                {/* Grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {dayItems.map((item) => {
                    const isLab = item.isLab || item.isLabSession;
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isLab
                            ? 'bg-purple-50/40 border-purple-200/80'
                            : 'bg-slate-50/70 border-slate-200/70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono">
                            الحصة {item.periodNumber} ({item.periodName || 'أساسي'})
                          </span>

                          <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1">
                            <Clock size={11} className="text-[#5C2C90]" />
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>

                        <h5 className="text-xs font-black text-slate-900 leading-snug mb-2">
                          {item.subjectName || item.subject}
                        </h5>

                        <div className="space-y-1 text-[10px] font-bold">
                          <div className="flex items-center gap-1 text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            <MapPin size={10} className="text-[#5C2C90]" />
                            <span>{item.roomName || item.roomOrLab}</span>
                          </div>

                          <div className="flex items-center justify-between bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            <span className="text-slate-700 flex items-center gap-1">
                              <UserCheck size={10} className="text-[#5C2C90]" />
                              <span>المعلم: {item.teacherName}</span>
                            </span>

                            {isLab && (
                              <span className="text-rose-700 bg-rose-50 border border-rose-200 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                <Laptop size={9} />
                                معمل
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
