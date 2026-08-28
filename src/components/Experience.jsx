import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Clipboard, ExternalLink, Image, Link2, Moon, Search, Share2, Sun } from 'lucide-react';
import { useSite } from '../store/SiteStore';

const REVEAL_SELECTOR = [
  '.section-heading', '.service-card', '.project-card', '.home-process article',
  '.home-testimonial', '.plan-card', '.faq-list article', '.contact-options > a',
  '.content-block', '.how-quote article', '.question-preview > div', '.case-facts > div',
  '.gallery-mosaic > button', '.gallery-thumbs > button', '.check-list > li',
  '.admin-page-head', '.metric-grid > article', '.admin-card', '.table-row',
  '.builder-block', '.media-grid > article', '.category-admin-grid > article'
].join(',');

export function MotionSystem() {
  const { pathname } = useLocation();

  useEffect(() => {
    const marquee = document.querySelector('.marquee > div');
    if (marquee && !marquee.dataset.loopReady) {
      const label = marquee.textContent.replace(/\s+/g, ' ').trim();
      const content = marquee.innerHTML;
      marquee.innerHTML = `<span>${content}</span><span aria-hidden="true">${content}</span><span aria-hidden="true">${content}</span>`;
      marquee.dataset.loopReady = 'true';
      marquee.setAttribute('aria-label', label);
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = [...document.querySelectorAll(REVEAL_SELECTOR)];
    nodes.forEach((node, index) => {
      node.style.setProperty('--reveal-index', String(index % 6));
      node.classList.add('motion-ready');
      if (reduced) node.classList.add('is-visible');
    });
    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const surface = document.querySelector('#main-content > main, .admin-main');
    if (!surface) return undefined;
    surface.classList.remove('premium-page-enter');
    requestAnimationFrame(() => surface.classList.add('premium-page-enter'));
    const timer = window.setTimeout(() => surface.classList.remove('premium-page-enter'), 900);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counters = [...document.querySelectorAll('.hero-stats b, .metric-grid article > b')];
    if (reduced || !counters.length) return undefined;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      const node = entry.target;
      const original = node.textContent.trim();
      const match = original.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
      if (!match) return;
      const [, prefix, numeric, suffix] = match;
      const target = Number(numeric.replace(',', '.'));
      const decimals = numeric.includes('.') || numeric.includes(',') ? 1 : 0;
      const start = performance.now();
      node.dataset.counted = 'true';
      const tick = now => {
        const progress = Math.min(1, (now - start) / 1250);
        const eased = 1 - Math.pow(1 - progress, 4);
        node.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick); else node.textContent = original;
      };
      requestAnimationFrame(tick); observer.unobserve(node);
    }), { threshold: .6 });
    counters.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const art = document.querySelector('.hero-art');
    if (!art || window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return undefined;
    let frame;
    const move = event => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = art.getBoundingClientRect();
        art.style.setProperty('--hero-x', `${((event.clientX - box.left) / box.width - .5) * 14}px`);
        art.style.setProperty('--hero-y', `${((event.clientY - box.top) / box.height - .5) * 14}px`);
      });
    };
    const reset = () => { art.style.setProperty('--hero-x', '0px'); art.style.setProperty('--hero-y', '0px'); };
    art.addEventListener('pointermove', move, { passive: true });
    art.addEventListener('pointerleave', reset);
    return () => { cancelAnimationFrame(frame); art.removeEventListener('pointermove', move); art.removeEventListener('pointerleave', reset); };
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return undefined;
    let frame;
    let activeTilt;
    let activeMagnet;
    const move = event => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
        const tilt = event.target.closest?.('.project-card,.service-card,.home-process article,.contact-options>a,.admin-card');
        if (activeTilt && activeTilt !== tilt) {
          activeTilt.classList.remove('premium-tilt');
          activeTilt.style.removeProperty('--tilt-x'); activeTilt.style.removeProperty('--tilt-y');
        }
        activeTilt = tilt;
        if (tilt) {
          const box = tilt.getBoundingClientRect();
          tilt.style.setProperty('--tilt-x', `${((event.clientY - box.top) / box.height - .5) * -5}deg`);
          tilt.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - .5) * 6}deg`);
          tilt.classList.add('premium-tilt');
        }
        const magnet = event.target.closest?.('.button:not(.wide),.icon-button,.text-link');
        if (activeMagnet && activeMagnet !== magnet) {
          activeMagnet.style.removeProperty('--magnet-x'); activeMagnet.style.removeProperty('--magnet-y');
        }
        activeMagnet = magnet;
        if (magnet) {
          const box = magnet.getBoundingClientRect();
          magnet.style.setProperty('--magnet-x', `${(event.clientX - box.left - box.width / 2) * .12}px`);
          magnet.style.setProperty('--magnet-y', `${(event.clientY - box.top - box.height / 2) * .12}px`);
        }
      });
    };
    const leave = () => {
      activeTilt?.classList.remove('premium-tilt');
      activeTilt?.style.removeProperty('--tilt-x'); activeTilt?.style.removeProperty('--tilt-y');
      activeMagnet?.style.removeProperty('--magnet-x'); activeMagnet?.style.removeProperty('--magnet-y');
      activeTilt = null; activeMagnet = null;
    };
    const press = event => {
      const control = event.target.closest?.('.button,.icon-button,.service-card,.project-card');
      if (!control) return;
      const box = control.getBoundingClientRect();
      control.style.setProperty('--press-x', `${event.clientX - box.left}px`);
      control.style.setProperty('--press-y', `${event.clientY - box.top}px`);
      control.classList.remove('premium-press');
      requestAnimationFrame(() => control.classList.add('premium-press'));
      window.setTimeout(() => control.classList.remove('premium-press'), 520);
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', press, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame); leave();
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerdown', press);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return null;
}

function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const area = document.createElement('textarea');
  area.value = value; area.style.position = 'fixed'; area.style.opacity = '0';
  document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
  return Promise.resolve();
}

export function GlobalContextMenu({ onSearch }) {
  const { theme, setTheme, notify } = useSite();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const pressRef = useRef(null);
  const [menu, setMenu] = useState(null);

  const openMenu = (x, y, target, source = 'mouse') => {
    if (!(target instanceof Element) || target.closest('input, textarea, [contenteditable="true"], .context-menu')) return;
    const anchor = target.closest('a[href]');
    const image = target.closest('img');
    const selection = window.getSelection()?.toString().trim();
    setMenu({ x, y, anchor: anchor?.href || '', image: image?.currentSrc || image?.src || '', selection, source });
  };

  useEffect(() => {
    const context = event => {
      if (event.target.closest?.('input, textarea, [contenteditable="true"]')) return;
      event.preventDefault(); openMenu(event.clientX, event.clientY, event.target);
    };
    const down = event => {
      if (event.pointerType === 'mouse' || event.target.closest?.('input, textarea, [contenteditable="true"], .context-menu')) return;
      const start = { x: event.clientX, y: event.clientY, target: event.target };
      pressRef.current = { ...start, timer: window.setTimeout(() => {
        navigator.vibrate?.(18); openMenu(start.x, start.y, start.target, 'touch'); pressRef.current = null;
      }, 560) };
    };
    const move = event => {
      const press = pressRef.current;
      if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) {
        clearTimeout(press.timer); pressRef.current = null;
      }
    };
    const cancel = () => { if (pressRef.current) clearTimeout(pressRef.current.timer); pressRef.current = null; };
    document.addEventListener('contextmenu', context);
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerup', cancel, { passive: true });
    document.addEventListener('pointercancel', cancel, { passive: true });
    return () => {
      document.removeEventListener('contextmenu', context); document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', cancel);
      document.removeEventListener('pointercancel', cancel); cancel();
    };
  }, []);

  useEffect(() => {
    if (!menu) return undefined;
    const close = event => { if (!menuRef.current?.contains(event.target)) setMenu(null); };
    const key = event => { if (event.key === 'Escape') setMenu(null); };
    window.addEventListener('pointerdown', close); window.addEventListener('keydown', key);
    window.addEventListener('resize', close); window.addEventListener('scroll', close, true);
    requestAnimationFrame(() => menuRef.current?.querySelector('button')?.focus());
    return () => { window.removeEventListener('pointerdown', close); window.removeEventListener('keydown', key); window.removeEventListener('resize', close); window.removeEventListener('scroll', close, true); };
  }, [menu]);

  const items = useMemo(() => {
    if (!menu) return [];
    const done = message => notify(message);
    const result = [];
    if (menu.anchor) result.push(
      { label: 'Abrir enlace', icon: ExternalLink, action: () => { const url = new URL(menu.anchor); url.origin === location.origin ? navigate(`${url.pathname}${url.search}${url.hash}`) : window.open(menu.anchor, '_blank', 'noopener,noreferrer'); } },
      { label: 'Copiar enlace', icon: Link2, action: () => copyText(menu.anchor).then(() => done('Enlace copiado')) }
    );
    if (menu.image) result.push(
      { label: 'Ver imagen', icon: Image, action: () => window.open(menu.image, '_blank', 'noopener,noreferrer') },
      { label: 'Copiar imagen', icon: Clipboard, action: () => copyText(menu.image).then(() => done('Dirección de imagen copiada')) }
    );
    if (menu.selection) result.push({ label: 'Copiar selección', icon: Clipboard, action: () => copyText(menu.selection).then(() => done('Texto copiado')) });
    result.push(
      { label: 'Buscar en el sitio', icon: Search, action: onSearch },
      { label: 'Cotizar un proyecto', icon: BriefcaseBusiness, action: () => navigate('/servicios') },
      { label: theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro', icon: theme === 'dark' ? Sun : Moon, action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
      { label: 'Copiar esta página', icon: Share2, action: () => copyText(location.href).then(() => done('Enlace de la página copiado')) }
    );
    return result;
  }, [menu, navigate, notify, onSearch, setTheme, theme]);

  if (!menu) return null;
  const left = Math.max(12, Math.min(menu.x, window.innerWidth - 286));
  const top = Math.max(12, Math.min(menu.y, window.innerHeight - Math.min(390, items.length * 48 + 62)));
  return <div ref={menuRef} className={`context-menu global-context ${menu.source === 'touch' ? 'touch' : ''}`} style={{ left, top }} role="menu" aria-label="Acciones rápidas">
    <div className="context-menu-head"><span>JEP / ACCIONES</span><kbd>ESC</kbd></div>
    {items.map(({ label, icon: Icon, action }, index) => <button role="menuitem" key={`${label}-${index}`} onClick={() => { setMenu(null); action?.(); }}><Icon size={16}/><span>{label}</span></button>)}
    <small className="context-hint">Clic derecho · Mantén pulsado en móvil</small>
  </div>;
}
