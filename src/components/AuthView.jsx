import React, { useState } from 'react';
import { api } from '../api/client';
import { 
  LogIn, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  IdCard, 
  Sparkles, 
  GraduationCap, 
  Users,
  Info
} from 'lucide-react';

export default function AuthView({ onLoginSuccess }) {
  const [portalRole, setPortalRole] = useState('student'); // 'student' | 'parent'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Normalize Eastern Arabic numerals (٠-٩) and trim spaces
  const normalizeDigits = (val) => {
    if (!val) return '';
    return val.replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
  };

  const handleUsernameChange = (e) => {
    setUsername(normalizeDigits(e.target.value).trim());
  };

  const handlePasswordChange = (e) => {
    // Strip spaces/dashes and convert Arabic numerals
    const cleaned = normalizeDigits(e.target.value).replace(/[\s-]/g, '');
    setPassword(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError(portalRole === 'parent' ? 'أدخل كود الطالب الخاص بابنك/ابنتك' : 'أدخل كود الطالب أو اسم المستخدم');
      return;
    }

    if (!cleanPass) {
      setError('أدخل الرقم القومي للطالب المكون من 14 رقمًا');
      return;
    }

    setLoading(true);

    try {
      const res = await api.login(cleanUser, cleanPass, portalRole);
      onLoginSuccess(res);
    } catch (err) {
      setError(
        err.message || 
        (portalRole === 'parent'
          ? 'كود الطالب أو الرقم القومي غير صحيح. تأكد من إدخال بيانات ابنك/ابنتك بدقة وحاول مجددًا.'
          : 'كود الطالب أو الرقم القومي غير صحيح. تأكد من البيانات وحاول مرة أخرى.')
      );
    } finally {
      setLoading(false);
    }
  };

  const isDigitsOnly = /^\d+$/.test(password);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-purple-950/5 border border-purple-100/90 relative overflow-hidden">
        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#5C2C90] via-[#E4007C] to-[#FF6900]"></div>

        {/* Brand Header */}
        <div className="text-center mb-4 pt-1">
          <img
            src="/Purple Code and Signal Crest.png"
            alt="شعار مدارس WE للتكنولوجيا التطبيقية"
            className="w-13 h-13 object-contain mx-auto mb-2 drop-shadow-xs"
          />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">مدارس WE للتكنولوجيا التطبيقية</h2>
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-[#5C2C90] text-[11px] font-extrabold px-3 py-0.5 rounded-full border border-purple-200/80 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5C2C90]"></span>
            <span>بوابة الطلاب وأولياء الأمور</span>
          </div>
        </div>

        {/* 2-Role Tab Switcher: Student vs Guardian */}
        <div className="grid grid-cols-2 p-1 bg-[#F5F0FC] rounded-2xl mb-4 border border-purple-100/80 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setPortalRole('student');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              portalRole === 'student'
                ? 'bg-gradient-to-r from-[#5C2C90] to-[#7B3FA8] text-white shadow-sm shadow-purple-900/20'
                : 'text-slate-600 hover:text-[#5C2C90] hover:bg-white/70'
            }`}
          >
            <GraduationCap size={16} />
            <span>حساب الطالب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortalRole('parent');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              portalRole === 'parent'
                ? 'bg-gradient-to-r from-[#5C2C90] via-[#7B3FA8] to-[#E4007C] text-white shadow-sm shadow-purple-900/20'
                : 'text-slate-600 hover:text-[#5C2C90] hover:bg-white/70'
            }`}
          >
            <Users size={16} />
            <span>بوابة ولي الأمر</span>
          </button>
        </div>

        {/* Role Explanatory Helper Notice */}
        <div className={`p-2.5 rounded-xl text-xs font-bold mb-4 flex items-start gap-2 border transition-all text-right ${
          portalRole === 'parent'
            ? 'bg-purple-50/70 border-purple-200/80 text-[#5C2C90]'
            : 'bg-slate-50 border-slate-200/70 text-slate-600'
        }`}>
          <Info size={15} className="shrink-0 mt-0.5 text-[#5C2C90]" />
          <p className="text-[11px] leading-relaxed">
            {portalRole === 'parent'
              ? 'تسجيل دخول ولي الأمر مرتبط بحساب الطالب مباشرة؛ أدخل كود الطالب والرقم القومي لابنك/ابنتك للدخول الفوري ومتابعة درجاته وسلوكه.'
              : 'تسجيل دخول الطالب للدخول إلى الفصول الافتراضية، التدريب العملي، وتسليم التكليفات.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2 border border-rose-200 fade-in text-right">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          {/* Student Code / Username */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black text-slate-700">
                {portalRole === 'parent' ? 'كود الطالب (الابن / الابنة) *' : 'كود الطالب *'}
              </label>
              <span className="text-[10px] text-purple-600 font-extrabold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                اسم المستخدم
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#5C2C90]">
                <IdCard size={18} />
              </div>
              <input
                type="text"
                placeholder={portalRole === 'parent' ? 'أدخل كود الطالب الخاص بابنك (مثال: 30326001)' : 'أدخل كود الطالب (مثال: 30326001)'}
                value={username}
                onChange={handleUsernameChange}
                required
                className="w-full bg-[#F8F5FC] border border-purple-100 rounded-xl pr-10 pl-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5C2C90]/30 focus:border-[#5C2C90] focus:bg-white transition-all text-left font-mono"
                dir="ltr"
                autoComplete="username"
              />
            </div>
          </div>

          {/* National ID / Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black text-slate-700">
                {portalRole === 'parent' ? 'الرقم القومي للطالب (الابن / الابنة) *' : 'الرقم القومي للطالب *'}
              </label>
              {password.length > 0 && isDigitsOnly ? (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  password.length === 14 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {password.length} / 14 رقمًا
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">14 رقمًا (كلمة المرور)</span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#5C2C90]">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="الـ 14 رقمًا من بطاقة الرقم القومي أو شهادة الميلاد"
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full bg-[#F8F5FC] border border-purple-100 rounded-xl pr-10 pl-10 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5C2C90]/30 focus:border-[#5C2C90] focus:bg-white transition-all text-left font-mono"
                dir="ltr"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                tabIndex={-1}
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#5C2C90] via-[#7B3FA8] to-[#E4007C] hover:opacity-95 shadow-md shadow-purple-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogIn size={17} />
            <span>
              {loading 
                ? 'جارٍ التحقق وتأكيد الدخول...' 
                : (portalRole === 'parent' ? 'دخول بوابة ولي الأمر 👨‍👩‍👧‍👦' : 'تسجيل الدخول كطالب 🎓')}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
