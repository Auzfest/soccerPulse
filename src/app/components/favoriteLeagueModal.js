const FavoriteLeagueModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add League to Favorites?</h2>
            <p className="mb-6">Would you like to favorite this league as well?</p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onConfirm}
                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                    Yes
                </button>
                <button
                    onClick={onClose}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                    No
                </button>
            </div>
        </div>
    </div>
);

export default FavoriteLeagueModal;