import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, Check } from 'lucide-react';
import { api } from '../api/client';

export default function NotificationBell({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [acknowledgingId, setAcknowledgingId] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const data = await api.getMyNotifications(user.id, user.role || 'student');
      setNotifications(data?.notifications || data?.Notifications || []);
      setUnreadCount(data?.unreadCount ?? data?.UnreadCount ?? 0);
    } catch (err) {
      console.warn('Failed to fetch notifications in portal:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [user?.id, user?.role]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenDropdown = async () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notification) => {
    if (notification.isRead) return;
    try {
      await api.markNotificationRead(notification.id, user.id, user.fullName, user.role || 'student');
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcknowledge = async (e, notificationId) => {
    e.stopPropagation();
    setAcknowledgingId(notificationId);
    try {
      await api.acknowledgeNotification(notificationId, user.id, user.fullName, user.role || 'student');
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true, isAcknowledged: true, acknowledgedAtUtc: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    } finally {
      setAcknowledgingId(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpenDropdown}
        className={`relative p-2 rounded-2xl transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-950/20'
            : 'bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200/70'
        }`}
        title="التعاميم المدرسية والإشعارات الإدارية"
      >
        <Bell size={18} className={unreadCount > 0 ? 'animate-bounce' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-80 sm:w-96 max-h-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 flex flex-col overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-50 via-white to-purple-50/50 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
                <Bell size={15} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">التعاميم والتنبيهات المدرسية</h4>
                <p className="text-[10px] text-slate-500 font-bold">من إدارة مدرسة WE للتكنولوجيا التطبيقية</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                {unreadCount} جديد
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-2 space-y-1.5 max-h-[380px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-xs font-bold text-slate-600">لا توجد إعلانات أو تعاميم جديدة حالياً</p>
                <p className="text-[11px] text-slate-400 mt-0.5">ستصلك هنا كافة التوجيهات الرسمية والإشعارات الهامة</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isUrgent = n.priority === 'urgent' || n.priority === 'administrative';
                return (
                  <div
                    key={n.id}
                    onClick={() => handleMarkAsRead(n)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer ${
                      !n.isRead
                        ? isUrgent
                          ? 'bg-rose-50/60 border border-rose-200/80 shadow-2xs'
                          : 'bg-purple-50/60 border border-purple-200/70 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    {/* Top Row: Priority & Date */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {isUrgent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white">
                            <AlertTriangle size={10} />
                            {n.priority === 'administrative' ? 'توجيه مدرسي هام' : 'عاجل'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            <Info size={10} />
                            إعلان مدرسي
                          </span>
                        )}
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(n.createdAtUtc).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="text-xs font-black text-slate-900 leading-snug mb-1">
                      {n.title}
                    </h5>

                    {/* Content */}
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {n.content}
                    </p>

                    {/* Sender & Action */}
                    <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-[#5C2C90]">
                        المرسل: {n.senderName}
                      </span>

                      {/* Acknowledgment Action */}
                      {n.requiresAcknowledgment && (
                        <div>
                          {n.isAcknowledged ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <Check size={11} />
                              تم تأكيد الاستلام
                            </span>
                          ) : (
                            <button
                              onClick={(e) => handleAcknowledge(e, n.id)}
                              disabled={acknowledgingId === n.id}
                              className="inline-flex items-center gap-1 text-[10px] font-black text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 px-2.5 py-1 rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                              <Check size={11} />
                              {acknowledgingId === n.id ? 'جارٍ التأكيد...' : 'تأكيد العلم'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
