import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Laptop,
  Printer,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Coffee,
  Info,
  UserCheck
} from 'lucide-react';
import { api } from '../api/client';
import fallbackSchedule from '../data/school_schedule.json';

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const ALL_CLASSROOMS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'];

export default function StudentScheduleTab({ user }) {
  const currentClass = user?.classroom || 'A1';
  const [selectedClass, setSelectedClass] = useState(currentClass);
  const [schedules, setSchedules] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [schedData, statsData] = await Promise.allSettled([
          api.getClassSchedule(selectedClass),
          user?.id ? api.getStudentAttendanceStats(user?.id) : Promise.resolve(null)
        ]);

        if (schedData.status === 'fulfilled' && Array.isArray(schedData.value) && schedData.value.length > 0) {
          setSchedules(schedData.value);
        } else {
          // Fallback to local JSON
          const localItems = fallbackSchedule.classes.filter(
            (c) => c.classroom.toUpperCase() === selectedClass.toUpperCase()
          );
          setSchedules(localItems);
        }

        if (statsData.status === 'fulfilled' && statsData.value) {
          setAttendanceStats(statsData.value);
        }
      } catch (err) {
        console.warn('Failed to load schedule or stats, applying fallback:', err);
        const localItems = fallbackSchedule.classes.filter(
          (c) => c.classroom.toUpperCase() === selectedClass.toUpperCase()
        );
        setSchedules(localItems);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedClass, user?.id]);

  const itemsByDay = DAYS_AR.reduce((acc, day) => {
    acc[day] = schedules
      .filter((s) => s.dayOfWeek === day || s.dayName === day)
      .sort((a, b) => a.periodNumber - b.periodNumber);
    return acc;
  }, {});

  const displayedDays = activeDay === 'all' ? DAYS_AR : [activeDay];

  return (
    <div className="space-y-6 fade-in" dir="rtl">
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">نسبة الحضور</span>
            <Sparkles size={16} className="text-[#5C2C90]" />
          </div>
          <div className="text-2xl font-black text-[#5C2C90]">
            {attendanceStats && (attendanceStats.rate !== undefined || attendanceStats.attendanceRate !== undefined)
              ? `${attendanceStats.rate ?? attendanceStats.attendanceRate}%`
              : '98%'}
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">حضور منتظم</p>
        </div>

        <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-bold">أيام الحضور</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-black text-emerald-800">
            {attendanceStats ? `${attendanceStats.present ?? attendanceStats.presentDays ?? 34} يوم` : '34 يوم'}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">ملتزم بالحضور</p>
        </div>

        <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold">الغياب</span>
            <XCircle size={16} />
          </div>
          <div className="text-2xl font-black text-rose-800">
            {attendanceStats ? (attendanceStats.absent ?? attendanceStats.absentDays ?? 0) : 0}
          </div>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">بدون غياب</p>
        </div>

        <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-bold">مواعيد اليوم</span>
            <Clock size={16} />
          </div>
          <div className="text-lg font-black text-amber-800 font-mono">
            8:00 - 3:30
          </div>
          <p className="text-[10px] text-amber-600 font-bold mt-0.5">8 حصص + فسحتين</p>
        </div>
      </div>

      {/* Timetable Header & Day Filters */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5C2C90] to-purple-700 text-white flex items-center justify-center font-bold shadow-md shadow-purple-900/10">
            <Calendar size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                الجدول المدرسي المعتمد — فصل {selectedClass}
              </h3>
              <span className="text-[11px] font-bold text-[#5C2C90] bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                8 حصص يومياً
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">
              مدرسة وي للتكنولوجيا التطبيقية بالشرقية • العام الدراسي 2026 / 2027
            </p>
          </div>
        </div>

        {/* Days Filter & Print */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveDay('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeDay === 'all'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الأسبوع كاملاً
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
            title="طباعة الجدول"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Break Times Reminder Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-amber-50/60 p-4 rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <Coffee size={16} className="text-[#5C2C90]" />
          <span>مواعيد الفسح الرسمية:</span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-purple-200 text-[#5C2C90] font-mono font-black">
            الفسحة الأولى: 10:30 - 11:00 (30 دقيقة)
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 font-mono font-black">
            الفسحة الثانية: 1:30 - 1:50 (20 دقيقة)
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          الانصراف الرسمي: 3:30 عصراً
        </div>
      </div>

      {/* Timetable Items */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs bg-white rounded-3xl border border-slate-200">
          جارٍ تحميل الجدول الدراسي...
        </div>
      ) : schedules.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs bg-white rounded-3xl border border-slate-200">
          لا يوجد جدول متاح حاليًا لهذا الفصل.
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
                    <div>
                      <span className="font-black text-sm text-slate-900">
                        يوم {day}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold mr-2">
                        (8 حصص دراسية)
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#5C2C90] bg-white px-3 py-1 rounded-full border border-purple-200 font-mono">
                    {dayItems.filter((i) => i.isLab || i.isLabSession).length} حصص معملية
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
                            ? 'bg-purple-50/40 border-purple-200/80 hover:shadow-xs'
                            : 'bg-slate-50/70 border-slate-200/70 hover:bg-white'
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

                        <div className="space-y-1.5 text-[10px] font-bold">
                          <div className="flex items-center gap-1 text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                            <MapPin size={11} className="text-[#5C2C90]" />
                            <span>{item.roomName || item.roomOrLab}</span>
                          </div>

                          <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                            <span className="text-slate-700 flex items-center gap-1">
                              <UserCheck size={11} className="text-[#5C2C90]" />
                              <span>{item.teacherName}</span>
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
