import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../../api/client';

export function useStudentData(user) {
  const [assignments, setAssignments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [skills, setSkills] = useState([]);
  const [videos, setVideos] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [asgList, progList, skillList, vidList, annList] = await Promise.allSettled([
        api.getAssignments(true, user.classroom),
        api.getStudentProgress(user.id),
        api.getSkills(user.id),
        api.getVideos(user.id),
        api.getAnnouncements(user.classroom),
      ]);

      if (asgList.status === 'fulfilled' && Array.isArray(asgList.value)) {
        setAssignments(asgList.value);
      }
      if (progList.status === 'fulfilled' && Array.isArray(progList.value)) {
        const map = {};
        progList.value.forEach((p) => { map[p.assignmentId] = p; });
        setProgressMap(map);
      }
      if (skillList.status === 'fulfilled' && Array.isArray(skillList.value)) {
        setSkills(skillList.value);
      }
      if (vidList.status === 'fulfilled' && Array.isArray(vidList.value)) {
        setVideos(vidList.value);
      }
      if (annList.status === 'fulfilled' && Array.isArray(annList.value)) {
        setAnnouncements(annList.value);
      }
    } catch (e) {
      console.error('Student data load error:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const claimSkill = async (skillKey, claimed) => {
    try {
      await api.claimSkill(user.id, skillKey, claimed);
      await loadData();
    } catch (e) {
      console.error('Failed to claim skill:', e);
    }
  };

  const totalStars = useMemo(() => {
    return Object.values(progressMap).reduce((acc, p) => acc + (p.stars || 0), 0) || 0;
  }, [progressMap]);

  const doneCount = useMemo(() => {
    return Object.values(progressMap).filter((p) => p.status === 4 || p.status === 'done').length;
  }, [progressMap]);

  const gradedCount = useMemo(() => {
    return Object.values(progressMap).filter((p) => p.isGraded).length;
  }, [progressMap]);

  return {
    assignments,
    progressMap,
    setProgressMap,
    skills,
    videos,
    announcements,
    loading,
    totalStars,
    doneCount,
    gradedCount,
    loadData,
    claimSkill
  };
}
