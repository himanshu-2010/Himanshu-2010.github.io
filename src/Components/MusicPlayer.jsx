import { useState, useEffect, useRef } from "react";

export default function MusicPlayer({ onAudioElementCreated }) {
  const [songs, setSongs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("musicPlayerVolume");
    return saved ? Math.min(Math.max(parseFloat(saved), 0), 1) : 0.3;
  });
  const [permissionGiven, setPermissionGiven] = useState(() => {
    return localStorage.getItem("audioPermissionGiven") === "true";
  });
  const audioRef = useRef(null);
  const permissionModalRef = useRef(null);

  // Load music files on mount
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const modules = import.meta.glob("/src/assets/music/*.{mp3,wav,ogg,m4a}", { eager: true });
        const musicFiles = Object.keys(modules).map((path) => ({
          id: path,
          name: path.split("/").pop().replace(/\.[^.]+$/, ""),
          path: path.replace("/src", ""),
        }));
        setSongs(musicFiles.sort((a, b) => a.name.localeCompare(b.name)));

        // Load last played song index
        const lastIndex = localStorage.getItem("lastPlayedSongIndex");
        if (lastIndex !== null && parseInt(lastIndex) < musicFiles.length) {
          setCurrentSongIndex(parseInt(lastIndex));
        }
      } catch (e) {
        console.log("No music files found:", e.message);
      }
    };
    loadMusic();
  }, []);

  // Save volume to localStorage
  useEffect(() => {
    localStorage.setItem("musicPlayerVolume", volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Set up audio element and pass to parent
  useEffect(() => {
    if (audioRef.current && onAudioElementCreated) {
      onAudioElementCreated(audioRef.current);
    }
  }, [onAudioElementCreated]);

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // Play next song
      if (currentSongIndex < songs.length - 1) {
        setCurrentSongIndex(currentSongIndex + 1);
      } else {
        // Loop to first song
        setCurrentSongIndex(0);
      }
      setIsPlaying(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentSongIndex, songs.length]);

  // Play song when index changes
  useEffect(() => {
    if (currentSongIndex >= 0 && currentSongIndex < songs.length && audioRef.current && permissionGiven) {
      audioRef.current.src = songs[currentSongIndex].path;
      localStorage.setItem("lastPlayedSongIndex", currentSongIndex.toString());
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.log("Autoplay blocked or error:", e.message);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSongIndex, songs, permissionGiven, isPlaying]);

  const handlePlayPause = () => {
    if (!permissionGiven) {
      permissionModalRef.current?.showModal();
      return;
    }
    if (currentSongIndex < 0 && songs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          console.log("Play error:", e.message);
        });
      }
    }
  };

  const handleRequestPermission = () => {
    setPermissionGiven(true);
    localStorage.setItem("audioPermissionGiven", "true");
    if (permissionModalRef.current) {
      permissionModalRef.current.close();
    }
    // Auto-play after permission
    if (currentSongIndex < 0 && songs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  const handleSelectSong = (index) => {
    if (!permissionGiven) {
      permissionModalRef.current?.showModal();
      return;
    }
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else if (currentSongIndex >= 0 && songs.length > 0) {
      setCurrentSongIndex(songs.length - 1);
    }
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else if (currentSongIndex >= 0 && songs.length > 0) {
      setCurrentSongIndex(0);
    }
    setIsPlaying(true);
  };

  return (
    <>
      {/* Audio Element */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Music Tab Button (Top Right of Navbar) */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: "fixed",
          top: "18px",
          right: "100px",
          zIndex: 501,
          width: 44,
          height: 44,
          borderRadius: "8px",
          border: "1px solid rgba(100,220,150,0.3)",
          background: isOpen ? "rgba(100,220,150,0.15)" : "rgba(10,10,20,0.9)",
          color: "#64DC96",
          fontSize: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          backdropFilter: "blur(8px)",
        }}
        title="Music Player"
      >
        🎵
      </button>

      {/* Vertical Sidebar */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: "320px",
            background: "rgba(8,8,16,0.98)",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(100,220,150,0.2)",
            zIndex: 500,
            display: "flex",
            flexDirection: "column",
            boxShadow: "-4px 0 30px rgba(0,0,0,0.5)",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid rgba(100,220,150,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#64DC96", fontWeight: 700, fontSize: 16 }}>🎵 Music</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#64DC96",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Currently Playing */}
          {currentSongIndex >= 0 && currentSongIndex < songs.length && (
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid rgba(100,220,150,0.1)",
                background: "rgba(100,220,150,0.06)",
              }}
            >
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Now Playing</div>
              <div
                style={{
                  fontSize: 14,
                  color: "#64DC96",
                  fontWeight: 700,
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {songs[currentSongIndex]?.name}
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid rgba(100,220,150,0.1)",
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={handlePrevious}
              disabled={songs.length === 0}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 6,
                border: "1px solid rgba(100,220,150,0.3)",
                background: "rgba(100,220,150,0.06)",
                color: "#64DC96",
                cursor: songs.length > 0 ? "pointer" : "not-allowed",
                fontWeight: 700,
                opacity: songs.length > 0 ? 1 : 0.5,
              }}
            >
              ⏮
            </button>
            <button
              onClick={handlePlayPause}
              disabled={songs.length === 0}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 6,
                border: "1px solid rgba(100,220,150,0.3)",
                background: isPlaying ? "rgba(100,220,150,0.2)" : "rgba(100,220,150,0.06)",
                color: "#64DC96",
                cursor: songs.length > 0 ? "pointer" : "not-allowed",
                fontWeight: 700,
                opacity: songs.length > 0 ? 1 : 0.5,
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={handleNext}
              disabled={songs.length === 0}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 6,
                border: "1px solid rgba(100,220,150,0.3)",
                background: "rgba(100,220,150,0.06)",
                color: "#64DC96",
                cursor: songs.length > 0 ? "pointer" : "not-allowed",
                fontWeight: 700,
                opacity: songs.length > 0 ? 1 : 0.5,
              }}
            >
              ⏭
            </button>
          </div>

          {/* Volume Control */}
          <div style={{ padding: "16px", borderBottom: "1px solid rgba(100,220,150,0.1)" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Volume</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#64DC96", fontSize: 14 }}>🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(volume * 100)}
                onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                style={{
                  flex: 1,
                  cursor: "pointer",
                  accentColor: "#64DC96",
                }}
              />
              <span style={{ color: "#888", fontSize: 12, minWidth: 30 }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Song List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {songs.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#666",
                  fontSize: 13,
                }}
              >
                📁 No music files found.
                <br />
                Add .mp3, .wav, .ogg, or .m4a files to{" "}
                <code style={{ color: "#888", fontSize: 11 }}>
                  src/assets/music/
                </code>
              </div>
            ) : (
              songs.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => handleSelectSong(index)}
                  style={{
                    padding: "12px",
                    marginBottom: 4,
                    borderRadius: 6,
                    background:
                      currentSongIndex === index
                        ? "rgba(100,220,150,0.15)"
                        : "rgba(100,220,150,0.03)",
                    border:
                      currentSongIndex === index
                        ? "1px solid rgba(100,220,150,0.4)"
                        : "1px solid transparent",
                    color: currentSongIndex === index ? "#64DC96" : "#aaa",
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "all 0.2s",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (currentSongIndex !== index) {
                      e.currentTarget.style.background = "rgba(100,220,150,0.08)";
                      e.currentTarget.style.color = "#64DC96";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentSongIndex !== index) {
                      e.currentTarget.style.background = "rgba(100,220,150,0.03)";
                      e.currentTarget.style.color = "#aaa";
                    }
                  }}
                >
                  <span style={{ marginRight: 8 }}>
                    {currentSongIndex === index ? "▶" : "🎵"}
                  </span>
                  {song.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Audio Permission Modal */}
      <dialog
        ref={permissionModalRef}
        style={{
          border: "1px solid rgba(100,220,150,0.3)",
          borderRadius: 12,
          background: "rgba(8,8,16,0.98)",
          color: "#e0e0e0",
          padding: 0,
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ padding: "32px", minWidth: 340 }}>
          <h2 style={{ color: "#64DC96", marginTop: 0, marginBottom: 16 }}>
            🎵 Enable Background Music?
          </h2>
          <p style={{ color: "#aaa", marginBottom: 24, lineHeight: 1.5 }}>
            This website has a music player that can play background music while you browse. Would
            you like to enable it?
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              onClick={() => permissionModalRef.current?.close()}
              style={{
                padding: "10px 20px",
                borderRadius: 6,
                border: "1px solid rgba(100,220,150,0.3)",
                background: "rgba(100,220,150,0.06)",
                color: "#64DC96",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Not Now
            </button>
            <button
              onClick={handleRequestPermission}
              style={{
                padding: "10px 20px",
                borderRadius: 6,
                border: "1px solid rgba(100,220,150,0.5)",
                background: "linear-gradient(135deg,#64DC96,#00b894)",
                color: "#000",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Enable Music
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
