import React from 'react';
import {
  Activity,
  Trophy,
  Award,
  Zap,
  Timer,
  HeartPulse,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function FitnessTab({ child }) {
  const sports = child?.sportsFitness || child?.SportsFitness;

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* 1. Header Hero */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-800 flex items-center justify-center font-bold shrink-0 border border-cyan-200/70">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              اللياقة البدنية وطابور الصباح والأنشطة الرياضية
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              القياسات البدنية الدورية، التزام طابور الصباح، وملاحظات كابتن التربية الرياضية.
            </p>
          </div>
        </div>
      </div>

      {!sports ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/90 shadow-xs space-y-2">
          <Activity size={36} className="mx-auto text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">لم يتم رصد تقييم اللياقة البدنية بعد</h4>
          <p className="text-xs text-slate-400">
            سيتم نشر نتائج الاختبارات البدنية من قبل كابتن التربية الرياضية فور انتهاء القياسات الدورية.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 2. Fitness Score & Morning Queue Master Card */}
          <div className="bg-gradient-to-br from-white via-cyan-50/30 to-purple-50/20 rounded-3xl p-6 border border-cyan-100 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">
                  مستوى اللياقة البدنية العام المعتمد
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-cyan-800 font-mono">
                    {sports.fitnessScore}%
                  </span>
                  <span className="text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
                    لائق بدنياً بدرجة ممتاز ✓
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs text-right min-w-[200px]">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                  <CalendarCheck size={14} className="text-[#5C2C90]" />
                  <span>انضباط طابور الصباح:</span>
                </div>
                <div className="font-black text-slate-900 text-sm">
                  {sports.morningAssemblyStatus || 'ملتزم ومنضبط دائماً'}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                  مشارك في التمارين والإحماء الصباحي
                </span>
              </div>
            </div>

            {/* 3 Physical Tests Metric Breakdown */}
            <div>
              <h4 className="text-xs font-black text-slate-700 mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#FF6900]" />
                <span>القياسات البدنية المعتمدة لمدارس WE:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Metric 1: Speed */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold">
                      <Zap size={16} />
                    </span>
                    <span className="text-base font-black text-[#5C2C90] font-mono">
                      {sports.speedScore} / 10
                    </span>
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-slate-900">السرعة والرشاقة الحركية</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">اختبار العدو السريع لمسافة 50 متر</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#5C2C90] h-1.5 rounded-full"
                      style={{ width: `${(sports.speedScore / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: Endurance */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <HeartPulse size={16} />
                    </span>
                    <span className="text-base font-black text-emerald-600 font-mono">
                      {sports.enduranceScore} / 10
                    </span>
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-slate-900">قوة التحمل الدوري التنفسي</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">اختبار الجري والتحمل لمسافة 800 متر</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${(sports.enduranceScore / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3: Flexibility */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                      <Timer size={16} />
                    </span>
                    <span className="text-base font-black text-amber-700 font-mono">
                      {sports.flexibilityScore} / 10
                    </span>
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-slate-900">المرونة والتوافق العضلي</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">اختبار مرونة الجذع والمد الأمامي</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${(sports.flexibilityScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Coach Report Card */}
          {sports.coachNotes && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      تقرير وتوجيهات كابتن التربية الرياضية
                    </h4>
                    <span className="text-[11px] text-slate-400 font-bold block">
                      {sports.recordedByCoachName || 'كابتن حسام حسن (معلم التربية الرياضية)'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  تقرير رسمي معتمد
                </span>
              </div>

              <div className="bg-purple-50/70 border border-purple-100/80 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed">
                "{sports.coachNotes}"
              </div>
            </div>
          )}

          {/* 4. Health Guidance Banner */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl text-xs text-slate-600 leading-relaxed">
            <span className="font-black text-slate-800 block mb-1">
              💡 إرشادات الصحة الرياضية لولي الأمر:
            </span>
            اللياقة البدنية تمثل ركيزة أساسية لطلاب التكنولوجيا التطبيقية؛ فالنشاط الرياضي الصباحي يعزز التركيز والقدرة الذهنية داخل المعامل والورش العملية، ويحافظ على صحة العمود الفقري أثناء استخدام الحاسب الآلي.
          </div>
        </div>
      )}
    </div>
  );
}
