'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FastForward,
  Settings,
  SkipForward,
  Subtitles,
  Server,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  episodeNumber: number;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  episodeNumber,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedServer, setSelectedServer] = useState('Server Alpha (Auto)');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showAutoNextPrompt, setShowAutoNextPrompt] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle Play / Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Time update listener
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;
      setCurrentTime(cur);
      setDuration(dur);

      // Auto-next prompt when < 20s remaining
      if (dur > 0 && dur - cur <= 20 && dur - cur > 1) {
        setShowAutoNextPrompt(true);
      } else {
        setShowAutoNextPrompt(false);
      }
    }
  };

  // Seek bar handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Volume slider handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Speed Handler
  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    showToast(`Speed set to ${speed}x`, 'info');
    setShowSettingsMenu(false);
  };

  // Skip Intro (+85s)
  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 85;
      showToast('Skipped Intro (+85s)', 'success');
    }
  };

  // Skip Outro (+90s)
  const skipOutro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 90;
      showToast('Skipped Outro (+90s)', 'success');
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Controls visibility on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  return (
    <div className="space-y-4">
      {/* Player Container */}
      <div
        ref={playerContainerRef}
        onMouseMove={handleMouseMove}
        className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-2xl group select-none border border-slate-800"
      >
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onNextEpisode}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Subtitles Overlay Simulation */}
        {subtitlesEnabled && isPlaying && (
          <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none z-20">
            <span className="px-3 py-1 bg-black/80 text-yellow-300 font-semibold text-sm sm:text-base rounded-md tracking-wide shadow-lg border border-black/40">
              [English Sub] "We have to breach the primary firewall before the eclipse!"
            </span>
          </div>
        )}

        {/* Auto Next Prompt Overlay */}
        {showAutoNextPrompt && hasNextEpisode && (
          <div className="absolute top-6 right-6 z-30 bg-indigo-950/90 border border-indigo-500/50 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
            <div>
              <p className="text-xs text-indigo-300 font-semibold">Up Next in 15s</p>
              <p className="text-sm font-bold">Episode {episodeNumber + 1}</p>
            </div>
            <button
              onClick={onNextEpisode}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg"
            >
              Play Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Control Bar (Title + Server) */}
        <div
          className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300 flex items-center justify-between ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{title}</h3>
            <p className="text-xs text-indigo-400 font-medium">Episode {episodeNumber}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Skip Intro Button */}
            <button
              onClick={skipIntro}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1"
            >
              <FastForward className="w-3.5 h-3.5 text-indigo-400" /> Skip Intro (+85s)
            </button>

            <button
              onClick={skipOutro}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold backdrop-blur-md transition-colors items-center gap-1"
            >
              <SkipForward className="w-3.5 h-3.5 text-indigo-400" /> Skip Outro (+90s)
            </button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 transition-opacity duration-300 flex flex-col gap-2 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Seek Bar */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2.5 transition-all"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-slate-200 text-sm">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              {/* Prev / Next Episode */}
              <button
                onClick={onPrevEpisode}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Previous Episode"
              >
                <SkipForward className="w-4 h-4 rotate-180" />
              </button>

              <button
                onClick={onNextEpisode}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Next Episode"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="p-1.5 hover:bg-white/10 rounded-lg">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Time Display */}
              <span className="text-xs text-slate-300 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Subtitle toggle */}
              <button
                onClick={() => {
                  setSubtitlesEnabled(!subtitlesEnabled);
                  showToast(subtitlesEnabled ? 'Subtitles OFF' : 'Subtitles ON (English)', 'info');
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  subtitlesEnabled ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-slate-400'
                }`}
                title="Toggle Subtitles"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Settings Menu Popup */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Player Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettingsMenu && (
                  <div className="absolute right-0 bottom-10 w-48 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl text-xs space-y-2 z-40 text-slate-200">
                    <p className="font-semibold text-white px-2 py-1 border-b border-slate-800">
                      Playback Speed
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => changeSpeed(s)}
                          className={`py-1 rounded text-center transition-colors ${
                            playbackSpeed === s
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-slate-950 hover:bg-slate-800'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>

                    <p className="font-semibold text-white px-2 py-1 border-b border-slate-800">
                      Quality
                    </p>
                    <div className="flex flex-col gap-1">
                      {['1080p HD', '720p', '480p'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuality(q);
                            setShowSettingsMenu(false);
                            showToast(`Quality switched to ${q}`, 'info');
                          }}
                          className={`px-2 py-1 rounded text-left transition-colors ${
                            selectedQuality.includes(q)
                              ? 'bg-indigo-600/30 text-indigo-300 font-bold'
                              : 'hover:bg-slate-800'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Server Switcher Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">Streaming Server:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['Server Alpha (Auto)', 'Server Beta (CDN)', 'Server Gamma (HLS)'].map((srv) => (
            <button
              key={srv}
              onClick={() => {
                setSelectedServer(srv);
                showToast(`Switched streaming server to ${srv}`, 'info');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-colors shrink-0 ${
                selectedServer === srv
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {srv}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
