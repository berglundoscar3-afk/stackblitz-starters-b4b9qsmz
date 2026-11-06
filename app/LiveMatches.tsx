'use client';

import { useEffect, useState } from 'react';

type Match = {
  id: number;
  home: string;
  away: string;
  date: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
};

export default function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch('/api/football');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Kunde inte hämta matcher');
        }

        setMatches(data.matches ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Okänt fel');
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  return (
    <section
      style={{
        background: '#11251b',
        color: 'white',
        padding: '24px',
        borderRadius: '16px',
        marginTop: '24px',
      }}
    >
      <h2 style={{ color: '#4ade80' }}>⚽ Premier League – Riktiga matcher</h2>

      {loading && <p>Hämtar matcher...</p>}

      {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

      {!loading && !error && matches.length === 0 && (
        <p>Inga matcher hittades.</p>
      )}

      {matches.map((match) => (
        <div
          key={match.id}
          style={{
            padding: '16px 0',
            borderBottom: '1px solid #284333',
          }}
        >
          <strong>
            {match.home} – {match.away}
          </strong>

          <p>{new Date(match.date).toLocaleString('sv-SE')}</p>

          <p>
            {match.homeScore !== null && match.awayScore !== null
              ? `${match.homeScore} – ${match.awayScore}`
              : 'Resultat saknas'}
          </p>
        </div>
      ))}
    </section>
  );
}
