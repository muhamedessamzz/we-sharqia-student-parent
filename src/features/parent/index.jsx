import React, { useState, useEffect } from 'react';
import { useParentData } from './hooks/useParentData';
import { useParentNotices } from './hooks/useParentNotices';
import ParentSidebar from './components/ParentSidebar';
import OverviewTab from './components/tabs/OverviewTab';
import SubmissionsTab from './components/tabs/SubmissionsTab';
import ExamsTab from './components/tabs/ExamsTab';
import ConductTab from './components/tabs/ConductTab';
import FitnessTab from './components/tabs/FitnessTab';
import RequestsTab from './components/tabs/RequestsTab';
import ScheduleTab from './components/tabs/ScheduleTab';
import NewParentRequestModal from '../../components/modals/NewParentRequestModal';
import PrintableReportCard from '../../components/modals/PrintableReportCard';
import PrintableCertificate from '../../components/modals/PrintableCertificate';
import {
  Menu,
  Send,
  Home,
  ClipboardCheck,
  BookOpen,
  ShieldAlert,
  Activity,
  FileCheck,
  Printer,
  Award,
  ChevronDown,
  UserCheck,
  Calendar
} from 'lucide-react';
import { GRADE_LABELS } from './constants';

export default function ParentView({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedReportStudent, setSelectedReportStudent] = useState(null);
  const [selectedCertStudent, setSelectedCertStudent] = useState(null);

  const {
    children,
    parentRequests,
    loadParentData,
    handleShareWhatsapp
  } = useParentData(user?.id);

  // Single dedicated student for this guardian session
  const child = children[0] || null;

  const {
    notices,
    pendingCount,
    handleAcknowledgeNotice,
    handleContactCounselor
  } = useParentNotices(child ? [child] : [], loadParentData);

  const submissions = child?.progresses || child?.Progresses || [];
  const exams = child?.examScores || child?.ExamScores || [];

  const tabTitles = {
    overview: { title: 'الرئيسية ونظرة عامة', icon: Home },
    schedule: { title: 'الجدول الدراسي الأسبوعي', icon: Calendar },
    submissions: { title: 'التسليمات والواجبات والمستوى', icon: ClipboardCheck },
    exams: { title: 'الامتحانات والكنترول والتحسين', icon: BookOpen },
    conduct: { title: 'الانضباط والسلوك والإنذارات', icon: ShieldAlert },
    fitness: { title: 'اللياقة البدنية وطابور الصباح', icon: Activity },
    requests: { title: 'الطلبات والاستئذان وأعذار الغياب', icon: FileCheck },
  };

  const CurrentTabIcon = tabTitles[activeTab]?.icon || Home;

  return (
    <div className="w-full text-right" dir="rtl">
      {/* Mobile Top Action Bar (< lg) */}
      <div className="lg:hidden mb-4 bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 bg-purple-50 text-[#5C2C90] hover:bg-purple-100 rounded-xl transition-all cursor-pointer border border-purple-200/80"
            title="فتح قائمة الأقسام والسايد بار"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-900 truncate">
              <CurrentTabIcon size={15} className="text-[#5C2C90] shrink-0" />
              <span className="truncate">{tabTitles[activeTab]?.title}</span>
            </div>
            {child && (
              <span className="text-[10px] text-slate-400 font-bold block truncate">
                الطالب: {child.fullName}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Send size={12} />
          <span>+ إذن/عذر</span>
        </button>
      </div>

      {/* Main Layout Container: Sidebar + Fluid Content Area */}
      <div className="flex items-start gap-5 lg:gap-6">
        {/* 1. Sidebar (Fixed Drawer on Mobile, Sticky on Desktop) */}
        <ParentSidebar
          user={user}
          child={child}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingNoticesCount={pendingCount}
          parentRequestsCount={parentRequests.length}
          submissionsCount={submissions.length}
          examsCount={exams.length}
          onOpenRequestModal={() => setIsRequestModalOpen(true)}
          onSelectReportStudent={setSelectedReportStudent}
          onSelectCertStudent={setSelectedCertStudent}
          onShareWhatsapp={handleShareWhatsapp}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
        />

        {/* 2. Main Fluid Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {activeTab === 'overview' && (
            <OverviewTab
              child={child}
              notices={notices}
              onSelectTab={setActiveTab}
              onSelectReportStudent={setSelectedReportStudent}
              onSelectCertStudent={setSelectedCertStudent}
              onShareWhatsapp={handleShareWhatsapp}
              onAcknowledgeNotice={handleAcknowledgeNotice}
              onContactCounselor={handleContactCounselor}
              onOpenRequestModal={() => setIsRequestModalOpen(true)}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab activeStudent={child} />
          )}

          {activeTab === 'submissions' && (
            <SubmissionsTab child={child} />
          )}

          {activeTab === 'exams' && (
            <ExamsTab
              child={child}
              onSelectReportStudent={setSelectedReportStudent}
            />
          )}

          {activeTab === 'conduct' && (
            <ConductTab
              child={child}
              notices={notices}
              onAcknowledgeNotice={handleAcknowledgeNotice}
              onContactCounselor={handleContactCounselor}
              onSelectCertStudent={setSelectedCertStudent}
            />
          )}

          {activeTab === 'fitness' && (
            <FitnessTab child={child} />
          )}

          {activeTab === 'requests' && (
            <RequestsTab
              parentRequests={parentRequests}
              onOpenRequestModal={() => setIsRequestModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <NewParentRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        user={user}
        child={child}
        onRequestCreated={loadParentData}
      />

      <PrintableReportCard
        isOpen={!!selectedReportStudent}
        onClose={() => setSelectedReportStudent(null)}
        student={selectedReportStudent}
      />

      <PrintableCertificate
        isOpen={!!selectedCertStudent}
        onClose={() => setSelectedCertStudent(null)}
        student={selectedCertStudent}
      />
    </div>
  );
}
