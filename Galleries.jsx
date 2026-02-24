import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "section1", title: "Projects & Prototypes", path: "section1" },
  { id: "section2", title: "Design & Concepts", path: "section2" },
  { id: "section3", title: "Events & Competitions", path: "section3" },
];

export default function Galleries({ onGoHome }) {
  const [galleries, setGalleries] = useState({});
  const [videos, setVideos] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load images and videos using Vite's glob feature
  useEffect(() => {
    const loadGalleries = async () => {
      const galleryData = {};
      const videoData = [];

      // Load images from main gallery folder and sections
      const mainGalleryImages = import.meta.glob(
        "/src/assets/gallery/*.{jpg,jpeg,png,gif,webp}",
        { eager: true }
      );
      const section1Images = import.meta.glob(
        "/src/assets/gallery/section1/*.{jpg,jpeg,png,gif,webp}",
        { eager: true }
      );
      const section2Images = import.meta.glob(
        "/src/assets/gallery/section2/*.{jpg,jpeg,png,gif,webp}",
        { eager: true }
      );
      const section3Images = import.meta.glob(
        "/src/assets/gallery/section3/*.{jpg,jpeg,png,gif,webp}",
        { eager: true }
      );

      // Load videos
      const mainGalleryVideos = import.meta.glob(
        "/src/assets/gallery/*.{mp4,webm,mov,avi}",
        { eager: true }
      );

      // Combine all images
      const allImages = {
        ...mainGalleryImages,
        ...section1Images,
        ...section2Images,
        ...section3Images,
      };

      galleryData["all"] = Object.values(allImages).map((mod) => mod.default);
      videoData.push(...Object.values(mainGalleryVideos).map((mod) => mod.default));

      setGalleries(galleryData);
      setVideos(videoData);
    };

    loadGalleries();
  }, []);

  const allImages = galleries["all"] || [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      color: "#d0d0d0",
      fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>
      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: navScrolled ? "10px 24px" : "18px 24px",
        background: navScrolled ? "rgba(8,8,16,0.97)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          maxWidth: 1200, margin: "0 auto",
        }}>
          <div onClick={onGoHome} style={{
            fontFamily: "'Space Mono', monospace", fontWeight: 700,
            fontSize: 18, color: "#64DC96", letterSpacing: "0.05em", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#00cec9";
            e.currentTarget.style.textShadow = "0 0 10px rgba(100,220,150,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64DC96";
            e.currentTarget.style.textShadow = "none";
          }}
          >
            ← Back Home
          </div>
          <h1 style={{
            fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "0.1em",
          }}>
            GALLERY
          </h1>
          <div style={{ width: 80 }} />
        </div>
      </nav>

      {/* ── GALLERY GRID ── */}
      <div style={{
        paddingTop: 100,
        paddingBottom: 60,
        paddingX: 24,
      }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          marginBottom: 60,
          textAlign: "center",
        }}>
          <h1 style={{
            fontSize: "clamp(36px, 8vw, 56px)",
            fontWeight: 800,
            marginBottom: 12,
            color: "#fff",
            background: "linear-gradient(135deg,#64DC96,#00cec9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Gallery
          </h1>
          <p style={{
            fontSize: 16,
            color: "#888",
            marginBottom: 8,
          }}>
            Explore my projects, designs, and experiences
          </p>
          <p style={{
            fontSize: 13,
            color: "#555",
          }}>
            {allImages.length} images {videos.length > 0 && `· ${videos.length} videos`}
          </p>
        </div>

        {allImages.length > 0 ? (
          <div style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "repeat(auto-fill, minmax(150px, 1fr))"
              : "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            width: "100%",
            marginBottom: videos.length > 0 ? 80 : 0,
          }}>
            {allImages.map((item, idx) => (
              <div
                key={`img-${idx}`}
                onClick={() => setLightbox(item)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 12,
                  border: "1px solid rgba(100,220,150,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  aspectRatio: "1 / 1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(100,220,150,0.6)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(100,220,150,0.2)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(100,220,150,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={item}
                  alt={`Gallery ${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}

        {/* Videos Section */}
        {videos.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#64DC96",
              marginBottom: 40,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(100,220,150,0.2)",
            }}>
              Videos
            </h2>

            <div style={{
              maxWidth: 1400,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: isMobile 
                ? "repeat(auto-fill, minmax(150px, 1fr))"
                : "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 16,
              width: "100%",
            }}>
              {videos.map((video, idx) => (
                <div
                  key={`vid-${idx}`}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 12,
                    border: "2px solid rgba(100,220,150,0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    aspectRatio: "16 / 9",
                    background: "rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,220,150,0.7)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(100,220,150,0.25)";
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,220,150,0.3)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <video
                    src={video}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    controls
                  />
                  <div style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(100,220,150,0.2)",
                    border: "1px solid rgba(100,220,150,0.5)",
                    color: "#64DC96",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}>
                    ▶
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {allImages.length === 0 && videos.length === 0 && (
          <div style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: 60,
            textAlign: "center",
            color: "#666",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
            <p>No images or videos yet. Add them to the gallery folder.</p>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            cursor: "pointer",
            backdropFilter: "blur(5px)",
          }}
        >
          <img
            src={lightbox}
            alt="Lightbox"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: 8,
              border: "1px solid rgba(100,220,150,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "rgba(100,220,150,0.2)",
              border: "1px solid rgba(100,220,150,0.5)",
              color: "#64DC96",
              width: 44,
              height: 44,
              borderRadius: "50%",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              fontWeight: "bold",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.4)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.8)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.2)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.5)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
