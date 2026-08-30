import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export const ChromaGrid = ({
  items,
  onItemClick,
  className = '',
  radius = 300,
  columns = 4,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo = [
    {
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, #4F46E5, #0f172a)',
      location: 'Stanford University',
      skills: ['React', 'Node.js', 'Python']
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
      title: 'Jordan Chen',
      subtitle: 'AI/ML Engineer',
      handle: '@jordanchen',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #0f172a)',
      location: 'MIT',
      skills: ['PyTorch', 'TensorFlow', 'FastAPI']
    },
    {
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, #F59E0B, #0f172a)',
      location: 'UC Berkeley',
      skills: ['Figma', 'TailwindCSS', 'Three.js']
    },
    {
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
      title: 'Casey Park',
      subtitle: 'Cloud Architect',
      handle: '@caseypark',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg, #EF4444, #0f172a)',
      location: 'Carnegie Mellon',
      skills: ['AWS', 'Docker', 'Kubernetes']
    }
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: 1,
        duration: fadeOut,
        overwrite: true
      });
    }
  };

  const handleCardClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={c.id || i}
          className="chroma-card group"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c)}
          style={{
            '--card-border': c.borderColor || '#3b82f6',
            '--card-gradient': c.gradient || 'linear-gradient(145deg, #1e293b, #0f172a)',
            cursor: 'pointer'
          }}
        >
          <div className="chroma-img-wrapper relative">
            {c.image ? (
              <img src={c.image} alt={c.title} loading="lazy" />
            ) : (
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-5xl font-black text-white uppercase shadow-inner">
                {c.title?.charAt(0) || 'U'}
              </div>
            )}

            {c.matchPercentage !== null && c.matchPercentage !== undefined && (
              <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <span>🔥</span> {c.matchPercentage}% Match
              </div>
            )}
          </div>

          <footer className="chroma-info">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="name group-hover:text-blue-400 transition-colors">{c.title}</h3>
                {c.handle && <span className="handle">{c.handle}</span>}
              </div>
              <p className="role mt-1">{c.subtitle}</p>
              {c.location && <p className="location mt-0.5">{c.location}</p>}
            </div>

            {c.skills && c.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.skills.slice(0, 3).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/5"
                  >
                    {typeof sk === 'string' ? sk : sk.name}
                  </span>
                ))}
                {c.skills.length > 3 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400">
                    +{c.skills.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors flex items-center gap-1">
                <span>💬</span> Invite to Team
              </span>
              <span className="text-xs text-blue-400 font-extrabold group-hover:translate-x-1 transition-transform">
                Connect →
              </span>
            </div>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
