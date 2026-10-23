import { useState } from 'react';
import { api } from '../../../api/client';

export function useQuizPlayer() {
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [activeProgress, setActiveProgress] = useState(null);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [helpRequested, setHelpRequested] = useState(false);

  const startOrResumeAssignment = async (asg, userId, setProgressMap) => {
    setActiveAssignment(asg);
    try {
      const prog = await api.startProgress(asg.id, userId);
      setActiveProgress(prog);
      if (setProgressMap) {
        setProgressMap((prev) => ({ ...prev, [asg.id]: prog }));
      }
      setHelpRequested(prog.hasRequestedHelp);
      if (prog.answersJson) {
        try {
          setCurrentAnswers(JSON.parse(prog.answersJson));
        } catch (e) {}
      }
    } catch (e) {
      console.error('Failed to start progress on backend:', e);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ar-EG';
      window.speechSynthesis.speak(utter);
    }
  };

  const handleRequestHelp = async (type = 'استفسار حول متطلبات التكليف والتطبيق العملي') => {
    if (!activeProgress) return;
    try {
      await api.updateProgress(activeProgress.id, {
        status: 2,
        helpType: type,
      });
      setHelpRequested(true);
      setActiveProgress((p) => ({ ...p, status: 2, helpTypeRequested: type, hasRequestedHelp: true }));
    } catch (e) {
      setHelpRequested(true);
    }
  };

  const handleFinishStage = async (setProgressMap) => {
    if (!activeProgress || !activeAssignment) return;
    const currentIdx = activeProgress.currentStageIndex;
    const isLast = currentIdx + 1 >= (activeAssignment.stages?.length || 1);

    const updateData = {
      stageIndex: isLast ? currentIdx : currentIdx + 1,
      status: isLast ? 4 : 1,
      starsEarned: 2,
      scoreIncrement: 10,
      answersJson: JSON.stringify(currentAnswers),
    };

    try {
      await api.updateProgress(activeProgress.id, updateData);
      const updated = {
        ...activeProgress,
        currentStageIndex: updateData.stageIndex,
        status: updateData.status,
        stars: (activeProgress.stars || 0) + 2,
        autoScore: (activeProgress.autoScore || 0) + 10,
      };
      setActiveProgress(updated);
      if (setProgressMap) {
        setProgressMap((prev) => ({ ...prev, [activeAssignment.id]: updated }));
      }
    } catch (e) {
      setActiveProgress((p) => ({
        ...p,
        currentStageIndex: isLast ? currentIdx : currentIdx + 1,
        status: isLast ? 4 : 1,
        stars: (p.stars || 0) + 2,
      }));
    }
  };

  const closeQuiz = () => {
    setActiveAssignment(null);
    setActiveProgress(null);
    setCurrentAnswers({});
    setHelpRequested(false);
  };

  return {
    activeAssignment,
    setActiveAssignment,
    activeProgress,
    currentAnswers,
    setCurrentAnswers,
    helpRequested,
    startOrResumeAssignment,
    handleSpeak,
    handleRequestHelp,
    handleFinishStage,
    closeQuiz
  };
}
