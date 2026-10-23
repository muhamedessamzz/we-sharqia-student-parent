import React from 'react';
import { DIGITAL_SKILLS } from '../constants';

export default function SkillsTab({ skills = [], onClaimSkill }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 max-w-3xl">
      <h3 className="text-xl font-black text-[#2A0E47]">بنك المهارات الرقمية (التقييم الأكاديمي الذاتي)</h3>
      <p className="text-sm text-slate-600">
        حدد المهارات التقنية التي أتقنتها ليقوم عضو هيئة التدريس باعتمادها وتوثيقها في سجلك:
      </p>

      <div className="space-y-2.5 pt-2">
        {DIGITAL_SKILLS.map((sk) => {
          const claimed = skills.some((s) => s.skillKey === sk.k && s.claimedByStudent);
          const confirmed = skills.some((s) => s.skillKey === sk.k && s.confirmedByTeacher);
          return (
            <div
              key={sk.k}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70"
            >
              <span className="font-bold text-sm text-slate-800">{sk.t}</span>
              <div className="flex items-center gap-2">
                {confirmed && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
                    ✓ معتمد من المعلم
                  </span>
                )}
                <button
                  onClick={() => onClaimSkill(sk.k, !claimed)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    claimed
                      ? 'bg-[#5C2C90] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {claimed ? 'معتمدة ومتقنة ✓' : 'قيد التدريب والتطوير'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
