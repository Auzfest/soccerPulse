import React, { useEffect, useState, useRef } from 'react';
import GameWidget from '@/app/components/gameWidget';

export default function GamesTableWidget({ teamId, leagueId }) {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState("2024");
    const [seasons, setSeasons] = useState(["2021", "2022", "2023", "2024", "2025"]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const gameWidgetRef = useRef(null);

    useEffect(() => {
        const fetchGames = async () => {
            const apiHost = process.env.NEXT_PUBLIC_API_HOST;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;
            const url = `https://${apiHost}/fixtures?team=${teamId}&league=${leagueId}&season=${selectedSeason}`;

            const options = {
                method: "GET",
                headers: {
                    "x-rapidapi-host": apiHost,
                    "x-rapidapi-key": apiKey
                }
            };

            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`Failed to fetch games: ${response.statusText}`);
                }
                const data = await response.json();
                setGames(data.response || []);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching games:", error);
                setError(true);
                setIsLoading(false);
            }
        };

        if (teamId && leagueId) {
            fetchGames();
        }
    }, [teamId, leagueId, selectedSeason]);

    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
        setIsLoading(true);
        setSelectedGame(null);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        setSelectedGame(null);
    };

    useEffect(() => {
        if (selectedGame && gameWidgetRef.current) {
            gameWidgetRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'       
            });
        }
    }, [selectedGame]);

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading games...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Failed to load games.</p>;
    }

    return (
        <div className="bg-gray-300 shadow-md rounded-lg p-6 mt-8 transition-all duration-300">
            <h2 className="text-2xl font-bold text-center mb-4">All Games</h2>

            {/* Expand/Collapse Button */}
            <div className="text-center mb-4">
                <button
                    onClick={toggleExpand}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                    {isExpanded ? "Hide Games" : "Show Games"}
                </button>
            </div>

            {/* Smooth Expand/Collapse with Tailwind CSS */}
            <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {/* Season Selector */}
                <div className="flex justify-center mb-4">
                    <label htmlFor="season-select" className="mr-2 text-lg font-semibold">Select Season:</label>
                    <select
                        id="season-select"
                        value={selectedSeason}
                        onChange={handleSeasonChange}
                        className="border border-gray-400 rounded p-1"
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                </div>

                {/* Games Table */}
                {!selectedGame && (
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4">Date</th>
                                    <th className="py-2 px-4">Opponent</th>
                                    <th className="py-2 px-4">Result</th>
                                    <th className="py-2 px-4">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.map((game) => (
                                    <tr
                                        key={game.fixture.id}
                                        className="text-center border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => setSelectedGame(game)}
                                    >
                                        <td className="py-2 px-4">{new Date(game.fixture.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">
                                            {game.teams.home.id === teamId
                                                ? game.teams.away.name
                                                : game.teams.home.name}
                                        </td>
                                        <td className="py-2 px-4">
                                            {game.teams.home.id === teamId
                                                ? (game.score.winner === 'home' ? 'Win' : game.score.winner === 'away' ? 'Loss' : 'Draw')
                                                : (game.score.winner === 'away' ? 'Win' : game.score.winner === 'home' ? 'Loss' : 'Draw')}
                                        </td>
                                        <td className="py-2 px-4">
                                            {game.goals.home} - {game.goals.away}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {selectedGame && (
                <div
                    ref={gameWidgetRef}
                    className="mt-8 transition-opacity duration-500"
                >
                    <h2 className="text-xl font-bold mb-4 text-center">Game Details</h2>
                    <GameWidget game={selectedGame} />
                    <button
                        onClick={() => setSelectedGame(null)}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
                    >
                        Back to Games
                    </button>
                </div>
            )}
        </div>
    );
}
