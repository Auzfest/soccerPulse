import { useEffect, useState } from 'react';

export default function PlayerWidget({ teamId }) {
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const fetchedPlayers = await getTeam(teamId);
                if (fetchedPlayers.length > 0) {
                    setPlayers(fetchedPlayers);
                } else {
                    setError(true);
                }
            } catch (error) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (teamId) {
            fetchPlayers();
        }
    }, [teamId]);

    const getTeam = async (id) => {
        const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/players/squads?team=${id}`;
        const options = {
            method: 'GET',
            headers: {
                "x-rapidapi-host": process.env.NEXT_PUBLIC_API_HOST,
                "x-rapidapi-key": process.env.NEXT_PUBLIC_API_KEY,
            },
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch players: ${response.statusText}`);
            }
            const data = await response.json();
            (data);
            return data.response[0]?.players || [];
        } catch (error) {
            console.error("Error fetching players:", error);
            return [];
        }
    };

    const getPlayerStats = async (playerId, season = 2024) => {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    
        const url = `https://${apiHost}/players?id=${playerId}&season=${season}`;
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
                throw new Error(`Failed to fetch player stats: ${response.statusText}`);
            }
    
            const data = await response.json();
            ("Fetched Player Stats:", data);
    
            return data.response[0]?.statistics || [];
        } catch (error) {
            console.error("Error fetching player statistics:", error);
            return [];
        }
    };
    
    const [playerStats, setPlayerStats] = useState([]);

    useEffect(() => {
        const fetchPlayerStats = async () => {
            if (!selectedPlayer) return;
            const stats = await getPlayerStats(selectedPlayer.id);
            setPlayerStats(stats);
        };

        fetchPlayerStats();
    }, [selectedPlayer]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading players...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Failed to load players.</p>;
    }

    if (selectedPlayer) {
        return (
            <div className="bg-gray-300 shadow-md rounded-lg p-6 mt-8 text-center">
                <button 
                    onClick={() => setSelectedPlayer(null)} 
                    className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition">
                    ← Back to Team
                </button>
                <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h2 className="text-2xl font-bold">{selectedPlayer.name}</h2>
                <p className="text-lg text-gray-600">{selectedPlayer.position}</p>
                <p className="text-sm text-gray-500">Age: {selectedPlayer.age}</p>
                <p className="text-sm text-gray-500">Appearances: {selectedPlayer.appearances || "N/A"}</p>
                <p className="text-sm text-gray-500">Goals: {selectedPlayer.goals || "N/A"}</p>
                {playerStats.length > 0 ? (
                <div className="mt-4 bg-gray-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Player Statistics</h3>
                    <p><strong>Appearances:</strong> {playerStats[0].games.appearances}</p>
                    <p><strong>Goals:</strong> {playerStats[0].goals.total || 0}</p>
                    <p><strong>Assists:</strong> {playerStats[0].goals.assists || 0}</p>
                    <p><strong>Yellow Cards:</strong> {playerStats[0].cards.yellow}</p>
                    <p><strong>Red Cards:</strong> {playerStats[0].cards.red}</p>
                </div>
            ) : (
                <p className="text-gray-500">No stats available for this player.</p>
            )}
            </div>
        );
    }

    return (
        <div className="bg-gray-300 shadow-md rounded-lg p-6 mt-8">
            <div className="text-center mb-4">
                <button
                    onClick={toggleExpand}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                    {isExpanded ? "Hide Players" : "Show Players"}
                </button>
            </div>
            {isExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player) => (
                    <div 
                        key={player.id} 
                        className="border border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => setSelectedPlayer(player)}
                    >
                        <img 
                            src={player.photo} 
                            alt={player.name} 
                            className="w-20 h-20 rounded-full mb-2 cursor-pointer transition-transform duration-300 hover:scale-110"
                        />
                        <h3 className="text-lg font-semibold text-blue-500 hover:underline cursor-pointer">{player.name}</h3>
                        <p className="text-gray-600">{player.position}</p>
                        <p className="text-sm text-gray-500">Age: {player.age}</p>
                    </div>

                ))}
            </div>
            )}
        </div>
    );
}
