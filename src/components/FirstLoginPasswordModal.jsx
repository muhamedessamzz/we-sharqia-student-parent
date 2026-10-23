import React, { useState } from 'react';
import { api } from '../api/client';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, LogOut, KeyRound } from 'lucide-react';

export default function FirstLoginPasswordModal({ user, onPasswordChanged, onLogout }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 5) {
      setError('كلمة المرور يجب ألا تقل عن 5 أحرف أو أرقام');
      return;
    }

    if (newPassword === 'student123' || newPassword === 'We@2026') {
      setError('لا يمكن استخدام كلمة المرور المبدئية نفسها، اكتب كلمة مرور جديدة');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword(user.id, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onPasswordChanged();
      }, 1200);
    } catch (err) {
      setError(err.message || 'تعذر تحديث كلمة المرور، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-purple-100 overflow-hidden relative text-right my-auto max-h-[90vh] overflow-y-auto">
        {/* Top gradient accent */}
        <div className="h-2 bg-gradient-to-r from-[#5C2C90] via-[#E4007C] to-[#FF6900]"></div>

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center mb-3 shadow-inner border border-purple-100">
              <KeyRound size={28} className="text-[#5C2C90]" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              تعيين كلمة المرور
            </h3>
            <p className="text-xs font-bold text-[#5C2C90] mt-1">
              أهلًا بك {user.fullName} 👋
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              لحماية حسابك، عيّن كلمة مرور جديدة لاستخدامها دائماً بدلاً من كلمة المرور المؤقتة.
            </p>
          </div>

          {success ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-center border border-emerald-200 my-4 space-y-2 fade-in">
              <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
              <p className="text-sm font-extrabold">تم حفظ كلمة المرور بنجاح</p>
              <p className="text-xs text-emerald-700">جارٍ الدخول إلى حسابك...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border border-rose-200 fade-in">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="اكتب كلمة مرور جديدة"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={5}
                    className="w-full bg-[#F8F5FC] border border-purple-100 rounded-xl pr-10 pl-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5C2C90]/30 focus:border-[#5C2C90] focus:bg-white transition-all text-left"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أعد إدخال كلمة المرور للتأكيد"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={5}
                    className="w-full bg-[#F8F5FC] border border-purple-100 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5C2C90]/30 focus:border-[#5C2C90] focus:bg-white transition-all text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 text-[11px] text-purple-900 leading-relaxed">
                💡 <span className="font-bold">نصيحة:</span> اختر كلمة مرور يسهل عليك تذكرها عند تسجيل الدخول من الهاتف أو الكمبيوتر.
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#5C2C90] via-[#7B3FA8] to-[#E4007C] hover:opacity-95 shadow-md shadow-purple-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 size={17} />
                  <span>{loading ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور والمتابعة'}</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2 px-4 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>تسجيل الخروج والعودة لاحقًا</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
