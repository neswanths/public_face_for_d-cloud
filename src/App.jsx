import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

/* ── FadeUp ── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`fadeup ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
}

/* ── SectionLabel ── */
function SectionLabel({ text }) {
  return <div className="section-label">{text}</div>;
}

/* ── Tag ── */
function Tag({ text }) {
  return <span className="tag">{text}</span>;
}

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="navbar-logo">D<span className="dot">·</span>Cloud</a>
      <div className="navbar-links">
        <a href="#how">How It Works</a><a href="#security">Security</a><a href="#pricing">Pricing</a><a href="#about">About</a>
      </div>
      <a href="#waitlist" className="navbar-cta navbar-cta-desktop">Join the Network</a>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#how" onClick={() => setMenuOpen(false)}>How It Works</a>
        <a href="#security" onClick={() => setMenuOpen(false)}>Security</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#waitlist" className="navbar-cta" onClick={() => setMenuOpen(false)}>Join the Network</a>
      </div>
    </nav>
  );
}

/* ── Hero Particles ── */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, nodes = [];
    const NUM = 60, MAX_DIST = 140;
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    function init() {
      resize(); nodes = [];
      for (let i = 0; i < NUM; i++) nodes.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6, r: 1.5 + Math.random() * 1.5 });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(163,22,33,0.4)'; ctx.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j], dx = n.x - m.x, dy = n.y - m.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(163,22,33,${0.12 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    init(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [canvasRef]);
}

function Hero() {
  const canvasRef = useRef(null);
  useParticles(canvasRef);
  return (
    <section className="hero">
      <canvas ref={canvasRef} />
      <div className="hero-content">
        <FadeUp>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">Now accepting early access applications</span>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h1>Your cloud.<br />Your rules.<br />Zero compromise.</h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="hero-sub">D-Cloud distributes storage across independently verifiable nodes. No centralized control plane. No vendor lock-in. No blockchain overhead.</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="hero-ctas">
            <a href="#waitlist" className="btn-primary">Join the Network</a>
            <a href="#how" className="btn-secondary">How it works →</a>
          </div>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="hero-stats">
            <span className="stat-pill">0 Single Points of Failure</span>
            <span className="stat-pill">5× Replication Factor</span>
            <span className="stat-pill">Ed25519 Identity</span>
            <span className="stat-pill">AES-256-GCM Encryption</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Problem Strip ── */
function ProblemStrip() {
  return (
    <section className="problem-strip">
      <div className="problem-grid">
        <FadeUp className="problem-col">
          <span className="problem-icon">⊗</span>
          <h3 className="problem-title">Centralized Cloud</h3>
          <p className="problem-body">One breach propagates system-wide. Your data lives on their infrastructure, under their rules, dependent on their uptime. When the provider fails, everything fails with them.</p>
        </FadeUp>
        <FadeUp delay={0.15} className="problem-col">
          <span className="problem-icon">⛓</span>
          <h3 className="problem-title">Blockchain Alternatives</h3>
          <p className="problem-body">Global consensus means global bottlenecks. Every operation waits for network-wide agreement — impractical latency and cost for real storage workloads.</p>
        </FadeUp>
        <FadeUp delay={0.3} className="problem-col highlight">
          <span className="problem-icon">◈</span>
          <h3 className="problem-title">D-Cloud</h3>
          <p className="problem-body">Distributed trust. Local validation. Cryptographic proof at every step. No single point of failure, no single point of trust, no single point of compromise.</p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── How It Works ── */
const STEPS = [
  { num: '01', title: 'Chunk & Hash', body: 'File split into 64KB chunks. Each chunk SHA-256 hashed — its permanent, tamper-proof content address.', tag: 'CONTENT ADDRESSING' },
  { num: '02', title: 'Sign & Encrypt', body: 'Each chunk AES-256-GCM encrypted with a per-file key. Ed25519 signed by the storing node — unforgeable proof of custody.', tag: 'CRYPTOGRAPHIC PROOF' },
  { num: '03', title: 'DHT Distribution', body: 'Encrypted chunks distributed across peers via content-addressed routing. Every chunk replicated across 5 nodes minimum.', tag: 'P2P STORAGE' },
  { num: '04', title: 'Local Validation', body: 'On retrieval, each node validates hash and signature independently before serving. Bad data is rejected before it leaves the node.', tag: 'ZERO-TRUST RETRIEVAL' },
];

function HowItWorks() {
  return (
    <section className="how-section" id="how">
      <FadeUp><SectionLabel text="ARCHITECTURE" /></FadeUp>
      <FadeUp delay={0.1}><h2 className="how-heading">From upload to retrieval —<br />without a control plane</h2></FadeUp>
      <FadeUp delay={0.15}><p className="how-sub">D-Cloud's agent-centric model makes every operation self-contained, verifiable, and survivable without a central authority.</p></FadeUp>
      <div className="how-cards">
        {STEPS.map((s, i) => (
          <FadeUp key={i} delay={0.1 * i} className="how-card-wrapper">
            <div className="how-card">
              <span className="how-card-watermark">{s.num}</span>
              <div className="how-bar" />
              <h3 className="how-card-title">{s.title}</h3>
              <p className="how-card-body">{s.body}</p>
              <Tag text={s.tag} />
            </div>
            {i < STEPS.length - 1 && <span className="arrow">→</span>}
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ── Economics ── */
function Economics() {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  const rows = [
    { plan: 'NODE (FREE)', contribute: 100, receive: 100, label: '1 : 1 — Symmetric participation', marker: null },
    { plan: 'MESH', contribute: 100, receive: 100, label: '1 : 2.5 — Paid surplus', marker: '2.5×' },
    { plan: 'SOVEREIGN', contribute: 100, receive: 100, label: '1 : ∞ — Infrastructure grade', marker: '∞' },
  ];
  return (
    <section className="economics-section">
      <div className="economics-inner" ref={ref}>
        <FadeUp><SectionLabel text="NETWORK ECONOMICS" /></FadeUp>
        <FadeUp delay={0.1}><h2 className="economics-heading">Contribute storage.<br />Earn storage.</h2></FadeUp>
        <FadeUp delay={0.15}>
          <div className="economics-body">
            <p>On the free tier, you contribute X storage to the network and receive X in return. You are not a customer — you are a participant. The network's capacity grows because of you, not despite you.</p>
            <br />
            <p>Paid plans remove the symmetry constraint. Your payment covers the surplus — the capacity beyond what you personally contribute. Even then, you remain a contributing node, not a consumer.</p>
          </div>
        </FadeUp>
        <div className="economics-bars">
          {rows.map((r, i) => (
            <FadeUp key={i} delay={0.1 * i}>
              <div className="econ-row">
                <div className="econ-plan">{r.plan}</div>
                <div className="econ-track-row">
                  <span className="econ-track-label">Contribute</span>
                  <div className="econ-track"><div className="econ-fill" style={{ width: animated ? `${r.contribute}%` : '0%' }} /></div>
                </div>
                <div className="econ-track-row">
                  <span className="econ-track-label">Receive</span>
                  <div className="econ-track"><div className="econ-fill" style={{ width: animated ? `${r.receive}%` : '0%' }} /></div>
                  {r.marker && <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: 'var(--accent)', marginLeft: 10, fontWeight: 500, flexShrink: 0 }}>{r.marker}</span>}
                </div>
                <div className="econ-ratio">{r.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ── */
function Pricing() {
  const plans = [
    { name: 'NODE', price: 'Free', sub: 'forever', features: ['5GB network storage', '1:1 contribution ratio', 'Basic API access', 'Ed25519 cryptographic identity', 'Community support'], cta: 'Join Free', featured: false },
    { name: 'MESH', price: '$9', sub: 'per month', features: ['25GB network storage', '1:2.5 contribution ratio', 'Priority DHT replication', 'Key management UI', 'Email support', 'Everything in Node'], cta: 'Get Mesh', featured: true },
    { name: 'SOVEREIGN', price: '$29', sub: 'per month', features: ['Unlimited storage', 'Custom replication factor', 'Audit logs', 'SLA uptime guarantee', 'Dedicated node assignment', 'Priority support', 'Everything in Mesh'], cta: 'Go Sovereign', featured: false },
  ];
  return (
    <section className="pricing-section" id="pricing">
      <FadeUp><SectionLabel text="PRICING" /></FadeUp>
      <FadeUp delay={0.1}><h2 className="pricing-heading">Pick your role in the network</h2></FadeUp>
      <FadeUp delay={0.15}><p className="pricing-sub">Every plan includes end-to-end encryption, cryptographic identity, and zero vendor lock-in. No hidden egress fees.</p></FadeUp>
      <div className="pricing-cards">
        {plans.map((p, i) => (
          <FadeUp key={i} delay={0.1 * i}>
            <div className={`plan-card ${p.featured ? 'featured' : ''}`}>
              {p.featured && <span className="plan-badge">Most Popular</span>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">{p.price}</div>
              <div className="plan-price-sub">{p.sub}</div>
              <hr className="plan-divider" />
              <ul className="plan-features">{p.features.map((f, j) => <li key={j}>{f}</li>)}</ul>
              <button className={p.featured ? 'plan-cta-fill' : 'plan-cta-outline'}>{p.cta}</button>
            </div>
          </FadeUp>
        ))}
      </div>
      <FadeUp><p className="pricing-fine">Pricing is indicative. Final rates confirmed at general availability.</p></FadeUp>
    </section>
  );
}

/* ── Security ── */
function Security() {
  return (
    <section className="security-section" id="security">
      <div className="security-grid">
        <div>
          <FadeUp><SectionLabel text="SECURITY MODEL" /></FadeUp>
          <FadeUp delay={0.1}><h2 className="security-heading">We don't ask you<br />to trust us.</h2></FadeUp>
          <FadeUp delay={0.15}><p className="security-subheading">We give you the tools to verify everyone yourself.</p></FadeUp>
          <FadeUp delay={0.2}><p className="security-body">Every node generates its own Ed25519 keypair at startup. Every chunk it stores is signed with that key. On retrieval, the integrity zome validates the hash and signature locally — before data leaves the node. A compromised node cannot forge a valid signature. The network detects and rejects it automatically.</p></FadeUp>
          <FadeUp delay={0.25}>
            <ul className="security-bullets">
              <li>Node-signed storage proofs — every stored chunk has a cryptographic receipt</li>
              <li>Breach isolation — one compromised node reveals nothing about the others</li>
              <li>No certificate authority — identity is self-sovereign by design</li>
            </ul>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          <div className="verify-feed">
            <div className="verify-header">
              <span className="verify-header-left">// INTEGRITY LOG</span>
              <span className="verify-live">LIVE</span>
            </div>
            <div className="verify-row"><span className="verify-icon">🔑</span><div className="verify-content"><div className="verify-title">Node Keypair Generated</div><div className="verify-sub">pub: 0x4af0...b830 · sealed</div></div><span className="verify-badge ok">VERIFIED</span></div>
            <div className="verify-row"><span className="verify-icon">📦</span><div className="verify-content"><div className="verify-title">Chunk Signed on Store</div><div className="verify-sub">sig: 0x9f2e...a451 · node-1</div></div><span className="verify-badge ok">VERIFIED</span></div>
            <div className="verify-row"><span className="verify-icon">🔍</span><div className="verify-content"><div className="verify-title">Retrieval Hash Check</div><div className="verify-sub">SHA256 match confirmed</div></div><span className="verify-badge ok">VALID</span></div>
            <div className="verify-row error-row"><span className="verify-icon">⚠️</span><div className="verify-content"><div className="verify-title">Tampered Chunk Detected</div><div className="verify-sub">hash mismatch → rejected at node</div></div><span className="verify-badge err">BLOCKED</span></div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Waitlist ── */
function Waitlist() {
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', org: '', plan: '', role: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setStatus('loading');
    try {
      const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqegdrgo";
      const res = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setStatus(res.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
  };
  return (
    <section className="waitlist-section" id="waitlist">
      <div className="waitlist-inner">
        <FadeUp><SectionLabel text="EARLY ACCESS" /></FadeUp>
        <FadeUp delay={0.1}><h2 className="waitlist-heading">Reserve your spot<br />on the network.</h2></FadeUp>
        <FadeUp delay={0.15}><p className="waitlist-sub">We're onboarding early nodes. Tell us about yourself and we'll reach out with access details.</p></FadeUp>
        <FadeUp delay={0.2}>
          {status === 'success' ? (
            <div className="form-success"><div className="form-success-icon">◆</div><h3>You're on the list.</h3><p>We'll be in touch with your early access details.</p></div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input className="form-input" type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              <input className="form-input" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
              <input className="form-input" type="text" name="org" placeholder="Company or project name (optional)" value={form.org} onChange={handleChange} />
              <select className="form-select" name="plan" value={form.plan} onChange={handleChange} required>
                <option value="" disabled>I'm interested in...</option>
                <option>Node — Free</option><option>Mesh — $9/mo</option><option>Sovereign — $29/mo</option><option>Not sure yet</option>
              </select>
              <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
                <option value="" disabled>I am a...</option>
                <option>Developer</option><option>Startup Founder</option><option>Enterprise Buyer</option><option>Investor</option><option>Other</option>
              </select>
              <button className="form-submit" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Reserve My Spot →'}</button>
              {status === 'error' && <p className="form-error">Something went wrong. Please try again or email us directly.</p>}
            </form>
          )}
        </FadeUp>
      </div>
    </section>
  );
}

/* ── About ── */
function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-inner">
        <FadeUp><SectionLabel text="ABOUT" /></FadeUp>
        <FadeUp delay={0.1}><h2 className="about-heading">Built on a simple belief.</h2></FadeUp>
        <FadeUp delay={0.15}>
          <p className="about-body">D-Cloud started from a simple observation: cloud infrastructure asks you to trust vendors with your data, your identity, and your availability — all at once. When that trust breaks, everything breaks with it.</p>
          <p className="about-body">We are building an alternative where trust is distributed by design, not promised by contract. Every node is independently verifiable. Every piece of data carries cryptographic proof of who stored it and when. No master key. No central authority. No single point of failure.</p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="about-links">
            {/* REPLACE with actual URLs */}
            <a href="https://github.com/neswanths/d-cloud" className="about-link" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              GitHub
            </a>
            {/* REPLACE with actual URL */}
            <a href="https://linkedin.com/in/neswanth" className="about-link" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>
              LinkedIn
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <span className="footer-logo">D<span className="dot">·</span>Cloud</span>
        <div className="footer-links">
          <a href="#how">Architecture</a><a href="#security">Security</a><a href="#pricing">Pricing</a>
          {/* REPLACE with actual URL */}
          <a href="https://github.com/neswanths/d-cloud" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="#waitlist">Contact</a>
        </div>
        <span className="footer-copy">© 2026 D-Cloud. Decentralized by design.</span>
      </div>
      <div className="footer-bottom">
        <span className="footer-tagline">TRUST DISTRIBUTED. DATA OWNED.</span>
      </div>
    </footer>
  );
}

/* ── App ── */
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProblemStrip />
      <HowItWorks />
      <Economics />
      <Pricing />
      <Security />
      <Waitlist />
      <About />
      <Footer />
    </>
  );
}
