import { useState, useEffect, useRef } from "react";
import Particles from "./Particles";
import CustomCursor from "./CustomCursor";
import ProjectCard from "./ProjectCard";
import TypingText from "./TypingText";
import SearchBar from "./SearchBar";
import LoginModal from "./LoginModal";
import SecretGallery from "./SecretGallery";
import SnakeGame from "./SnakeGame";
import Galleries from "./Galleries";
import MusicPlayer from "./MusicPlayer";

const QUICK_REENTRY_MS = 10000; // 10 seconds

export default function Portfolio() {
  const [page, setPage]               = useState("home");
  const [showLogin, setShowLogin]     = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navOpen, setNavOpen]         = useState(false);
  const [formState, setFormState]     = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent]       = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet]       = useState(window.innerWidth < 1024);

  // Track when the user last exited the secret page
  const secretExitTimeRef = useRef(null);

  // F1 on home page — go back to secret if within 10s, else do nothing
  useEffect(() => {
    if (page !== "home") return;
    const onKey = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        if (
          secretExitTimeRef.current &&
          Date.now() - secretExitTimeRef.current < QUICK_REENTRY_MS
        ) {
          setPage("secret");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page]);

  const handleSecretExit = () => {
    secretExitTimeRef.current = Date.now();
    setPage("home");
  };

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (page !== "home") return;
    const sections = ["hero", "about", "projects", "contact", "games"];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [page]);

  const scrollTo = (id) => {
    if (id === "galleries") {
      setPage("galleries");
      setNavOpen(false);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setNavOpen(false);
    }
  };

  if (page === "secret") return <SecretGallery onExit={handleSecretExit} />;
  if (page === "galleries") return <Galleries onGoHome={() => setPage("home")} />;

  const skills = [
    { name: "Arduino",    level: 90 },
    { name: "C++",        level: 75 },
    { name: "HTML/CSS",   level: 80 },
    { name: "JavaScript", level: 65 },
    { name: "IoT",        level: 85 },
    { name: "Robotics",   level: 88 },
    { name: "Python",     level: 60 },
    { name: "3D Design",  level: 55 },
  ];

  const NAV_LINKS = ["about", "projects", "galleries", "contact", "games"];

  return (
    <div style={{
      minHeight: "100vh", background: "#080810",
      fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
      color: "#d0d0d0", overflowX: "hidden",
    }}>
      <Particles />
      {!isMobile && <CustomCursor />}

      {/* Music Player */}
      <MusicPlayer />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: navScrolled ? "10px 24px" : "18px 24px",
        background: navScrolled || navOpen ? "rgba(8,8,16,0.97)" : "transparent",
        backdropFilter: navScrolled || navOpen ? "blur(20px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          maxWidth: 1200, margin: "0 auto",
        }}>
          <div onClick={() => scrollTo("hero")} style={{
            fontFamily: "'Space Mono', monospace", fontWeight: 700,
            fontSize: 18, color: "#64DC96", letterSpacing: "0.05em", cursor: "pointer",
          }}>
            HK<span style={{ color: "#555" }}>.dev</span>
          </div>

          {!isMobile && (
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {NAV_LINKS.map((s) => (
                <a key={s} onClick={() => scrollTo(s)} style={{
                  cursor: "pointer", fontSize: 14, textDecoration: "none",
                  color: activeSection === s ? "#64DC96" : "#666",
                  fontWeight: activeSection === s ? 600 : 400,
                  transition: "all 0.2s ease", textTransform: "capitalize",
                  paddingBottom: 4,
                  borderBottom: activeSection === s ? "2px solid #64DC96" : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== s) {
                    e.currentTarget.style.color = "#64DC96";
                    e.currentTarget.style.borderBottom = "2px solid #64DC96";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== s) {
                    e.currentTarget.style.color = "#666";
                    e.currentTarget.style.borderBottom = "2px solid transparent";
                  }
                }}
                >
                  {s}
                </a>
              ))}
            </div>
          )}

          {isMobile && (
            <button onClick={() => setNavOpen((o) => !o)} style={{
              background: "none", border: "none", color: "#64DC96",
              fontSize: 22, cursor: "pointer", padding: 4,
            }}>
              {navOpen ? "✕" : "☰"}
            </button>
          )}
        </div>

        {isMobile && navOpen && (
          <div style={{
            display: "flex", flexDirection: "column", gap: 4,
            padding: "16px 0 8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 12,
          }}>
            {NAV_LINKS.map((s) => (
              <a key={s} onClick={() => scrollTo(s)} style={{
                cursor: "pointer", fontSize: 15, padding: "10px 4px",
                color: activeSection === s ? "#64DC96" : "#aaa",
                textTransform: "capitalize", transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (activeSection !== s) e.currentTarget.style.color = "#64DC96";
              }}
              onMouseLeave={(e) => {
                if (activeSection !== s) e.currentTarget.style.color = "#aaa";
              }}
              >
                {s}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "100px 24px 60px" : "120px 40px 80px", position: "relative",
      }}>
        <div style={{ textAlign: "center", maxWidth: 800, width: "100%" }}>
          <div style={{
            display: "inline-block", padding: "6px 18px",
            border: "1px solid rgba(100,220,150,0.3)", borderRadius: 30,
            fontSize: isMobile ? 11 : 13, color: "#64DC96",
            marginBottom: isMobile ? 20 : 32,
            background: "rgba(100,220,150,0.06)", letterSpacing: "0.08em",
          }}>
            🇮🇳 10th Grade · Jamshedpur, India
          </div>

          <h1 style={{
            fontSize: isMobile ? "clamp(30px,8vw,48px)" : "clamp(36px,6vw,72px)",
            fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", color: "#fff",
          }}>
            Hi, I'm{" "}
            <span style={{
              background: "linear-gradient(135deg,#64DC96,#00cec9,#6c5ce7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Himanshu Kumar
            </span>
          </h1>

          <div style={{
            fontSize: isMobile ? "clamp(13px,4vw,18px)" : "clamp(16px,2.5vw,24px)",
            color: "#888", marginBottom: isMobile ? 28 : 40,
            fontFamily: "'Space Mono', monospace",
          }}>
            <TypingText texts={[
              "Robotics Builder 🤖",
              "Arduino Enthusiast ⚡",
              "Problem Solver 🧩",
              "Future NVIDIA Engineer 🚀",
              "Tech Philanthropist 💚",
            ]} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "0 8px" }}>
            <button onClick={() => scrollTo("projects")} style={{
              padding: isMobile ? "12px 24px" : "14px 32px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#64DC96,#00b894)",
              color: "#000", fontWeight: 700, fontSize: isMobile ? 14 : 15, cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(100,220,150,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              View My Work ↓
            </button>
            <button onClick={() => scrollTo("contact")} style={{
              padding: isMobile ? "12px 24px" : "14px 32px", borderRadius: 12,
              border: "1px solid rgba(100,220,150,0.3)", background: "transparent",
              color: "#64DC96", fontWeight: 600, fontSize: isMobile ? 14 : 15, cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.1)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.6)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(100,220,150,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              Get in Touch
            </button>
          </div>

          <div style={{
            display: "flex", gap: isMobile ? 12 : 24, justifyContent: "center",
            marginTop: isMobile ? 40 : 72, flexWrap: "wrap",
          }}>
            {[
              { val: "10+",  label: "Projects Built" },
              { val: "10th", label: "Grade Student"  },
              { val: "∞",   label: "Curiosity"      },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: isMobile ? "14px 20px" : "20px 32px",
                textAlign: "center", flex: "1 1 80px", maxWidth: 160,
              }}>
                <div style={{
                  fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#64DC96",
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {s.val}
                </div>
                <div style={{ color: "#555", fontSize: 11, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: isMobile ? "60px 24px" : isTablet ? "80px 32px" : "100px 40px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
          gap: isMobile ? 40 : 60, alignItems: "start",
        }}>
          <div>
            <span style={{ color: "#64DC96", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>About Me</span>
            <h2 style={{
              fontSize: isMobile ? "clamp(24px,6vw,36px)" : "clamp(28px,4vw,48px)",
              fontWeight: 800, margin: "12px 0 20px", color: "#fff", lineHeight: 1.2,
            }}>
              Building the future,<br />one project at a time
            </h2>
            <p style={{ color: "#777", lineHeight: 1.8, marginBottom: 16, fontSize: isMobile ? 14 : 15 }}>
              I'm a 10th-grade student from India with a deep passion for technology and problem-solving.
              My interests revolve around electronics, robotics, Arduino, and embedded systems — I love
              bringing ideas to life through hands-on projects.
            </p>
            <p style={{ color: "#777", lineHeight: 1.8, marginBottom: 28, fontSize: isMobile ? 14 : 15 }}>
              From RC battle bots to smart farm automation systems, I'm always tinkering with something new.
              Math and CS are my favourite subjects, and I dream of working at NVIDIA to contribute
              to cutting-edge innovation.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { emoji: "🤖", text: "Robotics"   },
                { emoji: "⚡", text: "Arduino"    },
                { emoji: "🌐", text: "IoT"        },
                { emoji: "🏀", text: "Basketball" },
                { emoji: "💻", text: "Web Dev"    },
              ].map((t) => (
                <span key={t.text} style={{
                  padding: "5px 14px", borderRadius: 30, fontSize: 12,
                  background: "rgba(100,220,150,0.06)", color: "#64DC96",
                  border: "1px solid rgba(100,220,150,0.15)",
                }}>
                  {t.emoji} {t.text}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span style={{ color: "#64DC96", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>Skills</span>
            <div style={{ marginTop: 20 }}>
              {skills.map((s, i) => (
                <div key={s.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: "#aaa" }}>{s.name}</span>
                    <span style={{ fontSize: 12, color: "#64DC96", fontFamily: "'Space Mono', monospace" }}>{s.level}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 5, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: "linear-gradient(90deg,#64DC96,#00cec9)",
                      width: `${s.level}%`,
                      animation: `fillBar 1.2s ease ${i * 0.1}s both`,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { emoji: "📚", label: "Fav Subjects", val: "Math & CS"     },
                { emoji: "🎯", label: "Dream Goal",   val: "Work at NVIDIA" },
                { emoji: "📍", label: "Location",     val: "India"          },
                { emoji: "🏀", label: "Sport",        val: "Basketball"     },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "12px 14px",
                  transition: "all 0.2s ease", cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(100,220,150,0.08)";
                  e.currentTarget.style.borderColor = "rgba(100,220,150,0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{item.emoji}</div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#ccc" }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: isMobile ? "60px 24px" : isTablet ? "80px 32px" : "100px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 60 }}>
            <span style={{ color: "#64DC96", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>Portfolio</span>
            <h2 style={{
              fontSize: isMobile ? "clamp(24px,6vw,36px)" : "clamp(28px,4vw,48px)",
              fontWeight: 800, margin: "12px 0 14px", color: "#fff",
            }}>
              Solutions Built with Purpose
            </h2>
            <p style={{ color: "#666", maxWidth: 500, margin: "0 auto", fontSize: isMobile ? 14 : 15 }}>
              Real-world projects that solve real problems — from farm automation to competitive robotics.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(auto-fill, minmax(300px,1fr))",
            gap: isMobile ? 16 : 24,
          }}>
            <ProjectCard emoji="🌾" title="Smart Farm Automation"
              desc="IoT-enabled farm monitoring and control system — temperature, humidity, soil moisture sensors with remote web access. Helps farmers manage operations from anywhere in the world."
              tags={["Arduino","IoT","Sensors","Web Interface","Automation"]} featured />
            <ProjectCard emoji="⚔️" title="RC Battle Bot"
              desc="Arduino-powered combat robot for robotics competitions, featuring a destructive motor weapon system and precise remote control capabilities."
              tags={["Arduino","Robotics","Motors","RC Control"]} />
            <ProjectCard emoji="🤖" title="Line Follower Robot"
              desc="Advanced PID-based ESP8266 line following robot with a custom web-based tuning interface for real-time parameter adjustments."
              tags={["ESP8266","PID Control","Web Interface","Sensors"]} />
            <ProjectCard emoji="💻" title="Portfolio Website"
              desc="Fully responsive personal portfolio showcasing projects, skills, and experience. Built with modern web technologies and dark/light theme switching."
              tags={["HTML","CSS","JavaScript","Responsive"]} />
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: isMobile ? "60px 24px" : isTablet ? "80px 32px" : "100px 40px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
          gap: isMobile ? 40 : 60, alignItems: "start",
        }}>
          <div>
            <span style={{ color: "#64DC96", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>Contact</span>
            <h2 style={{
              fontSize: isMobile ? "clamp(24px,6vw,36px)" : "clamp(28px,4vw,44px)",
              fontWeight: 800, margin: "12px 0 20px", color: "#fff", lineHeight: 1.2,
            }}>
              Let's Build Something Amazing
            </h2>
            <p style={{ color: "#666", lineHeight: 1.8, marginBottom: 32, fontSize: isMobile ? 14 : 15 }}>
              Feel free to reach out for collaborations, questions, or just to say hi!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { emoji: "📧", label: "Email",    val: "himanshujsr462@gmail.com" },
                { emoji: "📍", label: "Location", val: "India"                    },
                { emoji: "🎓", label: "School",   val: "9th Grade Student"        },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 11, fontSize: 18, flexShrink: 0,
                    background: "rgba(100,220,150,0.1)", border: "1px solid rgba(100,220,150,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s ease", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(100,220,150,0.2)";
                    e.currentTarget.style.borderColor = "rgba(100,220,150,0.5)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(100,220,150,0.1)";
                    e.currentTarget.style.borderColor = "rgba(100,220,150,0.2)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  >
                    {item.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#555" }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: "#ccc", wordBreak: "break-all" }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20, padding: isMobile ? 20 : 32,
          }}>
            {formSent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#64DC96", margin: "0 0 8px", fontSize: 18 }}>Message Sent!</h3>
                <p style={{ color: "#666", fontSize: 14 }}>Thanks for reaching out. I'll get back to you soon!</p>
              </div>
            ) : (
              <>
                {["name", "email"].map((field) => (
                  <input key={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formState[field]}
                    onChange={(e) => setFormState((s) => ({ ...s, [field]: e.target.value }))}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10, marginBottom: 12,
                      border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                      color: "#e0e0e0", fontSize: 14, outline: "none",
                      boxSizing: "border-box", fontFamily: "inherit", transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = "rgba(100,220,150,0.05)";
                      e.currentTarget.style.borderColor = "rgba(100,220,150,0.3)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  />
                ))}
                <textarea placeholder="Message" rows={4} value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10, marginBottom: 12,
                    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                    color: "#e0e0e0", fontSize: 14, outline: "none",
                    boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(100,220,150,0.05)";
                    e.currentTarget.style.borderColor = "rgba(100,220,150,0.3)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                />
                <button onClick={() => setFormSent(true)} style={{
                  width: "100%", padding: "13px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#64DC96,#00b894)",
                  color: "#000", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(100,220,150,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                >
                  Send Message →
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── GAMES ── */}
      <section id="games" style={{ padding: isMobile ? "60px 24px" : isTablet ? "80px 32px" : "100px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: "#64DC96", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>Fun</span>
          <h2 style={{
            fontSize: isMobile ? "clamp(24px,6vw,36px)" : "clamp(28px,4vw,48px)",
            fontWeight: 800, margin: "12px 0 12px", color: "#fff",
          }}>
            Games
          </h2>
          <p style={{ color: "#666", marginBottom: 32, fontSize: isMobile ? 14 : 15 }}>Interactive experiences built for fun</p>

          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20, padding: isMobile ? "24px 16px" : 40,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40, width: 200, height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(100,220,150,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐍</div>
            <h3 style={{ color: "#fff", margin: "0 0 10px", fontSize: isMobile ? 18 : 22 }}>Classic Snake Game</h3>
            <p style={{ color: "#666", marginBottom: 20, fontSize: isMobile ? 13 : 15 }}>
              Control the snake, eat the food, and grow longer!
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
              {["🎮 Classic Gameplay", "⚡ Fast-Paced", "🏆 High Score"].map((f) => (
                <span key={f} style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11,
                  background: "rgba(100,220,150,0.08)", color: "#64DC96",
                  border: "1px solid rgba(100,220,150,0.2)",
                }}>{f}</span>
              ))}
            </div>
            <div style={{ overflowX: "auto", display: "flex", justifyContent: "center" }}>
              <SnakeGame />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: isMobile ? "32px 24px" : "40px", textAlign: "center", color: "#444",
      }}>
        <div style={{ fontFamily: "'Space Mono', monospace", color: "#64DC96", fontSize: 18, marginBottom: 8 }}>
          HK<span style={{ color: "#333" }}>.dev</span>
        </div>
        <p style={{ fontSize: 13, margin: "0 0 16px", maxWidth: 400, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          9th-grade tech enthusiast passionate about robotics, embedded systems, and making a difference.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 20 }}>
          {["GitHub", "LinkedIn", "Twitter"].map((s) => (
            <a key={s} href="#" style={{ color: "#555", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#64DC96")}
              onMouseLeave={(e) => (e.target.style.color = "#555")}
            >{s}</a>
          ))}
        </div>
        <p style={{ fontSize: 11 }}>© 2024 Himanshu Kumar · All rights reserved</p>
      </footer>

      <SearchBar onSecretTrigger={() => setShowLogin(true)} />

      {showLogin && (
        <LoginModal
          onSuccess={() => { setShowLogin(false); setPage("secret"); }}
          onClose={() => setShowLogin(false)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap');
        ${!isMobile ? "* { cursor: none !important; }" : ""}
      `}</style>
    </div>
  );
}