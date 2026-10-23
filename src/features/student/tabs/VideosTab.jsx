import React from 'react';
import { PlayCircle, Volume2 } from 'lucide-react';

export default function VideosTab({ videos = [], onSpeak }) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-black text-slate-900">شروحات منصة جاهز (فيديوهات متعددة الوسائط)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="h-32 rounded-xl bg-gradient-to-tr from-[#2A0E47] to-[#5C2C90] flex items-center justify-center text-white mb-3 shadow-inner">
                <PlayCircle size={40} className="text-[#E4007C]" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">{vid.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {vid.writtenExplanation}
              </p>
            </div>
            <button
              onClick={() => onSpeak(vid.writtenExplanation || vid.title)}
              className="w-full bg-slate-50 hover:bg-purple-50 text-[#5C2C90] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200/70 transition-colors cursor-pointer"
            >
              <Volume2 size={13} /> استماع صوتي
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
