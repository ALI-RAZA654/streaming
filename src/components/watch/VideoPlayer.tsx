'use client';

import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
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
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { fetchAnivexaStream } from '@/lib/anivexa';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  episodeNumber: number;
  anilistId?: number | string;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
}

const DEFAULT_DEMO_STREAM = 'https://vjs.zencdn.net/v/oceans.mp4';
const DEFAULT_HLS_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl: initialVideoUrl,
  title,
  episodeNumber,
  anilistId = 16498,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    initialVideoUrl || DEFAULT_DEMO_STREAM
  );
  const [isIframe, setIsIframe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useNativeControls, setUseNativeControls] = useState(false);

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
  const hlsRef = useRef<Hls | null>(null);

  // Initialize or update stream player when currentVideoUrl changes
  useEffect(() => {
    if (!currentVideoUrl) return;

    // Check if it's an iframe embed link
    const isEmbed =
      currentVideoUrl.includes('embed') ||
      currentVideoUrl.includes('iframe') ||
      currentVideoUrl.includes('streamtape') ||
      currentVideoUrl.includes('megacloud');

    if (isEmbed) {
      setIsIframe(true);
      setIsLoading(false);
      return;
    }

    setIsIframe(false);
    setHasError(false);

    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Clean up previous Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = currentVideoUrl.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(currentVideoUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('[Player] HLS Error fatal:', data);
          setHasError(true);
        }
      });

      hlsRef.current = hls;
    } else {
      videoElement.src = currentVideoUrl;
      videoElement.load();
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentVideoUrl]);

  // Handle Server Switching (Calls Anivexa API dynamically or falls back to test servers)
  const handleServerChange = async (serverName: string, providerKey: string, subOrDub: 'sub' | 'dub' = 'sub') => {
    setSelectedServer(serverName);
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    showToast(`Connecting to ${serverName}...`, 'info');

    if (providerKey === 'sample') {
      setCurrentVideoUrl(DEFAULT_DEMO_STREAM);
      setIsLoading(false);
      showToast('Loaded Demo MP4 Stream', 'success');
      return;
    }

    if (providerKey === 'hls_demo') {
      setCurrentVideoUrl(DEFAULT_HLS_STREAM);
      setIsLoading(false);
      showToast('Loaded Demo HLS Stream', 'success');
      return;
    }

    try {
      const streamData = await fetchAnivexaStream(anilistId, episodeNumber, providerKey, subOrDub);
      if (streamData && streamData.streamUrl) {
        setCurrentVideoUrl(streamData.streamUrl);
        showToast(`Loaded stream from ${serverName}`, 'success');
      } else {
        showToast(`Server returned no active stream. Switched to backup server.`, 'info');
        setCurrentVideoUrl(DEFAULT_DEMO_STREAM);
      }
    } catch (err) {
      setHasError(true);
      showToast('Failed to connect to stream server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Play / Pause
  const togglePlay = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      try {
        if (video.readyState === 0) {
          video.load();
        }
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('[Player] Playback failed, reloading:', err);
        try {
          video.load();
          await video.play();
          setIsPlaying(true);
        } catch (retryErr) {
          console.error('[Player] Retry failed:', retryErr);
          showToast('Could not play video. Try switching server below.', 'error');
          setIsPlaying(false);
        }
      }
    }
  };

  // Time update listener
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;
      setCurrentTime(cur);
      setDuration(dur);

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
        className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden shadow-2xl group select-none border border-slate-800"
      >
        {/* Render Iframe for embed servers */}
        {isIframe ? (
          <iframe
            src={currentVideoUrl}
            allowFullScreen
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
          />
        ) : (
          /* Standard Video / HLS element */
          <video
            ref={videoRef}
            src={!currentVideoUrl.includes('.m3u8') ? currentVideoUrl : undefined}
            onTimeUpdate={handleTimeUpdate}
            onEnded={onNextEpisode}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onClick={(e) => togglePlay(e)}
            playsInline
            crossOrigin="anonymous"
            preload="auto"
            controls={useNativeControls}
            className="w-full h-full object-contain cursor-pointer"
          />
        )}

        {/* Loading Spinner Overlay */}
        {isLoading && !isIframe && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 text-white gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-xs font-semibold tracking-wider text-slate-300">Connecting to Stream Server...</p>
          </div>
        )}

        {/* Error Overlay */}
        {hasError && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-30 text-white p-6 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-rose-500 animate-bounce" />
            <h4 className="font-bold text-lg">Stream Loading Issue</h4>
            <p className="text-xs text-slate-400 max-w-md">
              Selected video provider source is currently unavailable. Please switch to another server below.
            </p>
            <button
              onClick={() => handleServerChange('Server Demo (MP4)', 'sample')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Load Demo Server
            </button>
          </div>
        )}

        {/* Center Big Play Button (when paused & not iframe & not native controls) */}
        {!isPlaying && !isLoading && !hasError && !isIframe && !useNativeControls && (
          <button
            onClick={(e) => togglePlay(e)}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 z-20 backdrop-blur-sm border border-indigo-400/40 cursor-pointer"
          >
            <Play className="w-9 h-9 fill-white ml-1" />
          </button>
        )}

        {/* Subtitles Overlay Simulation */}
        {subtitlesEnabled && isPlaying && !isIframe && (
          <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none z-20 px-4">
            <span className="px-3 py-1.5 bg-black/85 text-yellow-300 font-semibold text-xs sm:text-sm rounded-md tracking-wide shadow-lg border border-black/40 inline-block max-w-xl">
              [English Sub] "We have to breach the primary firewall before the eclipse!"
            </span>
          </div>
        )}

        {/* Auto Next Prompt Overlay */}
        {showAutoNextPrompt && hasNextEpisode && (
          <div className="absolute top-6 right-6 z-30 bg-indigo-950/90 border border-indigo-500/50 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
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

        {/* Top Control Bar (Title + Actions) */}
        {!useNativeControls && (
          <div
            className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300 flex items-center justify-between ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{title}</h3>
              <p className="text-xs text-indigo-400 font-medium">
                Episode {episodeNumber} • {selectedServer}
              </p>
            </div>

            {!isIframe && (
              <div className="flex items-center gap-2">
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
            )}
          </div>
        )}

        {/* Bottom Control Bar */}
        {!isIframe && !useNativeControls && (
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 transition-opacity duration-300 flex flex-col gap-2 ${
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
                <button
                  onClick={(e) => togglePlay(e)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>

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

                {/* Settings Menu */}
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
        )}
      </div>

      {/* Stream Server Switcher Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">Streaming Server:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { name: 'Server Alpha (Auto)', provider: 'anizone', sub: 'sub' },
            { name: 'Server Beta (HLS Test)', provider: 'hls_demo', sub: 'sub' },
            { name: 'Server Gamma (MP4 HD)', provider: 'sample', sub: 'sub' },
            { name: 'Server Delta (Dub)', provider: 'gogoanime', sub: 'dub' },
          ].map((srv) => (
            <button
              key={srv.name}
              onClick={() => handleServerChange(srv.name, srv.provider, srv.sub as 'sub' | 'dub')}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedServer === srv.name
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {srv.name}
            </button>
          ))}

          {/* Toggle Native Controls fallback button */}
          <button
            onClick={() => setUseNativeControls(!useNativeControls)}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
              useNativeControls
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle browser default player controls"
          >
            <Sliders className="w-3.5 h-3.5" />
            {useNativeControls ? 'Native Controls: ON' : 'Native Controls: OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
