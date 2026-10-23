import React from 'react';
import { Printer, X, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PrintableCertificate({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 my-auto max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Modal Top Bar - Hidden on print */}
        <div className="p-4 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <span className="text-xs font-black text-slate-800">
              شهادة تقدير وتفوق (جاهزة للطباعة)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-amber-500 via-[#E4007C] to-[#5C2C90] px-4 py-2 rounded-xl shadow-xs hover:opacity-95 cursor-pointer"
            >
              <Printer size={15} />
              <span>طباعة الشهادة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white text-slate-400 hover:text-slate-700 border border-slate-200 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate Sheet (Luxury Gold & Deep Purple Ornate Layout) */}
        <div
          className="p-8 sm:p-14 text-[#26163A] bg-gradient-to-b from-amber-50/20 via-white to-purple-50/20 relative print:p-8"
          dir="rtl"
          id="official-certificate"
        >
          {/* Double Gold / Purple Border */}
          <div className="border-4 border-[#D4AF37] p-2 rounded-3xl shadow-sm">
            <div className="border-2 border-[#5C2C90] rounded-2xl p-6 sm:p-10 relative">
              {/* Corner Ornaments */}
              <div className="absolute top-3 right-3 text-[#D4AF37] font-serif text-2xl font-bold">❖</div>
              <div className="absolute top-3 left-3 text-[#D4AF37] font-serif text-2xl font-bold">❖</div>
              <div className="absolute bottom-3 right-3 text-[#D4AF37] font-serif text-2xl font-bold">❖</div>
              <div className="absolute bottom-3 left-3 text-[#D4AF37] font-serif text-2xl font-bold">❖</div>

              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-4 mb-6">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-600">جمهورية مصر العربية</p>
                  <p className="text-[11px] font-bold text-slate-600">وزارة التربية والتعليم والتعليم الفني</p>
                  <p className="text-xs font-black text-[#5C2C90]">مدارس WE للتكنولوجيا التطبيقية</p>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src="/Purple Code and Signal Crest.png"
                    alt="شعار مدارس WE"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-xs"
                  />
                  <span className="text-[9px] font-black text-[#D4AF37] tracking-widest mt-1">
                    EXCELLENCE AWARD
                  </span>
                </div>

                <div className="text-left font-mono text-[10px] text-slate-400">
                  <p className="font-bold text-slate-600">Telecom Egypt</p>
                  <p>WE Applied Tech</p>
                  <p>Sharqia Campus</p>
                </div>
              </div>

              {/* Certificate Main Title */}
              <div className="text-center my-6 space-y-2">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 text-[#B8860B] px-6 py-1.5 rounded-full border border-amber-300 shadow-2xs">
                  <Sparkles size={16} />
                  <span className="text-xs font-black tracking-wide">لوحة الشرف والتميز</span>
                  <Sparkles size={16} />
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5C2C90] tracking-tight pt-2">
                  شهادة تقدير وتفوق
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-bold">
                  Certificate of Academic & Technical Excellence
                </p>
              </div>

              {/* Tribute Text */}
              <div className="text-center my-8 max-w-2xl mx-auto space-y-4 leading-relaxed">
                <p className="text-sm sm:text-base text-slate-700">
                  تمنح إدارة مدرسة WE للتكنولوجيا التطبيقية بالشرقية هذه الشهادة للطالب:
                </p>

                <div className="py-2 px-6 bg-purple-50/70 border-b-2 border-t-2 border-[#5C2C90] inline-block rounded-xl">
                  <span className="text-xl sm:text-2xl font-black text-[#5C2C90]">
                    {student.fullName}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  المقيد بالصف الدراسي <span className="font-bold text-[#5C2C90] font-mono">({student.classroom || 'A1'})</span> بكود طالب <span className="font-bold text-slate-800 font-mono">({student.studentCode || student.username || 'WE-2026-089'})</span>
                </p>

                <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed px-4">
                  تقديراً لتفوقه الدراسي وانضباطه المتميز خلال العام الدراسي 2026/2027.
                </p>
              </div>

              {/* Bottom Gold Stamp & Signatures */}
              <div className="mt-12 pt-6 border-t border-amber-200/80 grid grid-cols-3 gap-6 items-center text-center">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-8">وكيل المدرسة للشؤون الأكاديمية</p>
                  <p className="text-xs font-black text-slate-800 underline decoration-dotted">أ / محمد عاطف المنشاوي</p>
                </div>

                {/* Golden Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-slate-900 flex flex-col items-center justify-center shadow-lg p-2 border-2 border-white">
                    <Award size={26} className="text-[#5C2C90]" />
                    <span className="text-[9px] font-black tracking-tight mt-0.5">معتمد</span>
                    <span className="text-[7px] font-mono font-bold">WE ACADEMY</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 mb-8">مدير المدرسة</p>
                  <p className="text-xs font-black text-slate-800 underline decoration-dotted">م / أحمد مصطفى عبد السلام</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
