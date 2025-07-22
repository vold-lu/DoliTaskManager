import React from 'react';

const Settings = ({apiKey, setApiKey, apiUrl, setApiUrl, showOnlyMyTasks, setShowOnlyMyTasks, defaultDuration, setDefaultDuration, showClosedTasks, setShowClosedTasks}) => {
    return (
        <div className="flex flex-col gap-2 items-center p-2 bg-blue-50 h-full">
            <label className={'w-full'}>
                URL de l'API
                <input
                    type="text"
                    name={'apiUrl'}
                    className="border p-2 w-full rounded"
                    placeholder="https://localhost"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                />
            </label>

            <label className={'w-full'}>
                Clé de l'API
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="1337"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </label>

            <label className={'w-full'}>
                Durée par défaut
                <input
                    type="number"
                    className="border p-2 w-full rounded"
                    placeholder="30"
                    value={defaultDuration}
                    onChange={(e) => setDefaultDuration(e.target.value)}
                />
            </label>

            <label className={'w-full flex gap-2'}>
                Voir seulement mes tickets
                <input
                    type="checkbox"
                    className="border rounded"
                    checked={showOnlyMyTasks}
                    onChange={(e) => setShowOnlyMyTasks(e.target.checked)}
                />
            </label>

            <label className={'w-full flex gap-2'}>
                Voir aussi les tickets terminés
                <input
                    type="checkbox"
                    className="border rounded"
                    checked={showClosedTasks}
                    onChange={(e) => setShowClosedTasks(e.target.checked)}
                />
            </label>
        </div>
    );
};

export default Settings;
