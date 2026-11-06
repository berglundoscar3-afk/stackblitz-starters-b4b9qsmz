'use client';

import { useState, useMemo } from 'react';
import LiveMatches from './LiveMatches';

type Tab = 'Dashboard' | 'Ligor' | 'Spelare' | 'AI-assistent';
const leagues = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Allsvenskan',
  'Champions League',
  'Europa League',
  'Eredivisie',
  'Primeira Liga',
  'Scottish Premiership',
  'MLS',
  'Brasileirão',
  'J1 League',
];
const players = [
  {
    name: 'Erling Haaland',
    team: 'Manchester City',
    games: 5,
    shots: 21,
    onTarget: 11,
    fouls: 5,
    yellow: 1,
  },
  {
    name: 'Mohamed Salah',
    team: 'Liverpool',
    games: 5,
    shots: 18,
    onTarget: 9,
    fouls: 4,
    yellow: 0,
  },
  {
    name: 'Kylian Mbappé',
    team: 'Real Madrid',
    games: 5,
    shots: 24,
    onTarget: 12,
    fouls: 6,
    yellow: 1,
  },
  {
    name: 'Viktor Gyökeres',
    team: 'Arsenal',
    games: 5,
    shots: 17,
    onTarget: 8,
    fouls: 8,
    yellow: 1,
  },
  {
    name: 'Alexander Isak',
    team: 'Liverpool',
    games: 5,
    shots: 15,
    onTarget: 7,
    fouls: 3,
    yellow: 0,
  },
];
const matches = [
  {
    home: 'Arsenal',
    away: 'Chelsea',
    league: 'Premier League',
    homeForm: 72,
    awayForm: 61,
    shots: '14–10',
  },
  {
    home: 'Barcelona',
    away: 'Real Madrid',
    league: 'La Liga',
    homeForm: 75,
    awayForm: 73,
    shots: '16–13',
  },
  {
    home: 'Inter',
    away: 'AC Milan',
    league: 'Serie A',
    homeForm: 70,
    awayForm: 64,
    shots: '12–9',
  },
];
const panel: React.CSSProperties = {
  background: '#13241b',
  border: '1px solid #284334',
  borderRadius: 18,
  padding: 22,
};
const muted: React.CSSProperties = { color: '#9ab1a2' };

export default function Home() {
  const [tab, setTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('Premier League');
  const [selectedPlayer, setSelectedPlayer] = useState(players[0].name);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([
    {
      role: 'assistant',
      text: 'Hej! Jag är SPORTIQs demoassistent. Fråga exempelvis om Haalands skott, gula kort eller vilka ligor som finns i demon.',
    },
  ]);
  const filteredLeagues = useMemo(
    () => leagues.filter((l) => l.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const player = players.find((p) => p.name === selectedPlayer) ?? players[0];
  function answer(q: string) {
    const t = q.toLowerCase();
    const found = players.find(
      (p) =>
        t.includes(p.name.toLowerCase()) ||
        t.includes(p.name.split(' ').at(-1)!.toLowerCase())
    );
    if (found)
      return `${found.name} (${found.team}): ${found.shots} skott, ${found.onTarget} skott på mål, ${found.fouls} regelöverträdelser och ${found.yellow} gula kort under ${found.games} fiktiva matcher. Detta är exempeldata.`;
    if (t.includes('liga') || t.includes('ligor'))
      return `Demon innehåller ${leagues.length} ligor. Gå till Ligor för att söka bland dem. Det är ännu inte live-data.`;
    if (t.includes('kort') || t.includes('skott') || t.includes('foul'))
      return 'Öppna fliken Spelare för att jämföra skott, skott på mål, regelöverträdelser och gula kort. Alla värden är fiktiva.';
    return 'Jag kan just nu svara på enkla frågor om demospelarna, skott, kort och ligor. En riktig AI-modell och verifierade datakällor ansluts i en senare version.';
  }
  function send() {
    const q = question.trim();
    if (!q) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'assistant', text: answer(q) },
    ]);
    setQuestion('');
  }
  return (
    <main className="sportiq-app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">⚽</span>
          <div>
            <strong>
              SPORTIQ <em>AI</em>
            </strong>
            <small>FOOTBALL INTELLIGENCE</small>
          </div>
        </div>
        <p className="sidebar-label">NAVIGATION</p>
        <nav aria-label="Huvudmeny">
          {(['Dashboard', 'Ligor', 'Spelare', 'AI-assistent'] as Tab[]).map(
            (name) => (
              <button
                key={name}
                className={`nav-button ${tab === name ? 'active' : ''}`}
                onClick={() => setTab(name)}
              >
                {
                  (
                    {
                      Dashboard: '◫',
                      Ligor: '◎',
                      Spelare: '♙',
                      'AI-assistent': '✦',
                    } as Record<Tab, string>
                  )[name]
                }{' '}
                <span>{name}</span>
              </button>
            )
          )}
        </nav>
        <div className="sidebar-bottom">
          <span className="status-dot" /> Demo-läge{' '}
          <small>Ingen live-anslutning</small>
        </div>
      </aside>
      <section className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">SPORTIQ AI / {tab.toUpperCase()}</span>
            <h1>{tab === 'Dashboard' ? 'Football Overview' : tab}</h1>
            <p className="subtitle">
              Statistik, insikter och fotbollsanalys på ett ställe.
            </p>
          </div>
          <span className="demo-pill">● EXEMPELDATA</span>
        </header>
        {tab === 'Dashboard' && (
          <div className="stack">
            <div className="metrics">
              <div className="metric">
                <small>Fotbollsligor</small>
                <strong>{leagues.length}</strong>
                <span>Global översikt</span>
              </div>
              <div className="metric">
                <small>Exempelmatcher</small>
                <strong>{matches.length}</strong>
                <span>Match Intelligence</span>
              </div>
              <div className="metric">
                <small>Spelarprofiler</small>
                <strong>{players.length}</strong>
                <span>Player Intelligence</span>
              </div>
            </div>
            <LiveMatches />
            <div className="section-head">
              <h2>Match Intelligence</h2>
              <span>Illustrativa matcher – inga riktiga speltider</span>
            </div>
            <div className="match-grid">
              {matches.map((m) => (
                <article className="panel match-card" key={m.home}>
                  <span className="eyebrow">{m.league}</span>
                  <h3>
                    {m.home} <span className="vs">VS</span> {m.away}
                  </h3>
                  <div className="stat-line">
                    <span>Formindex (demo)</span>
                    <strong>
                      {m.homeForm} – {m.awayForm}
                    </strong>
                  </div>
                  <div className="bar">
                    <span
                      style={{
                        width: `${
                          (m.homeForm / (m.homeForm + m.awayForm)) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="stat-line">
                    <span>Skott (demo)</span>
                    <strong>{m.shots}</strong>
                  </div>
                </article>
              ))}
            </div>
            <div className="panel welcome">
              <div>
                <span className="eyebrow">SPORTIQ ASSISTANT</span>
                <h2>Utforska fotbollsstatistik med AI-inspirerad analys</h2>
                <p>
                  Ställ frågor om exempelspelarnas skott, kort och prestationer.
                  Chatten är regelbaserad i denna version.
                </p>
              </div>
              <button
                className="primary"
                onClick={() => setTab('AI-assistent')}
              >
                Öppna assistenten →
              </button>
            </div>
          </div>
        )}
        {tab === 'Ligor' && (
          <div className="panel">
            <div className="section-head">
              <h2>Global League Explorer</h2>
              <span>
                {filteredLeagues.length} av {leagues.length} ligor
              </span>
            </div>
            <label className="field-label" htmlFor="league-search">
              Sök liga
            </label>
            <input
              id="league-search"
              className="field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Exempel: Allsvenskan"
            />
            <div className="league-grid">
              {filteredLeagues.map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLeague(l)}
                  className={`league-item ${
                    selectedLeague === l ? 'chosen' : ''
                  }`}
                >
                  ⚽ {l}
                  <span>→</span>
                </button>
              ))}
            </div>
            {filteredLeagues.length === 0 && (
              <p>Inga ligor matchar sökningen.</p>
            )}
            <div className="selection">
              Vald liga: <strong>{selectedLeague}</strong>
              <p>Ligatabeller och riktiga matcher kopplas på senare.</p>
            </div>
          </div>
        )}
        {tab === 'Spelare' && (
          <div className="stack">
            <div className="panel">
              <h2>Player Intelligence</h2>
              <p className="subtitle">
                Välj en spelare för att visa fiktiv statistik över fem matcher.
              </p>
              <label className="field-label" htmlFor="player">
                Välj spelare
              </label>
              <select
                className="field"
                id="player"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
              >
                {players.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} – {p.team}
                  </option>
                ))}
              </select>
            </div>
            <div className="panel">
              <span className="eyebrow">SPELARPROFIL • DEMO</span>
              <h2>{player.name}</h2>
              <p className="subtitle">
                {player.team} • Senaste {player.games} fiktiva matcher
              </p>
              <div className="metrics player-metrics">
                {[
                  { label: 'Skott', value: player.shots },
                  { label: 'Skott på mål', value: player.onTarget },
                  { label: 'Regelöverträdelser', value: player.fouls },
                  { label: 'Gula kort', value: player.yellow },
                ].map((s) => (
                  <div className="metric" key={s.label}>
                    <small>{s.label}</small>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
              <div className="selection">
                Genomsnittliga skott per match:{' '}
                <strong>{(player.shots / player.games).toFixed(1)}</strong>
                <p>Värdena är påhittade för att testa gränssnittet.</p>
              </div>
            </div>
          </div>
        )}
        {tab === 'AI-assistent' && (
          <div className="panel chat-panel">
            <div className="section-head">
              <h2>✦ SPORTIQ Assistant</h2>
              <span>Regelbaserad demo</span>
            </div>
            <p className="subtitle">
              Testa frågor som ”Hur många skott har Haaland?” eller ”Vilka ligor
              finns?”
            </p>
            <div className="messages" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`bubble ${m.role}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form
              className="chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                className="field"
                aria-label="Din fråga"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Fråga om fotbollsstatistik..."
              />
              <button
                className="primary"
                type="submit"
                disabled={!question.trim()}
              >
                Skicka
              </button>
            </form>
          </div>
        )}
        <footer className="footer">
          SPORTIQ AI © 2026 • Version 0.2 • Alla siffror är exempeldata • Ingen
          spelrådgivning
        </footer>
      </section>
    </main>
  );
}
