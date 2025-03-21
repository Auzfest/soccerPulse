import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GameWidget({ game }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const [showScore, setShowScore] = useState(false);
  setTimeout(() => setIsLoaded(true), 300);
  if (!game || game.length === 0) {
    return (
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        textAlign: 'center',
      }}>
        <p>Fixtures are unavailable at the moment. Please try again later.</p>
      </div>
    );
  }
  useEffect(() => {
  const Gamedate = new Date(game.fixture.date).toLocaleString();
  const Today = new Date().toLocaleString();

  if(Gamedate <= Today){
    setIsPast(true);
    setShowScore(false);
  }
  else{
    setIsPast(false);
    setShowScore(true);
  }
  }, [game]);

  return (
    <div className={`border border-gray-300 rounded-lg mx-4 my-6 flex flex-col items-center transition ease-in-out duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid grid-cols-[2fr_1fr_2fr] items-center justify-center">
        {/* Home Team */}
        <div className="flex flex-col items-center">
          <Link href={`/team/${game.teams.home.id}-${game.league.id}`}>
            <img
              src={game.teams.home.logo}
              alt={game.teams.home.name}
              className="w-24 h-24 object-contain"
            />
          </Link>
        </div>
        {/* VS Separator */}
        <div className="m-0 text-xl font-semibold text-gray-600">vs</div>

        {/* Away Team */}
        <div className="flex flex-col items-center">
          <Link href={`/team/${game.teams.away.id}-${game.league.id}`}>
            <img
              src={game.teams.away.logo}
              alt={game.teams.away.name}
              className="w-24 h-24 object-contain"
            />
          </Link>
        </div>
        <h3 className="sm:text-md md:text-lg font-bold text-gray-800">{game.teams.home.name}</h3>
        <div></div>
        <h3 className="sm:text-md md:text-lg font-bold text-gray-800">{game.teams.away.name}</h3>
      </div>

      {/* Game Details */}
      <div className="mt-4 text-gray-700 text-center">
        <p className="text-lg"><span className="font-semibold">Date:</span> {new Date(game.fixture.date).toLocaleString()}</p>
        <p className="text-lg"><span className="font-semibold">Venue:</span> {game.fixture.venue.name}</p>
        <p className="text-lg"><span className="font-semibold">Status:</span> {game.fixture.status.long}</p>
        
        <p className={`text-xl font-bold mt-2 ${!showScore ? 'blur-sm' : ''}`}>
          <span>{game.goals.home ?? '-'}</span> - 
          <span> {game.goals.away ?? '-'}</span>
        </p>
        {isPast ? (
          showScore ? (
            <div className="mt-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setShowScore(false)}
              >
                Hide Score
              </button>
            </div>
          ) : (
            <div className="mt-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowScore(true)}
              >
                Show Score
              </button>
            </div>
          )
        ) : (
          <div className="mt-8 px-4 py-2"></div>
        )}
      </div>
    </div>
  );
}
