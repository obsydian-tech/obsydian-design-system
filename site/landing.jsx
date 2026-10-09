// Live demos on the landing page, drawn with the real components from _ds_bundle.js (window.ObsydianDS).
(function () {
  function start() {
    const DS = window.ObsydianDS;
    if (!DS || !window.React || !window.ReactDOM) { setTimeout(start, 40); return; }
    const { useState, useEffect } = React;
    const { ShardMark, Logo, Splash, Button, Chip, ChipGroup, Field, KeyHint, CellGrid, Tile, Steps, NextSteps, Notice, StatusPill, Tag,
      SignalTile, CapabilityRows, AgentVisualizer, textStyle } = DS;
    const mount = (id, el) => { const n = document.getElementById(id); if (n) ReactDOM.createRoot(n).render(el); };

    function Actions() {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--cta-gap)' }}>
          <Button arrow href="ui_kits/website/">Open the website kit</Button>
          <Button variant="link" href="#engineers">For engineers</Button>
        </div>
      );
    }

    function Hero() {
      const [k, setK] = useState(0);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative', width: 'min(220px, 56vw)' }}>
            <span aria-hidden="true" style={{ position: 'absolute', inset: '-30%', background: 'var(--glow-section)', filter: 'blur(36px)' }} />
            <ShardMark key={k} size="100%" animated large title="The Obsydian shard" style={{ position: 'relative' }} />
          </div>
          <Button variant="ghost" onClick={() => setK(k + 1)}>Replay the mark</Button>
        </div>
      );
    }

    function SplashDemo() {
      const [k, setK] = useState(0);
      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '0 0 64px 0' }}><Splash key={k} contained hold playKey={k} /></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2, display: 'flex', justifyContent: 'center' }}><Button variant="ghost" onClick={() => setK(k + 1)}>Replay</Button></div>
        </div>
      );
    }

    function Lockup() {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22 }}>
          <Logo />
          <Logo size="pill" />
          <Logo size="footer" />
        </div>
      );
    }

    const block = (title, note, children) => (
      <div style={{ padding: '40px 0', borderTop: '1px solid var(--hairline)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20 }}>
        <div>
          <h3 style={{ margin: '0 0 6px', ...textStyle('title-3', 'var(--bone)') }}>{title}</h3>
          <p style={{ margin: 0, ...textStyle('small', 'var(--bone-dim)'), maxWidth: '68ch' }}>{note}</p>
        </div>
        {children}
      </div>
    );

    function Components() {
      const [busy, setBusy] = useState(false);
      const [topics, setTopics] = useState(['A new platform']);
      const [sel, setSel] = useState('data');
      const [sig, setSig] = useState('uptime');
      const send = () => { setBusy(true); setTimeout(() => setBusy(false), 2400); };
      const toggle = (t) => setTopics(topics.includes(t) ? topics.filter((x) => x !== t) : [...topics, t]);
      const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 };
      return (
        <div>
          {block('Buttons', 'One glossy violet primary per viewport; a ghost pill or an underlined link for everything else. Press "Send enquiry": every button that starts something shows it is working until it lands.',
            <div style={row}>
              <Button arrow busy={busy} busyLabel="Sending" onClick={send}>Send enquiry</Button>
              <Button variant="ghost">Back to home</Button>
              <Button variant="link" arrow>View all platforms</Button>
              <Button variant="nav">Start a project</Button>
            </div>)}
          {block('Fields and chips', 'A recessed well under a sentence-case label, with a placeholder that asks the question. Choices are pills that turn violet when chosen.',
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0 24px', maxWidth: 900 }}>
              <div>
                <ChipGroup legend="What can we help with?" style={{ marginBottom: 28 }}>
                  {['A new platform', 'Modernising a system', 'AI and automation', 'Not sure yet'].map((t) => <Chip key={t} selected={topics.includes(t)} onClick={() => toggle(t)}>{t}</Chip>)}
                </ChipGroup>
                <Field label="Work email" placeholder="you@company.com" defaultValue="alex@" error="Enter a valid email." />
              </div>
              <Field size="brief" label="What do you want built?" placeholder="Type a sentence or two: what it does, who uses it, and what matters most."
                keyHint={<KeyHint keys={['⌘', '↵']}>to draft</KeyHint>} />
            </div>)}
          {block('Hairline grids', 'Cells drawn from 1px lines alone. Under the pointer a 3px violet bar; selected, a violet ring inside the edge.',
            <CellGrid columns={3}>
              {[['infrastructure', '01 Foundation', 'Cloud and infrastructure', 'Cloud environments, identity, networking, pipelines and observability.'],
                ['data', '02 Data', 'Data, CRM and analytics', 'Customer records, operational data and analytics pipelines.'],
                ['services', '03 Services', 'Services, APIs and integrations', 'Business logic, APIs and integrations in one coherent platform.']].map(([id, l, t, s]) =>
                <Tile key={id} label={l} title={t} summary={s} action="Explore layer" selected={sel === id} onSelect={() => setSel(id)} />)}
            </CellGrid>)}
          {block('Lists on hairlines', 'Numbered steps, rows that link, and the short list beside a form. None of them is a card.',
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 40 }}>
              <Steps compact steps={[{ title: 'Discovery and strategy', body: 'We start by understanding your business goals, technical landscape and long-term priorities.' }, { title: 'Architecture and planning', body: 'We define the right technical foundation before building.' }]} />
              <div style={{ maxWidth: 380 }}><NextSteps items={['You tell us what you are building and where it stands today.', 'We reply within two business days, usually with a few questions.', 'If there is a fit, we set up a call to go deeper.']} /></div>
            </div>)}
          {block('Status, notices and figures', 'Status is a word in a pill; an error about the whole form is a calm sentence on a violet bar; a figure over time is one quiet line.',
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 32, alignItems: 'start' }}>
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={row}><StatusPill>Ready</StatusPill><StatusPill live>Live</StatusPill><Tag>Offline sync</Tag><Tag shape="square">Identity</Tag></div>
                <Notice alert>The drafting engine could not complete that request. Try rephrasing, or try again shortly.</Notice>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', border: '1px solid var(--hairline)' }}>
                <SignalTile label="Platform uptime" value="99.97%" delta="+0.02% 30d" values={[.62, .7, .66, .78, .74, .86, .9]} selected={sig === 'uptime'} onSelect={() => setSig('uptime')} />
                <SignalTile label="P95 latency" value="142ms" delta="−18ms 30d" values={[.8, .74, .7, .62, .58, .5, .46]} selected={sig === 'p95'} onSelect={() => setSig('p95')} />
              </div>
            </div>)}
          {block('The agent', 'Talk to Obsydian: a frame with a point of light running round it, and a grid of dots that walks, circles, scans and, when it speaks, lights violet.',
            <div style={row}>
              {['idle', 'listening', 'thinking'].map((s) => <div key={s} style={{ display: 'grid', gap: 10, justifyItems: 'center' }}><AgentVisualizer state={s} size={140} /><span style={textStyle('label', 'var(--bone-low)')}>{s}</span></div>)}
            </div>)}
        </div>
      );
    }

    mount('demo-actions', <Actions />);
    mount('demo-hero', <Hero />);
    mount('demo-splash', <SplashDemo />);
    mount('demo-lockup', <Lockup />);
    mount('demo-components', <Components />);

    // The section tabs follow the reader.
    const tabs = [...document.querySelectorAll('.tab')];
    const byId = new Map(tabs.map((t) => [t.getAttribute('href').slice(1), t]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        tabs.forEach((t) => t.removeAttribute('aria-current'));
        const t = byId.get(e.target.id);
        if (t) { t.setAttribute('aria-current', 'true'); t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
