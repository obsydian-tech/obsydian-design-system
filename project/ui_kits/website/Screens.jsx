// The website's pages, composed only from the design system. Each screen takes the states the page can be in.
// Copy comes from Content.jsx, which mirrors site-content.ts on main.

const ASSETS = '../../assets/';

/** Where a page's three.js scene sits. The kit does not run the scenes; it marks their place. */
export function SceneStage({ children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 32, border: '1px solid var(--hairline)', textAlign: 'center' }}>
      <Text role="meta" tone="low" style={{ maxWidth: '32ch' }}>{children}</Text>
    </div>
  );
}

/** The frame every page sits in: the nav over the page, the footer under it. */
export function SitePage({ active, children, footer = true }) {
  return (
    <div style={{ background: 'var(--obsydian)', minHeight: '100vh' }}>
      <Nav active={active} />
      <main>{children}</main>
      {footer ? <Footer /> : null}
    </div>
  );
}

export function Home() {
  const narrow = useIsNarrow();
  const phone = useIsPhone();
  return (
    <SitePage>
      <HomeHero fallbackSrc={ASSETS + 'shard.svg'} />
      <Section pad="clamp(64px, 8vw, 112px)">
        <StatStrip stats={[
          { figure: '30+', label: 'Years combined', body: 'Our founding engineers bring over three decades of combined experience across large-scale platform builds and operations.' },
          { figure: 'Multi-sector', label: 'Industries served', body: 'We design and build with partners across finance, fintech, hospitality, and regulated markets, each system fitted to the business, not the template.' },
          { figure: 'Proven impact', label: 'Outcomes over outputs', body: 'Every engagement is tracked to business results: cycle times compressed, revenue retained, costs eliminated. Not tickets closed.' },
        ]} />
      </Section>
      <Section id="approach" hairline={false}>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(240px, 320px)', gap: 'clamp(28px, 4vw, 56px)', alignItems: 'center' }}>
          <div>
            <Eyebrow number="01" draw>What we do</Eyebrow>
            <h2 style={{ margin: '0 0 56px', ...textStyle(phone ? 'section-phone' : 'statement', 'var(--bone)'), maxWidth: '24ch' }}>
              <TwoTone lines={['Built for modern business.', 'Technology should enable growth, not create complexity.']} />
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 8, borderTop: '1px solid var(--hairline)', maxWidth: '68ch' }}>
              <Text as="p" role="lede" tone="dim">Obsydian partners with organisations building digital products, modernising internal platforms and scaling customer-facing systems with the right balance of engineering depth, cloud infrastructure and practical execution.</Text>
              <Text as="p" role="lede" tone="dim">We focus on building reliable technology foundations that are secure, scalable and ready for long-term growth, from infrastructure and software platforms to customer experience systems and intelligent automation.</Text>
            </div>
          </div>
          <AgentPromo />
        </div>
      </Section>
      <section style={{ padding: 'var(--section-pad) 0', borderTop: '1px solid var(--hairline)' }}>
        <Container><SectionHead number="02" eyebrow="Platforms" lines={['Some of the systems', "we've designed and delivered."]} /></Container>
        <LogoBand items={PLATFORM_NAMES.map((name) => ({ name, href: '#' }))} />
        <Container><div style={{ paddingTop: 48 }}><Button variant="link" arrow href="/platforms">View all platforms</Button></div></Container>
      </section>
      <Section id="services">
        <SectionHead number="03" eyebrow="Services" lines={['What we deliver', 'across the partnership.']} />
        <CapabilityRows rows={SERVICE_AREAS.map((s) => ({ name: s.title, desc: s.summary, href: '/services#' + s.id }))} />
        <SectionFoot href="/services">View all services</SectionFoot>
      </Section>
      <Section id="how-we-work">
        <SectionHead number="04" eyebrow="How we work" lines={['From discovery', 'to long-term partnership.']} />
        <Steps compact steps={PROCESS_STEPS.slice(0, 3)} />
        <SectionFoot href="/how-we-work">View how we work</SectionFoot>
      </Section>
      <Section id="tech-partners">
        <SectionHead number="05" eyebrow="Technology partners" lines={['Built with trusted platforms.', 'Some of the ecosystems we ship on.']} />
        <CellGrid columns={4} narrow={3} phone={2}>{PARTNER_NAMES.map((n) => <LogoCell key={n} name={n} href="#" />)}</CellGrid>
        <SectionFoot href="/technology-partners">View all technology partners</SectionFoot>
      </Section>
      <ClosingCall />
    </SitePage>
  );
}

export function Services() {
  return (
    <SitePage active="Services">
      <PageHero eyebrow="Services" lines={['Engineering depth.', 'Practical delivery.']}
        lede="Four practice areas. One team. We design, build and operate the systems your organisation depends on for growth." aside={<AgentPromo />} />
      <section style={{ padding: 'var(--body-pad) 0' }}>
        <Container>
          {SERVICE_AREAS.map((s, i) => (
            <article key={s.id} id={s.id} style={{ padding: 'clamp(56px, 8vw, 96px) 0', borderTop: '1px solid var(--hairline)', borderBottom: i === SERVICE_AREAS.length - 1 ? '1px solid var(--hairline)' : 0 }}>
              <div style={{ maxWidth: '56ch', marginBottom: 28 }}>
                <h2 style={{ margin: '0 0 16px', ...textStyle('title-1', 'var(--bone)') }}>{s.title}</h2>
                <Text as="p" role="lede" tone="primary">{s.summary}</Text>
              </div>
              <Text as="p" role="body" tone="dim" style={{ margin: '0 0 40px', maxWidth: '68ch' }}>{s.body}</Text>
              <CapabilityList items={s.capabilities} />
            </article>
          ))}
        </Container>
      </section>
      <CtaBand prompt="Ready to scope an engagement?" />
    </SitePage>
  );
}

export function HowWeWork() {
  return (
    <SitePage active="How we work">
      <PageHero eyebrow="How we work" lines={['From discovery', 'to partnership.']}
        lede="A structured path from first conversation to production systems and long-term partnership. We stay close to the work at every stage." />
      <section style={{ padding: 'var(--body-pad) 0' }}>
        <Container>
          <Text as="p" role="lede" tone="dim" style={{ margin: '0 0 clamp(56px, 8vw, 88px)', paddingBottom: 'clamp(40px, 6vw, 64px)', borderBottom: '1px solid var(--hairline)', maxWidth: '68ch' }}>
            Every engagement is shaped around your business context, technical landscape and delivery priorities. We combine discovery, architecture and hands-on engineering so what gets built is fit for purpose, operable in production and ready to evolve.
          </Text>
          <Steps steps={PROCESS_STEPS} />
        </Container>
      </section>
      <CtaBand prompt="Ready to start with discovery?" />
    </SitePage>
  );
}

export function Stack({ initial = null }) {
  const [open, setOpen] = useState(initial);
  const layer = STACK_LAYERS.find((l) => l.id === open);
  const area = layer ? SERVICE_AREAS.find((s) => s.id === layer.service) : null;
  const narrow = useIsNarrow();
  return (
    <SitePage>
      <PageHero variant="split" eyebrow="Architecture" lines={['The stack', 'we build on.']}
        lede="Every platform we build stacks the same way: resilient infrastructure at the base, intelligence at the top."
        intro="Open a layer to see how we design, deliver and operate it. Each one maps to a core practice area."
        stage={<SceneStage>The stack scene: four obsidian slabs in three.js, one per layer. Opening a layer slides it out like a drawer. See Scenes.</SceneStage>} />
      <section style={{ padding: 'clamp(48px, 8vw, 96px) 0', borderTop: '1px solid var(--hairline)' }}>
        <Container>
          {layer ? (
            <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 'clamp(32px, 5vw, 64px)', paddingBottom: 'clamp(40px, 6vw, 64px)', marginBottom: 'clamp(40px, 6vw, 64px)', borderBottom: '1px solid var(--hairline)' }}>
              <div>
                <div style={{ ...textStyle('label', 'var(--violet)'), marginBottom: 12 }}>{layer.n} {layer.label}</div>
                <h2 style={{ margin: '0 0 16px', ...textStyle('title-1', 'var(--bone)'), fontSize: 'clamp(28px, 3vw, 40px)' }}>{layer.title}</h2>
                <Text as="p" role="body-sm" tone="dim" style={{ maxWidth: '52ch', margin: 0 }}>{layer.summary}</Text>
              </div>
              <div>
                <CapabilityList items={area.capabilities} columns={1} style={{ marginBottom: 24 }} />
                <Button variant="link" arrow href={'/services#' + area.id}>View service area</Button>
              </div>
            </div>
          ) : (
            <Text as="p" role="small" tone="low" style={{ margin: '0 0 40px', paddingBottom: 32, borderBottom: '1px solid var(--hairline)' }}>Open a layer in the stack or below to explore it.</Text>
          )}
          <CellGrid columns={3} role="list">
            {STACK_LAYERS.map((l) => (
              <Tile key={l.id} label={`${l.n} ${l.label}`} title={l.title} summary={l.summary} action="Explore layer" selected={open === l.id} onSelect={() => setOpen(l.id)} />
            ))}
            <Tile label="Full stack" title="End-to-end delivery" summary="We design and operate across every layer, from infrastructure to customer-facing products.">
              <button type="button" onClick={() => setOpen(null)} style={{ alignSelf: 'flex-start', background: 'none', border: 0, padding: 0, cursor: 'pointer', marginTop: 8, ...textStyle('action', 'var(--bone-low)') }}>Reset selection&nbsp;→</button>
            </Tile>
          </CellGrid>
        </Container>
      </section>
      <CtaBand prompt="Need a platform architected for growth?" />
    </SitePage>
  );
}

export function Contact({ state = 'default' }) {
  const [topics, setTopics] = useState(['A new platform']);
  const [phase, setPhase] = useState(state);
  useEffect(() => setPhase(state), [state]);
  const errors = phase === 'errors';
  const send = () => { setPhase('sending'); setTimeout(() => setPhase('sent'), 1800); };
  const toggle = (t) => setTopics(topics.includes(t) ? topics.filter((x) => x !== t) : [...topics, t]);
  const phone = useIsPhone();
  return (
    <SitePage>
      <PageHero eyebrow="Contact" lines={['Start a', 'conversation']}
        lede="Tell us what you are building, modernising or scaling. We respond within two business days." aside={<AgentPromo />} />
      <section style={{ padding: 'clamp(64px, 10vw, 120px) 0 clamp(96px, 12vw, 160px)' }}>
        <Container style={{ display: 'grid', gridTemplateColumns: phone ? 'minmax(0, 1fr)' : 'minmax(220px, 320px) minmax(0, 760px)', justifyContent: 'space-between', gap: 'clamp(48px, 8vw, 120px)', alignItems: 'start' }}>
          <aside style={phone ? { order: 2 } : { position: 'sticky', top: 140 }}>
            <h2 style={{ margin: '0 0 24px', font: 'var(--type-title-3)', fontSize: 20, letterSpacing: '-0.01em', color: 'var(--bone)' }}>What happens next</h2>
            <NextSteps style={{ marginBottom: 48 }} items={['You tell us what you are building and where it stands today.', 'We reply within two business days, usually with a few questions.', 'If there is a fit, we set up a call to go deeper.']} />
            <div style={{ display: 'grid', gap: 20 }}>
              <div><div style={{ ...textStyle('caption', 'var(--bone-low)'), marginBottom: 4 }}>Partnerships</div><InlineLink href="mailto:partner@obsydiantechnologies.com">partner@obsydiantechnologies.com</InlineLink></div>
              <div><div style={{ ...textStyle('caption', 'var(--bone-low)'), marginBottom: 4 }}>Press</div><InlineLink href="mailto:press@obsydiantechnologies.com">press@obsydiantechnologies.com</InlineLink></div>
            </div>
          </aside>
          {phase === 'sent' ? (
            <div role="status">
              <h2 style={{ margin: '0 0 16px', ...textStyle('title-1', 'var(--bone)'), fontSize: 'clamp(28px, 3vw, 40px)' }}>Thank you, we have your note.</h2>
              <Text as="p" role="body" tone="dim" style={{ margin: '0 0 32px', maxWidth: '44ch' }}>We will reply within two business days. If it is urgent, write to <InlineLink href="mailto:partner@obsydiantechnologies.com">partner@obsydiantechnologies.com</InlineLink>.</Text>
              <Button variant="ghost" arrow href="/">Back to home</Button>
            </div>
          ) : (
            <form noValidate onSubmit={(e) => { e.preventDefault(); send(); }}>
              <ChipGroup legend="What can we help with?" style={{ marginBottom: 40 }}>
                {CONTACT_TOPICS.map((t) => <Chip key={t} selected={topics.includes(t)} onClick={() => toggle(t)}>{t}</Chip>)}
              </ChipGroup>
              <div style={{ display: 'grid', gridTemplateColumns: phone ? '1fr' : '1fr 1fr', gap: '0 20px' }}>
                <Field label="Your name" placeholder="First and last name" autoComplete="name" error={errors ? 'Enter your name.' : undefined} />
                <Field label="Work email" placeholder="you@company.com" autoComplete="email" error={errors ? 'Enter a valid email.' : undefined} />
              </div>
              <Field label="Company" optional placeholder="Where you work" autoComplete="organization" />
              <Field label="About the project" multiline placeholder="What are you building or changing, where does it stand today, and is there a date that matters?" error={errors ? 'Tell us a little about the project.' : undefined} />
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 28px', paddingTop: 8 }}>
                <Button type="submit" arrow busy={phase === 'sending'} busyLabel="Sending">Send enquiry</Button>
                <Text role="meta" tone="low">We reply within two business days.</Text>
              </div>
            </form>
          )}
        </Container>
      </section>
    </SitePage>
  );
}

export function Blueprint({ state = 'intake' }) {
  const [brief, setBrief] = useState('');
  const [phase, setPhase] = useState(state);
  useEffect(() => setPhase(state), [state]);
  const draft = () => { if (brief.trim()) setPhase('drafting'); };
  return (
    <SitePage active="Blueprint">
      <PageHero eyebrow="Blueprint" lines={['Describe the system.', 'Watch it take shape.']}
        lede="Blueprint is our drafting engine. Give it a sentence or two about what you want built. It returns a working engagement plan with architecture, phases, team and risks, drawn live on this page.">
        <Text as="p" role="meta" tone="low" style={{ margin: '20px 0 0' }}>Runs on the same AI stack we design and operate with our partners.</Text>
      </PageHero>
      <section style={{ padding: 'clamp(48px, 7vw, 96px) 0 clamp(64px, 9vw, 128px)' }}>
        <Container>
          {phase === 'drafting' ? (
            <div role="status" aria-live="polite" style={{ borderTop: '1px solid var(--hairline)', paddingTop: 'clamp(32px, 4vw, 48px)', display: 'flex', gap: 'clamp(24px, 4vw, 48px)', flexWrap: 'wrap' }}>
              {/* The site draws the thinking orb (vendored thinking-orbs, MIT, state "solving", 64px) here. */}
              <div style={{ maxWidth: 440, flex: 1 }}>
                <div style={{ ...textStyle('brief', 'var(--bone)'), marginBottom: 20 }}>Drafting from your brief</div>
                <NextSteps reveal items={['Reading the brief', 'Choosing the architecture', 'Placing components', 'Sequencing delivery']} />
              </div>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 'clamp(32px, 4vw, 48px)' }}>
              <Field size="brief" label="What do you want built?" value={brief} onChange={(e) => setBrief(e.target.value)}
                placeholder="Type a sentence or two: what it does, who uses it, and what matters most."
                keyHint={<KeyHint keys={['⌘', '↵']}>to draft</KeyHint>} style={{ marginBottom: 0 }}
                onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') draft(); }} />
              <ChipGroup label="Or start from an example" style={{ marginTop: 24 }}>
                {BLUEPRINT_STARTERS.map((s) => <Chip key={s} onClick={() => setBrief(s)}>{s}</Chip>)}
              </ChipGroup>
              {phase === 'failed' ? <Notice alert style={{ marginTop: 18 }}>The drafting engine could not complete that request. Try rephrasing, or try again shortly.</Notice> : null}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 28px', marginTop: 36 }}>
                <Button arrow disabled={!brief.trim()} onClick={draft}>Draft the blueprint</Button>
                <Text role="meta" tone="low">Takes a few seconds. No account needed.</Text>
              </div>
            </div>
          )}
          <Text as="p" role="meta" tone="low" style={{ margin: '28px 0 0', lineHeight: 1.6, maxWidth: '60ch' }}>A blueprint is a drafted starting point, not a quote. Bring one to a conversation and we will pressure-test it together.</Text>
        </Container>
      </section>
    </SitePage>
  );
}

export const SCREENS = {
  Home: { component: Home, states: ['Default'] },
  Services: { component: Services, states: ['Default'] },
  HowWeWork: { component: HowWeWork, states: ['Default'], label: 'How we work' },
  Stack: { component: Stack, states: ['Nothing open', 'Layer open'] },
  Contact: { component: Contact, states: ['Default', 'Errors', 'Sending', 'Sent'] },
  Blueprint: { component: Blueprint, states: ['Intake', 'Drafting', 'Failed'] },
};
