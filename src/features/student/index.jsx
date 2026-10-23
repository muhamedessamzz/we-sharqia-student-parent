import React, { useState, useEffect } from 'react';
import { useStudentData } from './hooks/useStudentData';
import { useQuizPlayer } from './hooks/useQuizPlayer';
import StudentHeader from './components/StudentHeader';
import AnnouncementsBanner from './components/AnnouncementsBanner';
import StudentNavigationTabs from './components/StudentNavigationTabs';
import ActiveQuizView from './components/ActiveQuizView';
import AssignmentsHomeTab from './tabs/AssignmentsHomeTab';
import VideosTab from './tabs/VideosTab';
import SkillsTab from './tabs/SkillsTab';
import StudentScheduleTab from '../../components/StudentScheduleTab';
import PrintableReportCard from '../../components/modals/PrintableReportCard';
import PrintableCertificate from '../../components/modals/PrintableCertificate';

export default function StudentView({ user }) {
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash.startsWith('quiz')) return 'home';
    return ['home', 'videos', 'schedule', 'skills'].includes(hash) ? hash : 'home';
  };

  const [tab, setTab] = useState(() => getTabFromHash());
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const {
    assignments,
    progressMap,
    setProgressMap,
    skills,
    videos,
    announcements,
    totalStars,
    doneCount,
    gradedCount,
    claimSkill
  } = useStudentData(user);

  const {
    activeAssignment,
    activeProgress,
    currentAnswers,
    setCurrentAnswers,
    helpRequested,
    startOrResumeAssignment,
    handleSpeak,
    handleRequestHelp,
    handleFinishStage,
    closeQuiz
  } = useQuizPlayer();

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash.startsWith('quiz')) {
        closeQuiz();
      }
      const targetTab = event?.state?.tab || hash;
      if (['home', 'videos', 'schedule', 'skills'].includes(targetTab)) {
        setTab(targetTab);
      } else {
        setTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    if (!window.location.hash) {
      window.history.replaceState({ tab: 'home' }, '', '#home');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [closeQuiz]);

  const handleStartAssignment = (asg) => {
    window.history.pushState({ tab: 'quiz', quizId: asg.id }, '', `#quiz-${asg.id}`);
    startOrResumeAssignment(asg, user.id, setProgressMap);
  };

  const handleCloseQuiz = () => {
    closeQuiz();
    if (window.location.hash.startsWith('#quiz')) {
      window.history.back();
    }
  };

  const handleFinishCurrentStage = () => {
    handleFinishStage(setProgressMap);
  };

  const handleTabChange = (newTab) => {
    if (newTab === tab && window.location.hash === `#${newTab}`) return;
    window.history.pushState({ tab: newTab }, '', `#${newTab}`);
    setTab(newTab);
    closeQuiz();
  };

  return (
    <div className="fade-in space-y-6">
      {/* Student Header */}
      <StudentHeader
        user={user}
        totalStars={totalStars}
        gradedCount={gradedCount}
        onOpenReportCard={() => setIsReportCardOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Classroom Announcements Banner */}
      <AnnouncementsBanner announcements={announcements} />

      {/* Segmented Navigation Tabs */}
      <StudentNavigationTabs
        tab={tab}
        setTab={handleTabChange}
        assignmentsCount={assignments.length}
        videosCount={videos.length}
      />

      {/* Active Assignment Solver or Selected Tab */}
      {activeAssignment ? (
        <ActiveQuizView
          activeAssignment={activeAssignment}
          activeProgress={activeProgress}
          currentAnswers={currentAnswers}
          setCurrentAnswers={setCurrentAnswers}
          helpRequested={helpRequested}
          onClose={handleCloseQuiz}
          onSpeak={handleSpeak}
          onRequestHelp={handleRequestHelp}
          onFinishStage={handleFinishCurrentStage}
        />
      ) : tab === 'home' ? (
        <AssignmentsHomeTab
          assignments={assignments}
          progressMap={progressMap}
          doneCount={doneCount}
          gradedCount={gradedCount}
          onStartAssignment={handleStartAssignment}
        />
      ) : tab === 'videos' ? (
        <VideosTab
          videos={videos}
          onSpeak={handleSpeak}
        />
      ) : tab === 'schedule' ? (
        <StudentScheduleTab user={user} />
      ) : (
        <SkillsTab
          skills={skills}
          onClaimSkill={claimSkill}
        />
      )}

      {/* Printable Modals */}
      <PrintableReportCard
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        student={user}
      />
      <PrintableCertificate
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        student={user}
      />
    </div>
  );
}
