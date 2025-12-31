import React, { useEffect, useRef, useState } from "react";
import { getBoolean, getNumber, removeItem, setItem, setJson } from "../services/storage";

const OPTION_CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'ui', label: 'UI' },
];

export default function OptionsMenu({ style = {} }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const [shinyEnabled, setShinyEnabled] = useState(false);
  const [scale, setScale] = useState(50);
  const [activeCategory, setActiveCategory] = useState('general');

  const scaleWrapRef = useRef(null);
  const startScaleRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    getBoolean('shinySprites', false).then((value) => {
      if (mounted) setShinyEnabled(value);
    });
    getNumber('uiScaleV2', null).then((saved) => {
      if (!mounted) return;
      if (Number.isFinite(saved)) {
        setScale(clamp(saved));
        return;
      }
      getNumber('uiScale', null).then((legacy) => {
        if (!mounted) return;
        const initial = Number.isFinite(legacy) ? clamp(Math.round(legacy / 2)) : 50;
        setScale(initial);
        setItem("uiScaleV2", String(initial)).catch(() => {});
        removeItem("uiScale").catch(() => {});
      });
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // Map slider range [0,100] to visual scale [0.5,1.5]
    // so 50% appears as the normal 100% size.
    document.body.style.zoom = 0.5 + scale / 100;
    setItem("uiScaleV2", String(scale)).catch(() => {});
  }, [scale]);

  useEffect(() => {
    const onUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        if (scaleWrapRef.current) {
          scaleWrapRef.current.style.transform = "";
          scaleWrapRef.current.style.transformOrigin = "";
        }
      }
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setActiveCategory('general');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function onToggleShiny(next){
    try {
      setShinyEnabled(next);
      setJson('shinySprites', next).catch(() => {});
      try { window.dispatchEvent(new CustomEvent('shiny-global-changed', { detail: { enabled: next } })); } catch {}
    } finally {
      // keep menu open
    }
  }

  function onOpenColorPicker() {
    try { window.dispatchEvent(new Event('open-color-picker')); } catch {}
    setOpen(false);
  }

  // Styles
  const btnStyle = {
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid var(--divider)",
    background: "linear-gradient(180deg,var(--surface),var(--card))",
    color: "var(--text)",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "var(--shadow-1)",
  };
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.72)',
    zIndex: 20000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  };
  const modalStyle = {
    position: 'relative',
    display: 'flex',
    width: 'min(1080px, 90vw)',
    height: 'min(720px, 85vh)',
    maxHeight: '85vh',
    background: 'var(--surface)',
    color: 'var(--text)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-2)',
    overflow: 'hidden',
  };
  const navStyle = {
    flex: '0 0 25%',
    minWidth: 200,
    borderRight: '1px solid var(--divider)',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(0,0,0,0.15)',
    padding: '24px 0',
    gap: 4,
  };
  const contentStyle = {
    flex: '1 1 auto',
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    overflowY: 'auto',
  };
  const headingStyle = {
    fontSize: 24,
    fontWeight: 800,
    margin: 0,
  };
  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  };
  const closeButtonStyle = {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 999,
    border: '1px solid var(--divider)',
    background: 'var(--surface)',
    color: 'var(--text)',
    boxShadow: 'var(--shadow-1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    cursor: 'pointer',
  };
  const categories = OPTION_CATEGORIES;
  const activeCategoryMeta = categories.find((cat) => cat.id === activeCategory) || categories[0] || OPTION_CATEGORIES[0];

  const renderCategoryContent = () => {
    if (activeCategory === 'general') {
      return (
        <div style={sectionStyle}>
          <ToggleButton label="Shiny Sprites" value={!!shinyEnabled} onToggle={onToggleShiny} />
          <Divider style={{ margin: '18px 0' }} />
          <ActionButton label="Choose Colors" onClick={onOpenColorPicker} />
        </div>
      );
    }

    if (activeCategory === 'ui') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div ref={scaleWrapRef} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text)', fontWeight: 700 }}>Element Scale</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 12 }}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={scale}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setScale(Number.isFinite(v) ? clamp(v) : 0);
                  }}
                  style={{
                    width: 50,
                    textAlign: 'right',
                    background: 'transparent',
                    border: '1px solid var(--divider)',
                    borderRadius: 6,
                    color: 'var(--text)',
                    fontSize: 12,
                    padding: '4px 6px',
                  }}
                />
                %
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={scale}
              onChange={(e) => {
                const v = clamp(parseInt(e.target.value, 10));
                setScale(v);
                if (draggingRef.current && scaleWrapRef.current) {
                  const prev = 0.5 + startScaleRef.current / 100;
                  const curr = 0.5 + v / 100;
                  scaleWrapRef.current.style.transform = `scale(${prev / curr})`;
                  scaleWrapRef.current.style.transformOrigin = '0 0';
                }
              }}
              onMouseDown={() => {
                draggingRef.current = true;
                startScaleRef.current = scale;
              }}
              onTouchStart={() => {
                draggingRef.current = true;
                startScaleRef.current = scale;
              }}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Adjust the interface scale to suit your display.</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', ...style }}>
      <button
        style={btnStyle}
        onClick={() => setOpen((v) => !v)}
        title="Options"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Options ▾
      </button>

      {open && (
        <div style={overlayStyle} onClick={() => setOpen(false)}>
          <div
            style={modalStyle}
            role="dialog"
            aria-modal="true"
            aria-label="Options"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={closeButtonStyle}
              onClick={() => setOpen(false)}
              aria-label="Close options"
            >
              ✕
            </button>
            <div style={navStyle}>
              {categories.map((cat) => (
                <NavButton
                  key={cat.id}
                  label={cat.label}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>
            <div style={contentStyle}>
              <div>
                <h2 style={headingStyle}>{activeCategoryMeta.label}</h2>
              </div>
              {renderCategoryContent()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Divider({ style = {} }) {
  return <div style={{ width: '100%', height: 1, background: 'var(--divider)', ...style }} />;
}

function NavButton({ label, active = false, onClick }) {
  const [hover, setHover] = useState(false);
  const baseStyle = {
    position: 'relative',
    border: 'none',
    background: active ? 'rgba(255,255,255,0.12)' : hover ? 'rgba(255,255,255,0.06)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text)',
    fontWeight: 800,
    fontSize: 16,
    padding: '12px 24px 12px 32px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 160ms ease, color 160ms ease',
  };
  const indicatorStyle = {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 4,
    borderRadius: 999,
    background: 'var(--accent)',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={baseStyle}
      aria-current={active ? 'page' : undefined}
    >
      {active && <span style={indicatorStyle} />}
      <span style={{ position: 'relative' }}>{label}</span>
    </button>
  );
}

function BaseOptionButton({ children, onClick, disabled = false, role, ariaChecked, ariaPressed, style = {} }) {
  const [hover, setHover] = useState(false);
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 18px',
    borderRadius: 12,
    border: '1px solid var(--divider)',
    background: hover ? 'rgba(255,255,255,0.08)' : 'linear-gradient(180deg,var(--surface),var(--card))',
    color: 'var(--text)',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    transition: 'background 160ms ease, opacity 160ms ease',
    boxShadow: 'var(--shadow-1)',
    textAlign: 'left',
  };
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...baseStyle, ...style }}
      role={role}
      aria-checked={ariaChecked}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
}

function ActionButton({ label, onClick, disabled = false }) {
  return (
    <BaseOptionButton onClick={onClick} disabled={disabled}>
      <span>{label}</span>
      <span style={{ fontSize: 18, color: 'var(--muted)' }}>›</span>
    </BaseOptionButton>
  );
}

function ToggleButton({ label, value, onToggle, disabled = false, busy = false, style = {} }) {
  const active = !!value;
  const handleClick = () => {
    if (disabled || busy) return;
    onToggle(!active);
  };
  const trackBackground = disabled
    ? 'rgba(255,255,255,0.05)'
    : active
    ? 'var(--accent)'
    : 'rgba(255,255,255,0.12)';
  const thumbLeft = active ? 22 : 2;
  const thumbColor = disabled ? 'var(--muted)' : active ? 'var(--surface)' : 'var(--muted)';
  const trackStyle = {
    position: 'relative',
    width: 44,
    height: 22,
    borderRadius: 999,
    border: '1px solid var(--divider)',
    background: trackBackground,
    transition: 'background 160ms ease',
  };
  const thumbStyle = {
    position: 'absolute',
    top: 2,
    left: thumbLeft,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: thumbColor,
    transition: 'left 160ms ease, background 160ms ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.45)',
  };
  return (
    <BaseOptionButton
      onClick={handleClick}
      disabled={disabled || busy}
      role="switch"
      ariaChecked={active}
      ariaPressed={active}
      style={style}
    >
      <span>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={trackStyle}>
          <span style={thumbStyle} />
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--muted)' }}>
          {busy ? 'Working…' : active ? 'On' : 'Off'}
        </span>
      </span>
    </BaseOptionButton>
  );
}
