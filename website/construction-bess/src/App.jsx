import React, { useMemo, useState, useEffect, useRef } from 'react';

// ─── Counter Hook ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    const numeric = parseInt(String(target).replace(/\D/g, ''), 10);
    if (!numeric) { setCount(target); return; }
    const suffix = String(target).replace(/[0-9]/g, '');
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numeric) + suffix);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [shouldStart, target, duration]);
  return count;
}
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './App.css';
import Reveal from './components/Reveal';
import BackToTop from './components/BackToTop';

// ─── API Configuration ─────────────────────────────────────────────────────
const API_BASE    = import.meta.env.VITE_API_BASE    || 'http://localhost:8000/api/v1';
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

// Converts "uploads/file.jpg" → full URL. Passes through existing http URLs untouched.
const storage = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STORAGE_URL}/${path}`;
};

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function mapAbout(data) {
  if (!data) return null;
  return {
    title:       data.companyName || 'WeBuild Construction',
    description: data.description || '',
    heroImage:   data.heroImage ? storage(data.heroImage) : null,
    stats: [
      { value: data.founded   || '—', label: 'years of experience' },
      { value: data.clients   || '—', label: 'satisfied clients'   },
      { value: data.employees || '—', label: 'active workers'      },
      { value: data.awards    || '—', label: 'awards won'          },
    ],
    phone:     data.phone     || '+123-456-7890',
    email:     data.email     || 'info@webuild.com',
    address:   data.address   || 'Mumbai, India - 400104',
    facebook:  data.facebook  || '#',
    twitter:   data.twitter   || '#',
    instagram: data.instagram || '#',
    linkedin:  data.linkedin  || '#',
    mission:   data.mission   || '',
    vision:    data.vision    || '',
  };
}

// ─── Project Modal ──────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const reduceMotion = useReducedMotion();

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const images = project.images?.length > 0 ? project.images : [project.image].filter(Boolean);

  const prev = () => setActivePhoto(i => (i - 1 + images.length) % images.length);
  const next = () => setActivePhoto(i => (i + 1) % images.length);

  return (
      <AnimatePresence>
        <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={onClose}
        >
          <motion.div
              className="project-modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="project-modal-close" onClick={onClose} aria-label="Close">
              <i className="fas fa-times" />
            </button>

            {/* Photo gallery */}
            {images.length > 0 && (
                <div className="project-modal-gallery">
                  <div className="project-modal-main-photo">
                    <img src={images[activePhoto]} alt={`${project.title} photo ${activePhoto + 1}`} />

                    {images.length > 1 && (
                        <>
                          <button className="gallery-nav gallery-prev" onClick={prev} aria-label="Previous">
                            <i className="fas fa-chevron-left" />
                          </button>
                          <button className="gallery-nav gallery-next" onClick={next} aria-label="Next">
                            <i className="fas fa-chevron-right" />
                          </button>
                          <span className="gallery-counter">{activePhoto + 1} / {images.length}</span>
                        </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                      <div className="project-modal-thumbs">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                className={`thumb ${i === activePhoto ? 'active' : ''}`}
                                onClick={() => setActivePhoto(i)}
                            >
                              <img src={img} alt={`Thumb ${i + 1}`} />
                            </button>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {/* Details */}
            <div className="project-modal-details">
              <div className="project-modal-header">
                <div>
                  <h2>{project.title}</h2>
                  <span className="project-modal-category">{project.category}</span>
                </div>
                {project.status && (
                    <span className={`project-modal-status project-modal-status--${project.status}`}>
                  {project.status}
                </span>
                )}
              </div>

              {project.description && (
                  <div className="project-modal-section">
                    <h4>About this project</h4>
                    <p>{project.description}</p>
                  </div>
              )}

              {project.services?.length > 0 && (
                  <div className="project-modal-section">
                    <h4>Services used</h4>
                    <div className="project-modal-services">
                      {project.services.map((s, i) => (
                          <span key={i} className="project-service-tag">{s}</span>
                      ))}
                    </div>
                  </div>
              )}

              {project.location && (
                  <div className="project-modal-section">
                    <h4><i className="fas fa-map-marker-alt" /> Location</h4>
                    <p>{project.location}</p>
                  </div>
              )}

              {project.link && (
                  <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn project-modal-btn"
                  >
                    view project <i className="fas fa-external-link-alt" />
                  </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
  );
}

// ─── Animated Stat Box ─────────────────────────────────────────────────────
function StatBox({ stat, index, reduceMotion, easing }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(stat.value, 1800, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
        { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
      <motion.div
          ref={ref}
          className="box"
          variants={{
            hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
            show: {
              opacity: 1, y: 0, filter: 'blur(0px)',
              transition: reduceMotion ? { duration: 0 } : { duration: 0.55, ease: easing, delay: index * 0.08 },
            },
          }}
      >
        <h3>{inView ? count : 0}</h3>
        <p>{stat.label}</p>
      </motion.div>
  );
}

function StatBoxContainer({ stats, reduceMotion, easing }) {
  return (
      <motion.div
          className="box-container"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: {} }}
      >
        {stats.map((stat, index) => (
            <StatBox key={index} stat={stat} index={index} reduceMotion={reduceMotion} easing={easing} />
        ))}
      </motion.div>
  );
}

// ─── Particle Background ────────────────────────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const TYPES = ['spark','spark','ember','dust','fragment'];
    const mkP = (w, h, fromBottom = false) => ({
      x: Math.random() * w,
      y: fromBottom ? h + 20 : Math.random() * h,
      vx: (Math.random() - 0.5) * 0.55,
      vy: -(Math.random() * 0.65 + 0.18),
      size: Math.random() * 2.6 + 0.7,
      opacity: Math.random() * 0.5 + 0.12,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      age: Math.floor(Math.random() * 160),
      life: Math.floor(Math.random() * 180 + 110),
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.045,
    });
    let parts = Array.from({ length: 60 }, () => mkP(canvas.width, canvas.height));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p, i) => {
        p.age++; p.x += p.vx; p.y += p.vy; p.angle += p.spin;
        if (p.y < -25 || p.age > p.life) { parts[i] = mkP(canvas.width, canvas.height, true); return; }
        const r = p.age / p.life;
        const fade = r < 0.12 ? r / 0.12 : r > 0.72 ? (1 - r) / 0.28 : 1;
        ctx.save();
        ctx.globalAlpha = p.opacity * fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        if (p.type === 'spark') {
          ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(245,191,35,.95)';
          ctx.fillStyle = '#f5bf23';
          ctx.beginPath(); ctx.arc(0, 0, p.size * 0.65, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(245,191,35,.55)'; ctx.lineWidth = p.size * 0.4;
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, p.size * 3); ctx.stroke();
        } else if (p.type === 'ember') {
          ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(255,150,20,.7)';
          const g = ctx.createRadialGradient(0,0,0,0,0,p.size*1.6);
          g.addColorStop(0, 'rgba(255,200,60,.9)');
          g.addColorStop(0.5, 'rgba(245,140,20,.6)');
          g.addColorStop(1, 'rgba(200,80,10,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(0, 0, p.size * 1.6, 0, Math.PI * 2); ctx.fill();
        } else if (p.type === 'dust') {
          ctx.fillStyle = 'rgba(245,191,35,.09)';
          ctx.beginPath(); ctx.arc(0, 0, p.size * 3.4, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(245,191,35,.32)';
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.4);
          ctx.lineTo(p.size, p.size * 0.8);
          ctx.lineTo(-p.size, p.size * 0.8);
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="particle-bg" aria-hidden="true" />;
}

// ─── Motto Ribbon ────────────────────────────────────────────────────────────
function MottoRibbon() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 950); return () => clearTimeout(t); }, []);
  return (
      <div className={`motto-ribbon${visible ? ' motto-ribbon--in' : ''}`} aria-label="Lion's Power — Eagle's Technique">
        <div className="motto-ribbon__line" />
        <div className="motto-ribbon__inner">
          <span className="motto-lion">✦ LION'S POWER</span>
          <span className="motto-divider">⬥</span>
          <span className="motto-eagle">EAGLE'S TECHNIQUE ✦</span>
        </div>
        <div className="motto-ribbon__line" />
      </div>
  );
}

// ─── Scroll Trowel ───────────────────────────────────────────────────────────
function ScrollTrowel({ reduceMotion }) {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered]   = useState(false);
  const rafRef = useRef(null);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);
  const wobble = reduceMotion ? 0 : Math.sin(progress * Math.PI * 12) * 8;
  const pct    = Math.round(progress * 100);
  return (
      <div className="scroll-trowel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} aria-hidden="true">
        <span className="scroll-trowel__pct" style={{ opacity: hovered ? 1 : 0 }}>{pct}%</span>
        <div className="scroll-trowel__track">
          <div className="scroll-trowel__fill" style={{ height: `${progress * 100}%` }} />
          <div className="scroll-trowel__drip" style={{ top: `calc(${progress * 100}% + 2rem)`, height: `${Math.min(progress * 4, 2.2)}rem` }} />
          <div className="scroll-trowel__icon" style={{ top: `${progress * 100}%`, transform: `translateX(-50%) translateY(-50%) rotate(${wobble}deg)` }}>
            <svg viewBox="0 0 60 170" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="st-wood" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#3d1f08"/>
                  <stop offset="22%"  stopColor="#7a4a24"/>
                  <stop offset="45%"  stopColor="#9e6535"/>
                  <stop offset="65%"  stopColor="#7a4a24"/>
                  <stop offset="100%" stopColor="#3d1f08"/>
                </linearGradient>
                <linearGradient id="st-blade" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#2a2a2a"/>
                  <stop offset="28%"  stopColor="#6e6e6e"/>
                  <stop offset="48%"  stopColor="#c8c8c8"/>
                  <stop offset="54%"  stopColor="#f0f0f0"/>
                  <stop offset="72%"  stopColor="#7a7a7a"/>
                  <stop offset="100%" stopColor="#303030"/>
                </linearGradient>
                <linearGradient id="st-ferrule" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#222"/>
                  <stop offset="35%"  stopColor="#888"/>
                  <stop offset="52%"  stopColor="#d0d0d0"/>
                  <stop offset="65%"  stopColor="#888"/>
                  <stop offset="100%" stopColor="#222"/>
                </linearGradient>
                <radialGradient id="st-mortar" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="rgba(245,191,35,.9)"/>
                  <stop offset="100%" stopColor="rgba(245,191,35,0)"/>
                </radialGradient>
                <filter id="st-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* handle end cap */}
              <ellipse cx="30" cy="7" rx="10" ry="5.5" fill="#2a1005"/>
              <ellipse cx="30" cy="6" rx="7" ry="3.5" fill="rgba(255,255,255,.07)"/>
              {/* handle body */}
              <rect x="20" y="5" width="20" height="54" rx="10" fill="url(#st-wood)"/>
              <line x1="23" y1="9"  x2="23" y2="57" stroke="rgba(0,0,0,.18)" strokeWidth="1.1"/>
              <line x1="27" y1="7"  x2="27" y2="59" stroke="rgba(0,0,0,.11)" strokeWidth=".8"/>
              <line x1="33" y1="7"  x2="33" y2="59" stroke="rgba(0,0,0,.11)" strokeWidth=".8"/>
              <line x1="37" y1="9"  x2="37" y2="57" stroke="rgba(0,0,0,.18)" strokeWidth="1.1"/>
              <ellipse cx="30" cy="30" rx="4" ry="3" fill="rgba(0,0,0,.09)"/>
              <rect x="20" y="9" width="3" height="46" rx="1.5" fill="rgba(255,255,255,.13)"/>
              <rect x="20" y="48" width="20" height="11" rx="0" fill="rgba(0,0,0,.22)"/>
              {/* ferrule */}
              <rect x="15" y="57" width="30" height="16" rx="5" fill="url(#st-ferrule)"/>
              <rect x="15" y="57" width="30" height="4"  rx="2" fill="rgba(255,255,255,.18)"/>
              <line x1="15" y1="64" x2="45" y2="64" stroke="rgba(0,0,0,.28)" strokeWidth="1"/>
              <line x1="15" y1="68" x2="45" y2="68" stroke="rgba(0,0,0,.28)" strokeWidth="1"/>
              {/* tang */}
              <rect x="23" y="72" width="14" height="16" rx="3" fill="#484848"/>
              <rect x="24" y="73" width="4"  height="14" rx="2" fill="rgba(255,255,255,.09)"/>
              {/* blade */}
              <path d="M30,168 L4,108 L30,86 L56,108 Z" fill="url(#st-blade)"/>
              <line x1="30" y1="88" x2="30" y2="166" stroke="rgba(0,0,0,.22)" strokeWidth="1.6"/>
              <path d="M30,168 L4,108 L30,86" fill="rgba(255,255,255,.05)"/>
              <line x1="18" y1="108" x2="29" y2="89" stroke="rgba(255,255,255,.38)" strokeWidth="1.3" strokeLinecap="round"/>
              <line x1="16" y1="122" x2="24" y2="117" stroke="rgba(255,255,255,.13)" strokeWidth=".8" strokeLinecap="round"/>
              <line x1="36" y1="134" x2="44" y2="128" stroke="rgba(255,255,255,.10)" strokeWidth=".8" strokeLinecap="round"/>
              <path d="M30,168 L56,108 L30,86" fill="rgba(0,0,0,.12)"/>
              {/* mortar on tip */}
              <ellipse cx="30" cy="160" rx="5" ry="3.5" fill="url(#st-mortar)" filter="url(#st-glow)"/>
              <ellipse cx="26" cy="120" rx="2.5" ry="1.5" fill="rgba(245,191,35,.22)" transform="rotate(-18 26 120)"/>
            </svg>
          </div>
        </div>
      </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
function App() {
  const reduceMotion = useReducedMotion();
  const [activeMenu, setActiveMenu] = useState({
    navbar: false, searchForm: false, loginForm: false, contactInfo: false,
  });
  const [activeHomeSlide, setActiveHomeSlide] = useState(0);
  const [contactStatus, setContactStatus] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const easing = useMemo(() => (reduceMotion ? 'linear' : [0.2, 0.8, 0.2, 1]), [reduceMotion]);

  const hero = useMemo(() => ({
    container: {
      hidden: { opacity: 0, y: 14 },
      show: {
        opacity: 1, y: 0,
        transition: reduceMotion
            ? { duration: 0 }
            : { duration: 0.7, ease: easing, staggerChildren: 0.08 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 14 },
      show: reduceMotion
          ? { opacity: 1, y: 0, transition: { duration: 0 } }
          : { opacity: 1, y: 0, transition: { duration: 0.55, ease: easing } },
    },
  }), [reduceMotion, easing]);

  const [homeSlides, setHomeSlides] = useState([]);
  const [aboutData,  setAboutData]  = useState(null);
  const [services,   setServices]   = useState([]);
  const [projects,   setProjects]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [slidersRes, aboutRes, servicesRes, projectsRes] = await Promise.all([
          apiFetch('/public/sliders'),
          apiFetch('/public/about'),
          apiFetch('/public/services'),
          apiFetch('/public/projects'),
        ]);

        const slidersArr = slidersRes?.data ?? slidersRes ?? [];
        setHomeSlides(slidersArr.map(s => ({
          id:          s.id,
          title:       s.title,
          description: s.subtitle || '',
          image:       storage(s.image),
          buttonText:  s.buttonText || 'Get Started',
          buttonLink:  s.buttonLink || '#about',
        })));

        const aboutRaw = aboutRes?.data ?? aboutRes ?? {};
        setAboutData(mapAbout(aboutRaw));

        const servicesArr = servicesRes?.data ?? servicesRes ?? [];
        setServices(servicesArr.map(s => ({
          id:          s.id,
          title:       s.title,
          description: s.description,
          image:       storage(s.image),
        })));

        // Keep ALL project fields for the modal
        const projectsArr = projectsRes?.data ?? projectsRes ?? [];
        setProjects(projectsArr.map(p => ({
          id:          p.id,
          title:       p.title,
          description: p.description,
          category:    p.category,
          images:      (p.images ?? []).map(storage),
          image:       storage(p.images?.[0]),
          services:    p.services ?? [],
          status:      p.status,
          location:    p.location,
          link:        p.link,
        })));
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const closeAllMenus = () =>
      setActiveMenu({ navbar: false, searchForm: false, loginForm: false, contactInfo: false });

  const toggleMenu = (menu) =>
      setActiveMenu(prev => ({
        navbar:      menu === 'navbar'      ? !prev.navbar      : false,
        searchForm:  menu === 'searchForm'  ? !prev.searchForm  : false,
        loginForm:   menu === 'loginForm'   ? !prev.loginForm   : false,
        contactInfo: menu === 'contactInfo' ? !prev.contactInfo : false,
      }));

  useEffect(() => {
    const onScroll  = () => closeAllMenus();
    const onKeyDown = (e) => { if (e.key === 'Escape' && !selectedProject) closeAllMenus(); };
    window.addEventListener('scroll',  onScroll);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll',  onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProject]);

  const motionEase   = useMemo(() => (reduceMotion ? 'linear' : [0.2, 0.8, 0.2, 1]), [reduceMotion]);
  const motionFast   = useMemo(() => ({ duration: reduceMotion ? 0 : 0.22, ease: motionEase }), [reduceMotion, motionEase]);
  const motionNormal = useMemo(() => ({ duration: reduceMotion ? 0 : 0.55, ease: motionEase }), [reduceMotion, motionEase]);

  const handleSearch  = (e) => { e.preventDefault(); };
  const handleLogin   = (e) => { e.preventDefault(); };

  const handleContact = async (e) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContactStatus('ok');
      e.target.reset();
    } catch {
      setContactStatus('error');
    }
  };

  if (loading) {
    return (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
    );
  }

  return (
      <div className="App">

        {/* ── Project Modal ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedProject && (
              <ProjectModal
                  project={selectedProject}
                  onClose={() => setSelectedProject(null)}
              />
          )}
        </AnimatePresence>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <motion.header
            className="header"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={motionNormal}
        >
          <a href="#home" className="logo">We<span>Build</span></a>

          <nav className={`navbar ${activeMenu.navbar ? 'active' : ''}`}>
            <a href="#home">home</a>
            <a href="#about">about</a>
            <a href="#services">services</a>
            <a href="#projects">projects</a>
            <a href="#contact">contact</a>
          </nav>

          <div className="icons">
            <div id="menu-btn"    className="fas fa-bars"        onClick={() => toggleMenu('navbar')}      />
            <div id="info-btn"    className="fas fa-info-circle" onClick={() => toggleMenu('contactInfo')} title="Contact Info" />
            <div id="search-btn"  className="fas fa-search"      onClick={() => toggleMenu('searchForm')}  title="Search" />
            <div id="login-btn"   className="fas fa-user"         onClick={() => toggleMenu('loginForm')}   title="Login" />
          </div>

          <AnimatePresence>
            {activeMenu.searchForm && (
                <motion.form
                    key="search"
                    className="search-form modern-popover"
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={motionFast}
                >
                  <input type="search" name="search" placeholder="search here..." id="search-box" autoFocus />
                  <label htmlFor="search-box" className="fas fa-search" />
                </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeMenu.loginForm && (
                <motion.form
                    key="login"
                    className="login-form modern-popover"
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={motionFast}
                >
                  <h3>login form</h3>
                  <input type="email"    name="email"    placeholder="enter your email"    className="box" />
                  <input type="password" name="password" placeholder="enter your password" className="box" />
                  <div className="flex">
                    <input type="checkbox" name="remember" id="remember-me" />
                    <label htmlFor="remember-me">remember me</label>
                    <a href="#forgot">forgot password?</a>
                  </div>
                  <input type="submit" value="login now" className="btn" />
                  <p>don't have an account <a href="#register">create one!</a></p>
                </motion.form>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── Contact Info Sidebar ───────────────────────────────────────────── */}
        <AnimatePresence>
          {activeMenu.contactInfo && (
              <>
                <motion.div
                    className="overlay"
                    onClick={closeAllMenus}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={motionFast}
                />
                <motion.aside
                    className="contact-info-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Contact information"
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 24, opacity: 0 }}
                    transition={motionNormal}
                >
                  <button type="button" className="contact-close" onClick={closeAllMenus} aria-label="Close">
                    <i className="fas fa-times" />
                  </button>
                  <div className="info">
                    <i className="fas fa-phone" />
                    <h3>phone number</h3>
                    <p>{aboutData?.phone || '+123-456-7890'}</p>
                  </div>
                  <div className="info">
                    <i className="fas fa-envelope" />
                    <h3>email address</h3>
                    <p>{aboutData?.email || 'info@webuild.com'}</p>
                  </div>
                  <div className="info">
                    <i className="fas fa-map-marker-alt" />
                    <h3>office address</h3>
                    <p>{aboutData?.address || 'Mumbai, India - 400104'}</p>
                  </div>
                  <div className="share">
                    <a href={aboutData?.facebook  || '#'} className="fab fa-facebook-f"  aria-label="Facebook"  />
                    <a href={aboutData?.twitter   || '#'} className="fab fa-twitter"      aria-label="Twitter"   />
                    <a href={aboutData?.instagram || '#'} className="fab fa-instagram"    aria-label="Instagram" />
                    <a href={aboutData?.linkedin  || '#'} className="fab fa-linkedin"     aria-label="LinkedIn"  />
                  </div>
                </motion.aside>
              </>
          )}
        </AnimatePresence>

        {/* ── Home / Hero Slider ─────────────────────────────────────────────── */}
        {homeSlides.length > 0 && (
            <section className="home" id="home">
              <ParticleBackground />
              <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation
                  loop={homeSlides.length > 1}
                  grabCursor
                  onSwiper={swiper => setActiveHomeSlide(swiper.realIndex)}
                  onSlideChange={swiper => setActiveHomeSlide(swiper.realIndex)}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  className="home-slider"
              >
                {homeSlides.map((slide, index) => (
                    <SwiperSlide
                        key={slide.id}
                        className="slide"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                      <motion.div
                          className="content"
                          variants={hero.container}
                          initial="hidden"
                          animate={activeHomeSlide === index ? 'show' : 'hidden'}
                      >
                        <motion.h3 variants={hero.item}>{slide.title}</motion.h3>
                        <motion.p  variants={hero.item}>{slide.description}</motion.p>
                        <motion.a
                            variants={hero.item}
                            href={slide.buttonLink}
                            className="btn"
                            whileHover={reduceMotion ? undefined : { y: -1 }}
                            whileTap={reduceMotion   ? undefined : { scale: 0.98 }}
                        >
                          {slide.buttonText}
                        </motion.a>
                      </motion.div>
                    </SwiperSlide>
                ))}
              </Swiper>
              <MottoRibbon />
            </section>
        )}

        {/* ── About ──────────────────────────────────────────────────────────── */}
        {aboutData && (
            <section className="about" id="about">
              <Reveal>
                <h1 className="heading">about us</h1>
              </Reveal>

              <Reveal>
                <div className="row">
                  {aboutData.heroImage ? (
                      <div className="image-wrapper">
                        <img src={aboutData.heroImage} alt={aboutData.title} className="about-hero-img" />
                      </div>
                  ) : (
                      <div className="video">
                        <video src="https://www.w3schools.com/html/mov_bbb.mp4" loop muted autoPlay />
                      </div>
                  )}
                  <div className="content">
                    <h3>{aboutData.title}</h3>
                    <p>{aboutData.description}</p>
                    {aboutData.mission && <p className="mission-text"><em>{aboutData.mission}</em></p>}
                    <a href="#services" className="btn">our services</a>
                  </div>
                </div>
              </Reveal>

              <StatBoxContainer stats={aboutData.stats} reduceMotion={reduceMotion} easing={easing} />
            </section>
        )}

        {/* ── Services ───────────────────────────────────────────────────────── */}
        {services.length > 0 && (
            <section className="services" id="services">
              <Reveal>
                <h1 className="heading">our services</h1>
              </Reveal>

              <motion.div
                  className="box-container"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-120px' }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } },
                  }}
              >
                {services.map((service) => (
                    <motion.div
                        key={service.id}
                        className="box card"
                        variants={{
                          hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
                          show: {
                            opacity: 1, y: 0, filter: 'blur(0px)',
                            transition: reduceMotion ? { duration: 0 } : { duration: 0.5, ease: easing },
                          },
                        }}
                        whileHover={reduceMotion ? undefined : { y: -6, rotate: -0.2 }}
                        whileTap={reduceMotion   ? undefined : { scale: 0.99 }}
                    >
                      <img src={service.image} alt={service.title} />
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </motion.div>
                ))}
              </motion.div>
            </section>
        )}

        {/* ── Projects ───────────────────────────────────────────────────────── */}
        {projects.length > 0 && (
            <section className="projects" id="projects">
              <Reveal>
                <h1 className="heading">our projects</h1>
              </Reveal>

              <motion.div
                  className="box-container"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-120px' }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } },
                  }}
              >
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        className="box card"
                        onClick={() => setSelectedProject(project)}
                        style={{ cursor: 'pointer' }}
                        variants={{
                          hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
                          show: {
                            opacity: 1, y: 0, filter: 'blur(0px)',
                            transition: reduceMotion ? { duration: 0 } : { duration: 0.55, ease: easing },
                          },
                        }}
                        whileHover={reduceMotion ? undefined : { y: -6 }}
                        whileTap={reduceMotion   ? undefined : { scale: 0.99 }}
                    >
                      <div className="image">
                        <img src={project.image} alt={project.title} />
                      </div>
                      <div className="content">
                        <div className="info">
                          <h3>{project.title}</h3>
                          <p>{project.category}</p>
                        </div>
                        <i className="fas fa-plus" />
                      </div>
                    </motion.div>
                ))}
              </motion.div>
            </section>
        )}

        {/* ── Contact ────────────────────────────────────────────────────────── */}
        <section className="contact" id="contact">
          <Reveal>
            <h1 className="heading">contact us</h1>
          </Reveal>

          <Reveal>
            <div className="row">
              <motion.iframe
                  className="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15076.89592087332!2d72.8319697277345!3d19.14167056419224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63aceef0c69%3A0x2aa80cf2287dfa3b!2sJogeshwari%20West%2C%20Mumbai%2C%20Maharashtra%20400047!5e0!3m2!1sen!2sin!4v1641716772852!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  title="Office Location"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: easing }}
              />

              <motion.form
                  onSubmit={handleContact}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: easing, delay: reduceMotion ? 0 : 0.06 }}
              >
                <h3>get in touch</h3>
                <input type="text"  name="name"    placeholder="name"    className="box" required />
                <input type="email" name="email"   placeholder="email"   className="box" required />
                <input type="tel"   name="phone"   placeholder="phone"   className="box" required />
                <textarea name="message" placeholder="message" className="box" cols="30" rows="10" required />

                {contactStatus === 'ok' && (
                    <p style={{ color: 'var(--yellow)', fontSize: '1.5rem', marginTop: '1rem' }}>
                      ✓ Message sent successfully!
                    </p>
                )}
                {contactStatus === 'error' && (
                    <p style={{ color: '#e55', fontSize: '1.5rem', marginTop: '1rem' }}>
                      ✗ Failed to send. Please try again.
                    </p>
                )}

                <input
                    type="submit"
                    value={contactStatus === 'sending' ? 'sending...' : 'send message'}
                    className="btn"
                    disabled={contactStatus === 'sending'}
                />
              </motion.form>
            </div>
          </Reveal>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <section className="footer">
          <div className="links">
            <a className="btn" href="#home">home</a>
            <a className="btn" href="#about">about</a>
            <a className="btn" href="#services">services</a>
            <a className="btn" href="#projects">projects</a>
            <a className="btn" href="#contact">contact</a>
          </div>
          <div className="credit">
            powered by <span>{aboutData?.title || 'WeBuild'}</span>
          </div>
        </section>

        <BackToTop />
        <ScrollTrowel reduceMotion={reduceMotion} />
      </div>
  );
}

export default App;