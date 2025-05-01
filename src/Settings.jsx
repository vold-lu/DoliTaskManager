import React from 'react';

const Settings = ({apiKey, setApiKey, apiUrl, setApiUrl}) => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <input
                type="text"
                className="border p-2 w-full rounded"
                placeholder="Entrer l'endpoint de l'API"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
            />
            <input
                type="text"
                className="border p-2 w-full rounded"
                placeholder="Entrer votre clé API"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />
        </div>
    );
};

export default Settings;
