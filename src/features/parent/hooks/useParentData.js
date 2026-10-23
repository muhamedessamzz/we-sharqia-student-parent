import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useParentData(userId) {
  const [children, setChildren] = useState([]);
  const [parentRequests, setParentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadParentData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [dashData, reqsData] = await Promise.allSettled([
        api.getParentDashboard(userId),
        api.getParentRequests(userId)
      ]);

      if (dashData.status === 'fulfilled' && Array.isArray(dashData.value)) {
        const rawChildren = dashData.value;
        // Fetch attendance stats for each child in parallel
        const enriched = await Promise.all(
          rawChildren.map(async (c) => {
            try {
              const stats = await api.getStudentAttendanceStats(c.id);
              return { ...c, attendance: stats };
            } catch (err) {
              return { ...c, attendance: null };
            }
          })
        );
        setChildren(enriched);
      } else {
        setChildren([]);
      }

      if (reqsData.status === 'fulfilled' && Array.isArray(reqsData.value)) {
        setParentRequests(reqsData.value);
      }
    } catch (e) {
      console.error('Failed to load parent data:', e);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadParentData();
  }, [loadParentData]);

  const handleShareWhatsapp = (child) => {
    const attStr = child.attendance?.rate !== undefined
      ? `\n- نسبة الحضور والانضباط: ${child.attendance.rate}% (${child.attendance.present} يوم حضور)`
      : '';
    const text = `تقرير مدرسة WE للتكنولوجيا التطبيقية للطالب: ${child.fullName}\n- النجوم المحققة: ⭐ ${child.totalStars}\n- التكليفات المكتملة: ${child.totalCompleted}\n- الفيديوهات التعليمية التي شاهدها: ${child.totalWatchedVideos}${attStr}\nمنصة جاهز · استعد · سلّم (المصرية للاتصالات) 💜`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return {
    children,
    parentRequests,
    loading,
    loadParentData,
    handleShareWhatsapp
  };
}
