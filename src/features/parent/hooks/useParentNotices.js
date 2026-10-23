import { useState, useEffect, useMemo } from 'react';
import { api } from '../../../api/client';

export function useParentNotices(children = [], onNoticeUpdated) {
  const [activeTabFilter, setActiveTabFilter] = useState('all');

  // Derive all disciplinary and behavioral notices directly from children's backend records
  const backendNotices = useMemo(() => {
    const list = [];
    if (!Array.isArray(children)) return list;
    children.forEach((c) => {
      if (Array.isArray(c.disciplineNotices)) {
        c.disciplineNotices.forEach((n) => {
          list.push({
            id: n.id,
            studentName: c.fullName || n.studentName,
            category: n.category || 'disruption',
            title: n.title,
            message: n.details || n.title,
            actionTaken: n.actionTaken,
            severity: n.severity || 'warning',
            issuedBy: n.issuedBy || 'الأخصائي الاجتماعي',
            date: n.incidentDate ? n.incidentDate.split('T')[0] : '',
            timestamp: n.incidentDate
              ? new Date(n.incidentDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
              : '',
            acknowledged: n.isAcknowledgedByParent || n.status === 'acknowledged',
            acknowledgedAt: n.acknowledgedAtUtc,
            parentNotes: n.parentNotes,
          });
        });
      }
    });
    return list;
  }, [children]);

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    setNotices(backendNotices);
  }, [backendNotices]);

  const handleAcknowledgeNotice = async (noticeId, notes = '') => {
    try {
      await api.acknowledgeNotice(noticeId, notes);
      setNotices((prev) =>
        prev.map((n) => (n.id === noticeId ? { ...n, acknowledged: true, parentNotes: notes } : n))
      );
      if (onNoticeUpdated) onNoticeUpdated();
      return { success: true };
    } catch (e) {
      console.warn('API acknowledge error, updating locally:', e);
      setNotices((prev) =>
        prev.map((n) => (n.id === noticeId ? { ...n, acknowledged: true, parentNotes: notes } : n))
      );
      return { success: true };
    }
  };

  const handleContactCounselor = (notice) => {
    const replyText = `السلام عليكم ورحمة الله،\nبخصوص الإشعار الوارد من مدرسة WE للتكنولوجيا التطبيقية بشأن الطالب (${notice.studentName}) بعنوان: "${notice.title || notice.message}"، أود الإفادة بأنه تم الاطلاع وسأقوم بالمتابعة والتواصل مع المدرسة.\nشاكرين حرصكم ومجهوداتكم 💜.`;
    window.open(`https://wa.me/201012345678?text=${encodeURIComponent(replyText)}`, '_blank');
  };

  const childNames = useMemo(() => children.map((c) => c.fullName || ''), [children]);

  const relevantNotices = useMemo(() => {
    return notices.filter((n) => {
      if (childNames.length === 0) return true;
      return childNames.some((name) => name && n.studentName && (name.includes(n.studentName) || n.studentName.includes(name)));
    });
  }, [notices, childNames]);

  const activeNoticesPool = relevantNotices.length > 0 ? relevantNotices : notices;

  const displayNotices = useMemo(() => {
    return activeNoticesPool.filter((n) => {
      if (activeTabFilter === 'pending') return !n.acknowledged;
      if (activeTabFilter === 'resolved') return n.acknowledged;
      return true;
    });
  }, [activeNoticesPool, activeTabFilter]);

  const pendingCount = useMemo(() => {
    return activeNoticesPool.filter((n) => !n.acknowledged).length;
  }, [activeNoticesPool]);

  return {
    notices,
    activeTabFilter,
    setActiveTabFilter,
    relevantNotices,
    displayNotices,
    pendingCount,
    handleAcknowledgeNotice,
    handleContactCounselor
  };
}
