import React, { useState } from 'react';
import '../styles/Sidebar.css';

const SidebarComponent = ({ toggleLayer }) => {
    const [activeLayers, setActiveLayers] = useState({});

    const geoJsonFiles = [
        { name: 'Electricity Transmission Lines', url: process.env.PUBLIC_URL + '/data/Electricity_Transmission_Lines.geojson' },
        { name: 'Gas Pipelines', url: process.env.PUBLIC_URL + '/data/Gas_Pipelines.geojson' },
        { name: 'Liquid Fuel Terminals', url: process.env.PUBLIC_URL + '/data/Liquid_Fuel_Terminals.geojson' },
        { name: 'Oil Pipelines', url: process.env.PUBLIC_URL + '/data/Oil_Pipelines.geojson' },
        { name: 'Railway Sidings', url: process.env.PUBLIC_URL + '/data/Railway_Sidings.geojson' },
        { name: 'Railway Stations', url: process.env.PUBLIC_URL + '/data/Railway_Stations.geojson' },
        { name: 'Waste Management Facilities', url: process.env.PUBLIC_URL + '/data/Waste_Management_Facilities.geojson' },
        { name: 'Major Roads', url: process.env.PUBLIC_URL + '/data/Major_Roads.geojson' },
        { name: 'Major Maritime Ports', url: process.env.PUBLIC_URL + '/data/Major_Maritime_Ports.geojson' },
        { name: 'Power Stations', url: process.env.PUBLIC_URL + '/data/Major_Power_Stations.geojson' },
        { name: 'Substations', url: process.env.PUBLIC_URL + '/data/Transmission_Substations.geojson' },
        { name: 'Airports', url: process.env.PUBLIC_URL + '/data/Airports.geojson' }
    ];

    const handleToggle = (name, url) => {
        toggleLayer(name, url);
        setActiveLayers(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    return (
        <div className="sidebar">
            <h3>Toggle Layers</h3>
            {geoJsonFiles.map(file => (
                <button
                    key={file.name}
                    onClick={() => handleToggle(file.name, file.url)}
                    className={activeLayers[file.name] ? 'active' : ''}
                >
                    Show {file.name}
                </button>
            ))}
        </div>
    );
};

export default SidebarComponent;
