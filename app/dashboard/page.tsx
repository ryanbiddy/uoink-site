import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { TopNav } from "../components/TopNav";

export const metadata: Metadata = {
  title: "Uoink dashboard - v2.2 helper UI",
  description: "Preview the Uoink v2.2 local helper dashboard: Library, Activity, Settings, and About in one local browser UI.",
  alternates: { canonical: "/dashboard" },
  openGraph: {
    title: "Uoink dashboard - v2.2 helper UI",
    description: "The v2.2 dashboard brings your Library, Activity, Settings, and About surfaces into the local helper.",
    url: "/dashboard",
  },
  twitter: {
    title: "Uoink dashboard - v2.2 helper UI",
    description: "The v2.2 dashboard brings your Library, Activity, Settings, and About surfaces into the local helper.",
  },
};

const libraryRows = [
  ["The New Code", "AI Engineer", "Contrarian", "8 entities"],
  ["The Future of MCP", "AI and ML", "Demo", "17 entities"],
  ["Why Every Launch Looks the Same", "Social Media Research", "Question", "12 entities"],
];

const activityRows = [
  ["fetch", "Downloading metadata", "running"],
  ["transcribe", "Transcript ready", "done"],
  ["screenshots", "4 of 12 in clipboard", "done"],
  ["classify", "Hook confidence 5/5", "done"],
];

export default function DashboardPage() {
  return (
    <div className="site-root mode-dark">
      <TopNav active="/dashboard" />
      <main>
        <section className="hero" data-screen-label="dashboard / hero">
          <div className="container">
            <div className="hero-grid">
              <div className="copy">
                <span className="eyebrow">v2.2 dashboard</span>
                <h1 className="display-xl">
                  Your local helper gets a <em>control room.</em>
                </h1>
                <p className="lede">
                  The tray icon opens a browser dashboard on localhost: Library, Activity, Settings, and About in one place. No more hunting through setup pages after install.
                </p>
                <div className="ctas">
                  <a className="btn primary large" href="/install">Download for Windows</a>
                  <a className="btn ghost large" href="/how">See the flow</a>
                </div>
                <p className="sub-cta">Placeholder UI, built from the live v2.2 structure. Ryan will replace with final captures when the build is tagged.</p>
              </div>
              <div className="hero-demo dashboard-showcase" aria-label="Dashboard UI preview">
                <div className="dashboard-window">
                  <div className="dashboard-titlebar">
                    <span className="wm-line"><uoink-mark aria-hidden="true"></uoink-mark><span className="oink">OINK</span></span>
                    <span className="dashboard-pill">helper online</span>
                  </div>
                  <div className="dashboard-tabs" aria-hidden="true">
                    <span className="active">Library</span>
                    <span>Activity</span>
                    <span>Settings</span>
                    <span>About</span>
                  </div>
                  <div className="dashboard-toolbar">
                    <span>Search corpus...</span>
                    <span>Topic: all</span>
                    <span>Sort: newest</span>
                  </div>
                  <div className="dashboard-list">
                    {libraryRows.map(([title, topic, hook, entities]) => (
                      <div className="dashboard-row" key={title}>
                        <div className="thumb"></div>
                        <div>
                          <b>{title}</b>
                          <span>{topic}</span>
                        </div>
                        <div className="row-meta">
                          <span>{hook}</span>
                          <span>{entities}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule" />

        <section className="section" data-screen-label="dashboard / tabs">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">four tabs</span>
              <h2 className="display-l">Everything installed users need, <em>in one local page.</em></h2>
              <p className="lede">The dashboard runs from the helper at <code>127.0.0.1:5179</code>. It uses the same local data as the extension and MCP server.</p>
            </div>
            <div className="card-grid four">
              <article className="card"><span className="num">01</span><h3>Library</h3><p>Search, filter, sort, and open every uoink from the canonical local index.</p></article>
              <article className="card"><span className="num">02</span><h3>Activity</h3><p>Watch fetch, transcribe, screenshots, classify, and write phases while jobs run.</p></article>
              <article className="card"><span className="num">03</span><h3>Settings</h3><p>Manage BYO Anthropic key, output folder, topics, helper toggle, and MCP config.</p></article>
              <article className="card"><span className="num">04</span><h3>About</h3><p>See version, local paths, bundled binaries, and the privacy posture in plain language.</p></article>
            </div>
          </div>
        </section>

        <section className="section" data-screen-label="dashboard / activity">
          <div className="container">
            <div className="agent-demo dashboard-activity">
              <div className="chat">
                <div className="mini-heading">ACTIVITY STREAM</div>
                {activityRows.map(([phase, label, state]) => (
                  <p className="chat-bubble user" key={phase}>
                    <code>{phase}</code> {label} <span className={`state-dot ${state}`}></span>
                  </p>
                ))}
              </div>
              <div className="log">
                <div className="mini-heading">SETTINGS SNAPSHOT</div>
                <pre className="mcp-log">{`output_folder: ~/Desktop/Uoink
anthropic_key: set
topics: AI and ML, Research, Social
mcp_server: uoink
tray: opens /dashboard`}</pre>
              </div>
            </div>
          </div>
        </section>

        <section className="big-strip" data-screen-label="dashboard / cta">
          <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
            <div>
              <h2 className="display-l" style={{ margin: 0 }}>Install, finish, <em>open the tray.</em></h2>
              <p className="body-l" style={{ marginTop: 18, maxWidth: "58ch" }}>v2.2 turns the post-install moment into a clean loop: wizard, splash, tray icon, dashboard, first uoink.</p>
            </div>
            <a className="btn ink" href="/install">Install Uoink</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
