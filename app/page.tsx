'use client';

import { useEffect, useRef, useCallback } from 'react';
import s from './page.module.css';

/* ── helpers ─────────────────────────────────────────────── */
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t: number)  { return Math.pow(t, 2.5); }
function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

const PETAL_CHARS  = ['🌸', '🌷', '✿', '❀', '🌺'];
const SPARK_COLORS = ['#D4AF37', '#C8960C', '#F0C8D8', '#E8D4A0', '#B8860B'];

/* ── Scattered lotus-small watermark backdrop ────────────── */
function LotusWatermark() {
  const marks = [
    { t:  '4%', l:  '7%', s: 44, r:  12 }, { t:  '9%', l: '64%', s: 38, r: -20 },
    { t: '16%', l: '30%', s: 42, r:  38 }, { t: '21%', l: '80%', s: 34, r: -45 },
    { t: '43%', l: '86%', s: 36, r:  58 }, { t: '50%', l: '18%', s: 42, r: -32 },
    { t: '70%', l:  '7%', s: 36, r:  48 }, { t: '76%', l: '76%', s: 42, r: -52 },
    { t: '82%', l: '26%', s: 38, r:  18 }, { t: '88%', l: '54%', s: 40, r: -38 },
    { t: '26%', l: '90%', s: 32, r:  32 }, { t: '54%', l: '34%', s: 30, r: -48 },
  ];
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }} aria-hidden="true">
      {marks.map((m, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src="/lotus-small.png" alt=""
          style={{ position:'absolute', top:m.t, left:m.l, width:m.s, height:'auto', opacity:0.4, transform:`rotate(${m.r}deg)` }}
        />
      ))}
    </div>
  );
}

/* ── Wreath SVG ──────────────────────────────────────────── */
function WreathCircle() {
  const cx = 160, cy = 160;
  const leaves: { x: number; y: number; rot: number }[] = [];
  for (let deg = 46; deg <= 314; deg += 11) {
    const rad = (deg * Math.PI) / 180;
    leaves.push({ x: +(cx + 122 * Math.cos(rad)).toFixed(2), y: +(cy + 122 * Math.sin(rad)).toFixed(2), rot: deg });
  }
  const dotRing: { x: number; y: number; big: boolean }[] = [];
  for (let i = 0; i < 30; i++) {
    const rad = ((i * 12) * Math.PI) / 180;
    dotRing.push({ x: +(cx + 148 * Math.cos(rad)).toFixed(2), y: +(cy + 148 * Math.sin(rad)).toFixed(2), big: i % 3 === 0 });
  }
  return (
    <svg viewBox="0 0 320 320" className={s.wreathSvg} aria-hidden="true">
      <g>
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="26s" repeatCount="indefinite"/>
        {dotRing.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.big ? 2.5 : 1.3}
            fill={d.big ? 'rgba(215,125,165,.72)' : 'rgba(215,125,165,.38)'}/>
        ))}
      </g>
      <circle cx={cx} cy={cy} r={132} fill="none" stroke="rgba(212,175,55,.42)" strokeWidth="1.4"/>
      <circle cx={cx} cy={cy} r={140} fill="none" stroke="rgba(212,175,55,.18)" strokeWidth="1"/>
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x},${l.y}) rotate(${l.rot})`}>
          <path d="M 0,-9 C 4.5,-5 4.5,4 0,8 C -4.5,4 -4.5,-5 0,-9 Z"
            fill="rgba(105,135,78,.58)" stroke="rgba(80,110,55,.12)" strokeWidth="0.3"/>
        </g>
      ))}
    </svg>
  );
}

/* ── Gold sparkle dots on cover ──────────────────────────── */
function SparkleField() {
  const dots = [
    { x: 358, y:  52, r: 1.5, o: .65 }, { x: 318, y:  78, r: 1.0, o: .45 },
    { x: 398, y:  88, r: 1.2, o: .55 }, { x: 378, y: 128, r: 1.0, o: .40 },
    { x: 342, y: 108, r: 1.5, o: .50 }, { x: 418, y:  58, r: 1.0, o: .55 },
    { x: 435, y: 105, r: 1.2, o: .38 }, { x: 460, y: 140, r: 1.0, o: .35 },
    { x:  44, y: 265, r: 1.2, o: .45 }, { x:  24, y: 305, r: 1.0, o: .38 },
    { x:  62, y: 335, r: 1.5, o: .52 }, { x:  30, y: 355, r: 1.0, o: .30 },
    { x:  52, y: 385, r: 1.2, o: .45 }, { x:  18, y: 420, r: 1.0, o: .28 },
    { x: 440, y: 360, r: 1.0, o: .38 }, { x: 458, y: 410, r: 1.2, o: .45 },
    { x: 190, y: 760, r: 1.0, o: .35 }, { x: 240, y: 785, r: 1.5, o: .40 },
    { x: 290, y: 768, r: 1.0, o: .35 }, { x: 140, y: 778, r: 1.2, o: .30 },
  ];
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:1 }} aria-hidden="true">
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={`rgba(212,175,55,${d.o})`}/>)}
    </svg>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function Home() {
  const coverRef  = useRef<HTMLDivElement>(null);
  const page0Ref  = useRef<HTMLDivElement>(null);  // Families / blessing
  const page1Ref  = useRef<HTMLDivElement>(null);  // Dham — 6 May
  const page2Ref  = useRef<HTMLDivElement>(null);  // Mehndi — 7 May
  const page3Ref  = useRef<HTMLDivElement>(null);  // Wedding — 8 May
  const progRef   = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const sh = document.documentElement.scrollHeight - window.innerHeight;
    if (sh <= 0) return;
    const p = window.scrollY / sh;
    if (progRef.current) progRef.current.style.width = (p * 100) + '%';

    const oE = easeOut(clamp(p / 0.42, 0, 1));
    if (coverRef.current) {
      const ry = -92 * oE;
      const op = oE > 0.80 ? Math.max(0, (1 - oE) / 0.20) : 1;
      coverRef.current.style.transform = `perspective(1400px) rotateY(${ry.toFixed(2)}deg)`;
      coverRef.current.style.opacity   = op.toFixed(3);
      coverRef.current.style.pointerEvents = oE > 0.88 ? 'none' : 'auto';
    }

    const pages = [page0Ref, page1Ref, page2Ref, page3Ref];
    const RS = 0.42, RW = 0.58, PW = RW / pages.length; // PW = 0.145
    pages.forEach((ref, i) => {
      const el = ref.current; if (!el) return;
      const r = (p - RS - i * PW) / PW;
      let tx: number, op: number, ry: number;
      if      (r < 0)    { tx = 100;  op = 0; ry = -10; }
      else if (r < 0.30) { const t = easeOut(r / 0.30); tx = 100*(1-t); op = t; ry = -10*(1-t); }
      else if (r < 0.70) { tx = 0; op = 1; ry = 0; }
      else if (r < 1)    { const t = easeIn((r-0.70)/0.30); tx = -100*t; op = 1-t; ry = 10*t; }
      else               { tx = -100; op = 0; ry = 10; }
      el.style.transform = `perspective(1200px) translateX(${tx.toFixed(1)}%) rotateY(${ry.toFixed(1)}deg)`;
      el.style.opacity   = op.toFixed(3);
    });
  }, []);

  useEffect(() => {
    let raf = false;
    const onScroll = () => { if (!raf) { raf = true; requestAnimationFrame(() => { update(); raf = false; }); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [update]);

  useEffect(() => {
    const hideLoader = () => loaderRef.current?.classList.add(s.out);
    window.addEventListener('load', () => setTimeout(hideLoader, 900));
    const fallback = setTimeout(hideLoader, 1900);

    // 4 inner pages: centres at 0.49, 0.64, 0.78, 0.93
    const SNAPS = [0, 0.49, 0.64, 0.78, 0.93];
    let snapLock = false;

    function goToSnap(dir: number) {
      if (snapLock) return;
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      if (sh <= 0) return;
      const p = window.scrollY / sh;
      let target: number;
      if (dir > 0) { target = SNAPS.find(f => f > p + 0.01) ?? SNAPS[SNAPS.length-1]; }
      else         { const rev = [...SNAPS].reverse(); target = rev.find(f => f < p - 0.01) ?? SNAPS[0]; }
      snapLock = true;
      window.scrollTo({ top: target * sh, behavior: 'smooth' });
      setTimeout(() => { snapLock = false; }, 900);
    }

    const onWheel = (e: WheelEvent) => { e.preventDefault(); goToSnap(e.deltaY > 0 ? 1 : -1); };
    let touchX = 0;
    const onTouchStart = (e: TouchEvent) => { touchX = e.touches[0].clientX; };
    const onTouchEnd   = (e: TouchEvent) => { const dx = touchX - e.changedTouches[0].clientX; if (Math.abs(dx) > 20) goToSnap(dx > 0 ? 1 : -1); };
    const onKeyDown    = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goToSnap(1); }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) { e.preventDefault(); goToSnap(-1); }
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    window.addEventListener('keydown',    onKeyDown);

    function spawnPetal() {
      if (!petalsRef.current) return;
      const el = document.createElement('div');
      el.className = s.petal;
      el.textContent = PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
      const dur = Math.random() * 10 + 8;
      el.style.cssText = `left:${Math.random()*100}vw;font-size:${Math.random()*10+8}px;animation-duration:${dur}s;animation-delay:${Math.random()*2}s;opacity:0`;
      petalsRef.current.appendChild(el);
      setTimeout(() => el.remove(), (dur+2)*1000);
    }
    for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 800);
    const petalTimer = setInterval(spawnPetal, 3000);

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a') || t.tagName === 'BUTTON') return;
      for (let i = 0; i < 5; i++) {
        const sp = document.createElement('div');
        sp.className = s.sparkle;
        const sz = Math.random() * 5 + 3;
        sp.style.cssText = `left:${e.clientX-sz/2}px;top:${e.clientY-sz/2}px;width:${sz}px;height:${sz}px;background:${SPARK_COLORS[Math.floor(Math.random()*5)]};animation-delay:${Math.random()*.12}s;animation-duration:${Math.random()*.4+.45}s`;
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 800);
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      clearTimeout(fallback);
      clearInterval(petalTimer);
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('keydown',    onKeyDown);
    };
  }, []);

  // Background music — imperative Audio object avoids React lifecycle issues
  useEffect(() => {
    const audio = new Audio('/Ranjha.mp3');
    audio.volume = 0.5;
    audio.loop = true;

    const GESTURES = ['click', 'touchstart', 'touchend', 'wheel', 'keydown', 'pointerdown'];

    const tryPlay = () => {
      audio.play().then(() => {
        GESTURES.forEach(ev => window.removeEventListener(ev, tryPlay));
      }).catch(() => {});
    };

    GESTURES.forEach(ev => window.addEventListener(ev, tryPlay, { passive: true }));
    tryPlay();

    return () => {
      GESTURES.forEach(ev => window.removeEventListener(ev, tryPlay));
      audio.pause();
      audio.src = '';
    };
  }, []);

  return (
    <>
      {/* ── Loader ── */}
      <div className={s.loader} ref={loaderRef}>
        <div className={s.loaderLotus}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lotus.png" alt="" className={s.loaderLotusImg} />
          <div className={s.loaderRing} /><div className={s.loaderRing2} />
        </div>
        <div className={s.loaderNames}>
          <span className={s.covName1}>Sangey Dorje</span>
          <span className={s.covAnd}>&amp;</span>
          <span className={s.covName2}>Kalzang Dolkar</span>
        </div>
        <p className={s.loaderSub}>preparing your invitation…</p>
      </div>

      <div className={s.petals} ref={petalsRef} />
      <div className={s.bg} />

      <div className={s.stage}>
        <div className={s.cardWrap}>

          {/* ── Inside ── */}
          <div className={s.cardInside}>

            {/* Page 0 — Families & Blessing  (TR + BL lotus) */}
            <div className={`${s.ipage} ${s.ipageLight}`} ref={page0Ref}>
              <InnerBorderSVG />
              <LotusWatermark />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltTR}`} alt="" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltBL}`} alt="" aria-hidden="true" />

              <p className={s.ipEye}>With blessings &amp; boundless joy</p>
              <h2 className={s.ipTitle}>You Are Cordially Invited</h2>

              <div className={s.familyRow}>
                <div className={s.familySide}>
                  <span className={s.covName1}>Sangey<br/>Dorje</span>
                  <p className={s.familyDesc}>Son of<br/><em>Late Tsering Lhamo</em><br/>&amp;<br/><em>Late Tsewang Rinzin</em><br/>(Baldev Singh)</p>
                </div>
                <span className={s.familyAnd}>&amp;</span>
                <div className={s.familySide}>
                  <span className={s.covName2}>Kalzang<br/>Dolkar</span>
                  <p className={s.familyDesc}>Daughter of<br/><em>Late Yangzin Dolma</em><br/>&amp;<br/><em>Late Sonam Ram</em></p>
                </div>
              </div>

              <div className={s.ipDivider} />
              <p className={s.ipQtib}>འདུ་འཛི་དེ་གངས་རི་བཞིན་རྟག་གྱུར་ཅིག</p>
            </div>

            {/* Page 1 — Dham  (TL + BR lotus) */}
            <div className={`${s.ipage} ${s.ipageLight}`} ref={page1Ref}>
              <InnerBorderSVG />
              <LotusWatermark />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltTL}`} alt="" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltBR}`} alt="" aria-hidden="true" />
              <div className={s.evCard}>
                <p className={s.evDateTag}>6 May 2026  ·  Wednesday</p>
                <div className={s.evRule} />
                <h2 className={s.evTitle}>Dham</h2>
                <p className={s.evVenue}>Norbulingka · Dharamshala</p>
                <p className={s.evNote}>Time to be confirmed with Ashang Rinchen</p>
                <div className={s.evRule} />
                <p className={s.evTib}>ཤིས་པ་ཐམས་ཅད་འབྱུང་བར་ཤོག</p>
              </div>
            </div>

            {/* Page 2 — Mehndi  (TR + BL lotus) */}
            <div className={`${s.ipage} ${s.ipageMehndi}`} ref={page2Ref}>
              <InnerBorderSVG />
              <LotusWatermark />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltTR}`} alt="" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltBL}`} alt="" aria-hidden="true" />
              <div className={s.evCard}>
                <p className={s.evDateTag}>7 May 2026  ·  Thursday</p>
                <div className={s.evRule} />
                <h2 className={s.evTitle}>Mehndi</h2>
                <p className={s.evVenue}>Norbulingka · Dharamshala</p>
                <div className={s.evRule} />
                <div className={s.evTimeline}>
                  <div className={s.evItem}><span className={s.evTime}>5:00 PM</span><span className={s.evItemLabel}>Guest Entry</span></div>
                  <div className={s.evItem}><span className={s.evTime}>6:00 PM</span><span className={s.evItemLabel}>Mehndi Begins</span></div>
                  <div className={s.evItem}><span className={s.evTime}>10:00 PM</span><span className={s.evItemLabel}>Farewell</span></div>
                </div>
                <div className={s.evRule} />
                <p className={s.evDressCode}>🌸 Any shade of pink is mandatory 🌸</p>
                <p className={s.evDressNote}>Kindly bear with us!</p>
              </div>
            </div>

            {/* Page 3 — Wedding  (TL + BR lotus) */}
            <div className={`${s.ipage} ${s.ipageLight}`} ref={page3Ref}>
              <InnerBorderSVG />
              <LotusWatermark />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltTL}`} alt="" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lotus.png" className={`${s.lotusCorner} ${s.ltBR}`} alt="" aria-hidden="true" />
              <div className={s.vnCard}>
                <p className={s.vnEyelet}>Wedding Ceremony</p>
                <p className={s.evDateTag}>8 May 2026  ·  Friday</p>
                <div className={s.vnRule} />
                <h2 className={s.vnName}>Dhauladhar Heights Resort</h2>
                <p className={s.vnPoem}>Perched where the Himalayan peaks kiss the clouds,<br/>amid ancient deodar forests and sacred silence</p>
                <p className={s.vnPlace}>
                  <a className={s.vnMapLink} href="https://maps.google.com/?q=32.2019761,76.3113445" target="_blank" rel="noopener noreferrer">
                    Dharamshala · Himachal Pradesh ↗
                  </a>
                </p>
                <p className={s.vnAlt}>Kangra Valley · 1,457 m above the plains</p>
                <div className={s.vnRule} />
                <p className={s.ipQtib}>བཀྲ་ཤིས་བདེ་ལེགས།</p>
              </div>
            </div>

          </div>

          {/* ── Cover ── */}
          <div className={s.cardCover} ref={coverRef}>
            <CoverBorderSVG />
            <SparkleField />
            <LotusWatermark />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/buddha.png" alt="" aria-hidden="true" className={s.covBuddhaBg} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lotus.png" className={s.covLotTL} alt="" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lotus.png" className={s.covLotBR} alt="" aria-hidden="true" />

            <div className={s.coverContent}>
              <p className={s.covTagline}>Together with their families</p>

              <div className={s.covWreathWrap}>
                <WreathCircle />
                <div className={s.covWreathNames}>
                  <span className={s.covName1}>Sangey Dorje</span>
                  <span className={s.covAnd}>&amp;</span>
                  <span className={s.covName2}>Kalzang Dolkar</span>
                </div>
              </div>

              <p className={s.covInvite}>invite you to join their wedding celebration</p>

              <div className={s.covDateBlock}>
                <p className={s.covMonth}>May</p>
                <div className={s.covDateRow}>
                  <span className={s.covDay}>Friday</span>
                  <span className={s.covDayNum}>8</span>
                  <span className={s.covTime}>2026</span>
                </div>
              </div>

              <p className={s.covVenue}>Dhauladhar Heights Resort</p>
              <p className={s.covCity}>Dharamshala · Himachal Pradesh</p>
              <p className={s.covReception}>བཀྲ་ཤིས་བདེ་ལེགས།</p>

              <div className={s.scrollHint}>
                <span>Swipe left to open</span>
                <div className={s.chevron}/>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className={s.prog} ref={progRef} />
      <div className={s.spacer} />
    </>
  );
}

/* ── Inner border SVG ────────────────────────────────────── */
function InnerBorderSVG() {
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2 }}
      viewBox="0 0 480 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ibGold" x1="0" x2="1">
          <stop offset="0%"  stopColor="#D4AF37" stopOpacity=".5"/>
          <stop offset="50%" stopColor="#F5E6A0" stopOpacity=".9"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity=".5"/>
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="470" height="790" fill="none" stroke="rgba(212,175,55,.28)" strokeWidth="1.5"/>
      <rect x="5" y="5"   width="470" height="4" fill="url(#ibGold)"/>
      <rect x="5" y="791" width="470" height="4" fill="url(#ibGold)"/>
      <g fill="none" stroke="rgba(212,175,55,.32)" strokeWidth="1.2">
        <path d="M12,38 L12,12 L38,12"/> <path d="M468,38 L468,12 L442,12"/>
        <path d="M12,762 L12,788 L38,788"/> <path d="M468,762 L468,788 L442,788"/>
      </g>
      <circle cx="12"  cy="12"  r="2.5" fill="rgba(212,175,55,.55)"/>
      <circle cx="468" cy="12"  r="2.5" fill="rgba(212,175,55,.55)"/>
      <circle cx="12"  cy="788" r="2.5" fill="rgba(212,175,55,.55)"/>
      <circle cx="468" cy="788" r="2.5" fill="rgba(212,175,55,.55)"/>
    </svg>
  );
}

/* ── Cover border SVG ────────────────────────────────────── */
function CoverBorderSVG() {
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2 }}
      viewBox="0 0 480 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="csg" x1="0" x2="1">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity=".6"/>
          <stop offset="25%"  stopColor="#F5E6A0" stopOpacity=".95"/>
          <stop offset="50%"  stopColor="#D4AF37" stopOpacity=".85"/>
          <stop offset="75%"  stopColor="#F5E6A0" stopOpacity=".95"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity=".6"/>
        </linearGradient>
        <linearGradient id="csgv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity=".5"/>
          <stop offset="50%"  stopColor="#D4AF37" stopOpacity=".25"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity=".5"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="468" height="788" fill="none" stroke="rgba(212,175,55,.45)" strokeWidth="2"/>
      <rect x="14" y="14" width="452" height="772" fill="none" stroke="rgba(212,175,55,.18)" strokeWidth="1"/>
      <rect x="6" y="6"   width="468" height="5" fill="url(#csg)"/>
      <rect x="6" y="789" width="468" height="5" fill="url(#csg)"/>
      <rect x="6"   y="11" width="3" height="778" fill="url(#csgv)"/>
      <rect x="471" y="11" width="3" height="778" fill="url(#csgv)"/>
      <g fill="none" stroke="rgba(212,175,55,.5)" strokeWidth="1.4">
        <path d="M14,46 L14,14 L46,14"/> <path d="M22,54 L22,22 L54,22"/>
        <path d="M466,46 L466,14 L434,14"/> <path d="M458,54 L458,22 L426,22"/>
        <path d="M14,754 L14,786 L46,786"/> <path d="M22,746 L22,778 L54,778"/>
        <path d="M466,754 L466,786 L434,786"/> <path d="M458,746 L458,778 L426,778"/>
      </g>
      <circle cx="14"  cy="14"  r="4" fill="rgba(212,175,55,.5)"/>
      <circle cx="466" cy="14"  r="4" fill="rgba(212,175,55,.5)"/>
      <circle cx="14"  cy="786" r="4" fill="rgba(212,175,55,.5)"/>
      <circle cx="466" cy="786" r="4" fill="rgba(212,175,55,.5)"/>
      <text x="240" y="36"  textAnchor="middle" fontSize="13" fill="rgba(212,175,55,.5)">❧</text>
      <text x="240" y="779" textAnchor="middle" fontSize="13" fill="rgba(212,175,55,.5)">❧</text>
    </svg>
  );
}
