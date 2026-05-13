import { useState, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const LEAGUES = [
  { id: "epl", name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
  { id: "laliga", name: "La Liga", flag: "🇪🇸", country: "Spain" },
  { id: "ucl", name: "Champions League", flag: "🏆", country: "Europe" },
  { id: "serie_a", name: "Serie A", flag: "🇮🇹", country: "Italy" },
  { id: "bundesliga", name: "Bundesliga", flag: "🇩🇪", country: "Germany" },
];

const LIVE_GAMES = [
  { id: 1, league: "epl", home: "Arsenal", away: "Man City", homeScore: 2, awayScore: 1, minute: 67, homeForm: "WWDWW", awayForm: "WLWWL", prediction: { home: 58, draw: 22, away: 20 }, homeLogo: "⚪🔴", awayLogo: "🔵" },
  { id: 2, league: "laliga", home: "Real Madrid", away: "Barcelona", homeScore: 1, awayScore: 1, minute: 44, homeForm: "WWWWL", awayForm: "WWWDW", prediction: { home: 42, draw: 28, away: 30 }, homeLogo: "⚪", awayLogo: "🔵🔴" },
  { id: 3, league: "ucl", home: "Bayern", away: "PSG", homeScore: 3, awayScore: 0, minute: 82, homeForm: "WWWWW", awayForm: "WDLWW", prediction: { home: 65, draw: 18, away: 17 }, homeLogo: "🔴", awayLogo: "🔵" },
];

const UPCOMING_GAMES = [
  { id: 10, league: "epl", home: "Liverpool", away: "Chelsea", date: "Today 20:00", homeForm: "WWDWW", awayForm: "DWWLW", prediction: { home: 52, draw: 24, away: 24 }, odds: { home: "1.85", draw: "3.60", away: "4.20" }, tip: "Home Win + BTTS", confidence: 78 },
  { id: 11, league: "bundesliga", home: "Dortmund", away: "Leipzig", date: "Today 21:30", homeForm: "WLWWW", awayForm: "WWWLW", prediction: { home: 44, draw: 26, away: 30 }, odds: { home: "2.10", draw: "3.40", away: "3.20" }, tip: "Over 2.5 Goals", confidence: 84 },
  { id: 12, league: "serie_a", home: "Inter", away: "Juventus", date: "Tomorrow 18:45", homeForm: "WWWWW", awayForm: "DWWLW", prediction: { home: 55, draw: 25, away: 20 }, odds: { home: "1.95", draw: "3.50", away: "3.80" }, tip: "Home Win", confidence: 71 },
  { id: 13, league: "laliga", home: "Atletico", away: "Sevilla", date: "Tomorrow 20:00", homeForm: "WDWWL", awayForm: "LWDWL", prediction: { home: 60, draw: 22, away: 18 }, odds: { home: "1.75", draw: "3.70", away: "5.00" }, tip: "Home Win & Under 3.5", confidence: 76 },
  { id: 14, league: "ucl", home: "Man City", away: "Inter", date: "Thu 20:00", homeForm: "WWWWW", awayForm: "WDWWW", prediction: { home: 50, draw: 22, away: 28 }, odds: { home: "1.90", draw: "3.55", away: "4.10" }, tip: "Both Teams Score", confidence: 82 },
];

const PREVIOUS_GAMES = [
  { id: 20, league: "epl", home: "Man Utd", away: "Tottenham", homeScore: 2, awayScore: 3, date: "May 11", prediction: { home: 45, draw: 28, away: 27 }, tip: "Away Win", correct: true },
  { id: 21, league: "laliga", home: "Villarreal", away: "Real Sociedad", homeScore: 1, awayScore: 1, date: "May 11", prediction: { home: 40, draw: 30, away: 30 }, tip: "Draw", correct: true },
  { id: 22, league: "ucl", home: "Dortmund", away: "Atletico", homeScore: 4, awayScore: 2, date: "May 10", prediction: { home: 55, draw: 20, away: 25 }, tip: "Home Win + Over 2.5", correct: true },
  { id: 23, league: "serie_a", home: "Napoli", away: "Roma", homeScore: 2, awayScore: 0, date: "May 10", prediction: { home: 62, draw: 22, away: 16 }, tip: "Home Win", correct: true },
  { id: 24, league: "bundesliga", home: "Freiburg", away: "Wolfsburg", homeScore: 1, awayScore: 2, date: "May 9", prediction: { home: 48, draw: 26, away: 26 }, tip: "Over 2.5", correct: false },
];

const BEST_BETS = [
  { match: "Dortmund vs Leipzig", tip: "Over 2.5 Goals", odds: "1.75", confidence: 84, league: "bundesliga", date: "Today 21:30" },
  { match: "Man City vs Inter", tip: "Both Teams Score", odds: "1.80", confidence: 82, league: "ucl", date: "Thu 20:00" },
  { match: "Liverpool vs Chelsea", tip: "Home Win + BTTS", odds: "2.30", confidence: 78, league: "epl", date: "Today 20:00" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formDot = (char) => {
  if (char === "W") return <span style={{ background: "#00e676", color: "#000", borderRadius: 3, padding: "1px 5px", fontSize: 10, fontWeight: 700, marginRight: 2 }}>W</span>;
  if (char === "L") return <span style={{ background: "#ff1744", color: "#fff", borderRadius: 3, padding: "1px 5px", fontSize: 10, fontWeight: 700, marginRight: 2 }}>L</span>;
  return <span style={{ background: "#ffc400", color: "#000", borderRadius: 3, padding: "1px 5px", fontSize: 10, fontWeight: 700, marginRight: 2 }}>D</span>;
};

const PredBar = ({ home, draw, away }) => (
  <div style={{ display: "flex", height: 6, borderRadius: 4, overflow: "hidden", gap: 1, margin: "6px 0" }}>
    <div style={{ width: `${home}%`, background: "#00e676" }} title={`Home ${home}%`} />
    <div style={{ width: `${draw}%`, background: "#ffc400" }} title={`Draw ${draw}%`} />
    <div style={{ width: `${away}%`, background: "#ff6b6b" }} title={`Away ${away}%`} />
  </div>
);

const ConfidenceBadge = ({ val }) => {
  const color = val >= 80 ? "#00e676" : val >= 70 ? "#ffc400" : "#ff6b6b";
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
      {val}% confident
    </span>
  );
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function LiveCard({ game }) {
  const [pulse, setPulse] = useState(true);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 800); return () => clearInterval(t); }, []);
  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1b2a 0%, #1a2942 100%)",
      border: "1px solid #1e3a5f",
      borderRadius: 14,
      padding: "16px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #ff1744, #ff6b6b)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: "#90a4ae", textTransform: "uppercase", letterSpacing: 1 }}>
          {LEAGUES.find(l => l.id === game.league)?.flag} {LEAGUES.find(l => l.id === game.league)?.name}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#ff1744", fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: pulse ? "#ff1744" : "transparent", display: "inline-block", transition: "background 0.2s" }} />
          LIVE {game.minute}'
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{game.home}</div>
          <div style={{ fontSize: 10, color: "#90a4ae" }}>{game.homeForm.split("").map((c,i) => <span key={i}>{formDot(c)}</span>)}</div>
        </div>
        <div style={{ textAlign: "center", padding: "0 16px" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "monospace", letterSpacing: 4 }}>
            {game.homeScore}<span style={{ color: "#546e7a", margin: "0 4px" }}>:</span>{game.awayScore}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{game.away}</div>
          <div style={{ fontSize: 10, color: "#90a4ae", display: "flex", justifyContent: "flex-end" }}>{game.awayForm.split("").map((c,i) => <span key={i}>{formDot(c)}</span>)}</div>
        </div>
      </div>
      <PredBar {...game.prediction} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#90a4ae" }}>
        <span style={{ color: "#00e676" }}>H {game.prediction.home}%</span>
        <span style={{ color: "#ffc400" }}>D {game.prediction.draw}%</span>
        <span style={{ color: "#ff6b6b" }}>A {game.prediction.away}%</span>
      </div>
    </div>
  );
}

function UpcomingCard({ game }) {
  return (
    <div style={{
      background: "#0d1b2a",
      border: "1px solid #1e3a5f",
      borderRadius: 14,
      padding: "16px 20px",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#00e676"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1e3a5f"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: "#90a4ae", textTransform: "uppercase", letterSpacing: 1 }}>
          {LEAGUES.find(l => l.id === game.league)?.flag} {LEAGUES.find(l => l.id === game.league)?.name}
        </span>
        <span style={{ fontSize: 11, color: "#ffc400", fontWeight: 600 }}>{game.date}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{game.home}</div>
          <div style={{ fontSize: 10, marginTop: 3 }}>{game.homeForm.split("").map((c,i) => <span key={i}>{formDot(c)}</span>)}</div>
        </div>
        <div style={{ color: "#546e7a", fontSize: 18, fontWeight: 700, padding: "0 12px" }}>vs</div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{game.away}</div>
          <div style={{ fontSize: 10, marginTop: 3, display: "flex", justifyContent: "flex-end" }}>{game.awayForm.split("").map((c,i) => <span key={i}>{formDot(c)}</span>)}</div>
        </div>
      </div>
      <PredBar {...game.prediction} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#90a4ae", marginBottom: 12 }}>
        <span style={{ color: "#00e676" }}>H {game.prediction.home}%</span>
        <span style={{ color: "#ffc400" }}>D {game.prediction.draw}%</span>
        <span style={{ color: "#ff6b6b" }}>A {game.prediction.away}%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["1", game.odds.home], ["X", game.odds.draw], ["2", game.odds.away]].map(([label, odd]) => (
            <div key={label} style={{
              background: "#0a1628",
              border: "1px solid #1e3a5f",
              borderRadius: 8,
              padding: "5px 10px",
              textAlign: "center",
              minWidth: 48,
            }}>
              <div style={{ fontSize: 9, color: "#546e7a", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{odd}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#90a4ae", marginBottom: 3 }}>AI TIP</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#00e676" }}>{game.tip}</div>
          <ConfidenceBadge val={game.confidence} />
        </div>
      </div>
    </div>
  );
}

function PreviousCard({ game }) {
  return (
    <div style={{
      background: "#0d1b2a",
      border: `1px solid ${game.correct ? "#00e67622" : "#ff174422"}`,
      borderLeft: `3px solid ${game.correct ? "#00e676" : "#ff1744"}`,
      borderRadius: 10,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}>
      <div style={{ fontSize: 18 }}>{game.correct ? "✅" : "❌"}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: "#90a4ae", marginBottom: 2 }}>
          {LEAGUES.find(l => l.id === game.league)?.flag} {game.date}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
          {game.home} {game.homeScore} – {game.awayScore} {game.away}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 10, color: "#90a4ae" }}>Predicted</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: game.correct ? "#00e676" : "#ff6b6b" }}>{game.tip}</div>
      </div>
    </div>
  );
}

function BestBetCard({ bet }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0a2818 0%, #0d1b2a 100%)",
      border: "1px solid #00e67633",
      borderRadius: 14,
      padding: "16px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.04 }}>⚽</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: "#90a4ae", marginBottom: 3 }}>
            {LEAGUES.find(l => l.id === bet.league)?.flag} {bet.date}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{bet.match}</div>
        </div>
        <div style={{ background: "#00e676", color: "#000", borderRadius: 8, padding: "4px 10px", fontSize: 14, fontWeight: 900 }}>
          {bet.odds}
        </div>
      </div>
      <div style={{ background: "#00e67611", border: "1px solid #00e67633", borderRadius: 8, padding: "8px 12px", marginTop: 8 }}>
        <div style={{ fontSize: 10, color: "#00e676", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>AI Best Bet</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{bet.tip}</div>
      </div>
      <div style={{ marginTop: 8 }}>
        <ConfidenceBadge val={bet.confidence} />
      </div>
    </div>
  );
}

// ─── AI PREDICTION ENGINE ──────────────────────────────────────────────────────
async function getAIPrediction(match, setResult, setLoading) {
  setLoading(true);
  setResult("");
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are a professional football analyst and sports predictor. 
Analyze match data and provide a concise, expert prediction. 
Format your response with: 
1. Match Analysis (2-3 sentences)
2. Key Factors (bullet points)  
3. Prediction & Recommended Bet
4. Confidence Level
Keep it under 200 words and be direct and professional.`,
        messages: [{ role: "user", content: `Predict: ${match.home} vs ${match.away}. Home form: ${match.homeForm}. Away form: ${match.awayForm}. League: ${match.league}. Odds: Home ${match.odds?.home || "N/A"}, Draw ${match.odds?.draw || "N/A"}, Away ${match.odds?.away || "N/A"}.` }],
      }),
    });
    const data = await response.json();
    const text = data.content?.find(b => b.type === "text")?.text || "Unable to generate prediction.";
    setResult(text);
  } catch (e) {
    setResult("Error contacting AI. Please try again.");
  }
  setLoading(false);
}

function AIAnalyzer({ games }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ background: "#0d1b2a", border: "1px solid #1e3a5f", borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}>🤖</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>AI Deep Analysis</div>
          <div style={{ fontSize: 11, color: "#90a4ae" }}>Powered by Claude AI — select a match for expert prediction</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {games.map(g => (
          <button key={g.id}
            onClick={() => { setSelected(g); setResult(""); }}
            style={{
              background: selected?.id === g.id ? "#00e67611" : "#0a1628",
              border: `1px solid ${selected?.id === g.id ? "#00e676" : "#1e3a5f"}`,
              borderRadius: 10,
              padding: "10px 14px",
              color: "#fff",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              transition: "all 0.2s",
            }}>
            <span>{g.home} vs {g.away}</span>
            <span style={{ color: "#ffc400", fontSize: 11 }}>{g.date}</span>
          </button>
        ))}
      </div>
      {selected && (
        <button
          onClick={() => getAIPrediction(selected, setResult, setLoading)}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#1e3a5f" : "linear-gradient(90deg, #00c853, #00e676)",
            border: "none",
            borderRadius: 10,
            padding: "12px 0",
            color: loading ? "#90a4ae" : "#000",
            fontWeight: 800,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 16,
            transition: "all 0.2s",
          }}>
          {loading ? "🔄 Analyzing with AI..." : "⚡ Get AI Prediction"}
        </button>
      )}
      {result && (
        <div style={{
          background: "#0a2818",
          border: "1px solid #00e67633",
          borderRadius: 12,
          padding: 16,
          whiteSpace: "pre-wrap",
          fontSize: 13,
          color: "#e0f2f1",
          lineHeight: 1.7,
        }}>
          {result}
        </div>
      )}
    </div>
  );
}

// ─── STATS WIDGET ──────────────────────────────────────────────────────────────
function StatsBar() {
  const correct = PREVIOUS_GAMES.filter(g => g.correct).length;
  const total = PREVIOUS_GAMES.length;
  const pct = Math.round((correct / total) * 100);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
      {[
        { label: "Prediction Accuracy", value: `${pct}%`, color: "#00e676", icon: "🎯" },
        { label: "Tips Today", value: UPCOMING_GAMES.length, color: "#ffc400", icon: "📊" },
        { label: "Live Matches", value: LIVE_GAMES.length, color: "#ff6b6b", icon: "🔴" },
      ].map(s => (
        <div key={s.label} style={{
          background: "#0d1b2a",
          border: "1px solid #1e3a5f",
          borderRadius: 14,
          padding: "16px 14px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 10, color: "#546e7a", marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("live");
  const [leagueFilter, setLeagueFilter] = useState("all");

  const tabs = [
    { id: "live", label: "🔴 Live", count: LIVE_GAMES.length },
    { id: "upcoming", label: "📅 Upcoming", count: UPCOMING_GAMES.length },
    { id: "previous", label: "📋 Results", count: PREVIOUS_GAMES.length },
    { id: "bestbets", label: "⚡ Best Bets", count: BEST_BETS.length },
    { id: "ai", label: "🤖 AI Analysis" },
  ];

  const filteredUpcoming = leagueFilter === "all" ? UPCOMING_GAMES : UPCOMING_GAMES.filter(g => g.league === leagueFilter);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060e1a",
      color: "#fff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #0a1628 0%, #060e1a 100%)",
        borderBottom: "1px solid #1e3a5f",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #00c853, #00e676)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>⚽</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, color: "#fff" }}>
                  Scout<span style={{ color: "#00e676" }}>Bet</span>
                </div>
                <div style={{ fontSize: 9, color: "#546e7a", letterSpacing: 2, textTransform: "uppercase" }}>AI Sports Intelligence</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e676", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "#00e676", fontWeight: 600 }}>{LIVE_GAMES.length} LIVE</span>
            </div>
          </div>
          {/* TABS */}
          <div style={{ display: "flex", gap: 2, paddingBottom: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  background: "none", border: "none",
                  borderBottom: `2px solid ${tab === t.id ? "#00e676" : "transparent"}`,
                  color: tab === t.id ? "#00e676" : "#90a4ae",
                  padding: "8px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}>
                {t.label}
                {t.count !== undefined && (
                  <span style={{
                    marginLeft: 5,
                    background: tab === t.id ? "#00e676" : "#1e3a5f",
                    color: tab === t.id ? "#000" : "#90a4ae",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontSize: 10,
                  }}>{t.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <StatsBar />

        {/* LIVE */}
        {tab === "live" && (
          <div>
            <div style={{ fontSize: 13, color: "#90a4ae", marginBottom: 16 }}>
              Showing {LIVE_GAMES.length} live matches with real-time predictions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {LIVE_GAMES.map(g => <LiveCard key={g.id} game={g} />)}
            </div>
          </div>
        )}

        {/* UPCOMING */}
        {tab === "upcoming" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => setLeagueFilter("all")}
                style={{ background: leagueFilter === "all" ? "#00e676" : "#0d1b2a", color: leagueFilter === "all" ? "#000" : "#90a4ae", border: "1px solid #1e3a5f", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                All
              </button>
              {LEAGUES.map(l => (
                <button key={l.id} onClick={() => setLeagueFilter(l.id)}
                  style={{ background: leagueFilter === l.id ? "#00e676" : "#0d1b2a", color: leagueFilter === l.id ? "#000" : "#90a4ae", border: "1px solid #1e3a5f", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredUpcoming.map(g => <UpcomingCard key={g.id} game={g} />)}
              {filteredUpcoming.length === 0 && (
                <div style={{ textAlign: "center", color: "#546e7a", padding: 40 }}>No matches for this league</div>
              )}
            </div>
          </div>
        )}

        {/* PREVIOUS */}
        {tab === "previous" && (
          <div>
            <div style={{ background: "#0d1b2a", border: "1px solid #1e3a5f", borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, color: "#90a4ae" }}>Recent Accuracy</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#00e676" }}>
                  {Math.round(PREVIOUS_GAMES.filter(g=>g.correct).length / PREVIOUS_GAMES.length * 100)}%
                </div>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#00e676" }}>{PREVIOUS_GAMES.filter(g=>g.correct).length}</div>
                  <div style={{ fontSize: 10, color: "#90a4ae" }}>Correct</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#ff1744" }}>{PREVIOUS_GAMES.filter(g=>!g.correct).length}</div>
                  <div style={{ fontSize: 10, color: "#90a4ae" }}>Wrong</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PREVIOUS_GAMES.map(g => <PreviousCard key={g.id} game={g} />)}
            </div>
          </div>
        )}

        {/* BEST BETS */}
        {tab === "bestbets" && (
          <div>
            <div style={{ background: "linear-gradient(135deg, #0a2818, #0d1b2a)", border: "1px solid #00e67633", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>⚡ Today's Best Bets</div>
              <div style={{ fontSize: 12, color: "#90a4ae" }}>Hand-picked by our AI engine. High-confidence picks only. Always gamble responsibly.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {BEST_BETS.map((b, i) => <BestBetCard key={i} bet={b} />)}
            </div>
            <div style={{ marginTop: 24, background: "#0d1b2a", border: "1px solid #ff174422", borderRadius: 12, padding: "12px 16px", fontSize: 11, color: "#78909c", lineHeight: 1.6 }}>
              ⚠️ <strong style={{ color: "#ff6b6b" }}>Responsible Gambling:</strong> Predictions are for informational purposes only. Never bet more than you can afford to lose. If you need help, contact your local gambling support helpline.
            </div>
          </div>
        )}

        {/* AI ANALYSIS */}
        {tab === "ai" && (
          <div>
            <AIAnalyzer games={UPCOMING_GAMES} />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #1e3a5f", padding: "20px 16px", textAlign: "center", color: "#37474f", fontSize: 11 }}>
        ScoutBet © 2026 · AI Sports Intelligence · Data updates every 60s
      </div>
    </div>
  );
}
