import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API-nyckeln saknas.' }, { status: 500 });
  }

  try {
    const response = await fetch(
      'https://api.football-data.org/v4/competitions/PL/matches',
      {
        headers: {
          'X-Auth-Token': apiKey,
          Accept: 'application/json',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Fotbolls-API:et svarade med ett fel.',
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const matches = data.matches.map((match: any) => ({
      id: match.id,
      home: match.homeTeam?.name ?? 'Okänt lag',
      away: match.awayTeam?.name ?? 'Okänt lag',
      date: match.utcDate,
      status: match.status,
      homeScore: match.score?.fullTime?.home ?? null,
      awayScore: match.score?.fullTime?.away ?? null,
    }));

    return NextResponse.json({
      league: 'Premier League',
      source: 'football-data.org',
      matches,
    });
  } catch (error) {
    const cause =
      error instanceof Error
        ? (
            error as Error & {
              cause?: { code?: string; message?: string };
            }
          ).cause
        : undefined;

    console.error('SPORTIQ API-fel:', error);

    return NextResponse.json(
      {
        error: 'Kunde inte hämta fotbollsdata.',
        details: error instanceof Error ? error.message : String(error),
        cause: cause?.message ?? null,
        code: cause?.code ?? null,
      },
      { status: 502 }
    );
  }
}
