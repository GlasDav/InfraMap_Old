import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';
import { getIconByType } from '../utils/icons';
import SidebarComponent from './SidebarComponent';

const lineStyles = {
    'Electricity Transmission Lines': { color: 'orange', weight: 3 },
    'Gas Pipelines': { color: 'grey', weight: 3 },
    'Oil Pipelines': { color: 'black', weight: 3 },
    'Major Roads': { color: 'blue', weight: 3 }
    // Add more styles as needed
};

const addGeoJSONLayer = (data, name, map) => {
    const layer = L.geoJSON(data, {
        style: (feature) => {
            return lineStyles[name] || {};
        },
        pointToLayer: (feature, latlng) => {
            const icon = getIconByType(feature.properties.class);
            return L.marker(latlng, { icon: icon });
        },
    });
    layer.addTo(map);
    return layer;
};

const MapComponent = () => {
    const [map, setMap] = useState(null);
    const [layers, setLayers] = useState({});

    useEffect(() => {
        const mapElement = document.getElementById('map');
        const mapInstance = L.map(mapElement).setView([-25.2744, 133.7751], 5);
        setMap(mapInstance);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(mapInstance);

        // Legend control
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4>Legend</h4>';
            div.innerHTML += '<i style="background-image: url(/assets/images/icon1.png);"></i> Fuel Terminal<br>';
            div.innerHTML += '<i style="background-image: url(/assets/images/icon2.png);"></i> Railway Station<br>';
            div.innerHTML += '<i style="background-image: url(/assets/images/icon3.png);"></i> Waste Management<br>';
            div.innerHTML += '<i style="background-image: url(/assets/images/icon4.png);"></i> Maritime Ports<br>';
            div.innerHTML += '<i style="background-image: url(/assets/images/icon5.png);"></i> Power Stations<br>';
            div.innerHTML += '<i style="background-image: url(/assets/images/icon6.png);"></i> Substations<br>';
            div.innerHTML += '<i style="background-color: orange; width: 20px; height: 20px; float: left; margin-right: 8px;"></i> Electricity Transmission Lines<br>';
            div.innerHTML += '<i style="background-color: grey; width: 20px; height: 20px; float: left; margin-right: 8px;"></i> Gas Pipelines<br>';
            div.innerHTML += '<i style="background-color: black; width: 20px; height: 20px; float: left; margin-right: 8px;"></i> Oil Pipelines<br>';
            div.innerHTML += '<i style="background-color: blue; width: 20px; height: 20px; float: left; margin-right: 8px;"></i> Major Roads<br>';
            return div;
        };

        legend.addTo(mapInstance);

    }, []);

    const toggleLayer = async (name, url) => {
        if (map) {
            if (layers[name]) {
                map.removeLayer(layers[name]);
                setLayers((prev) => {
                    const newLayers = { ...prev };
                    delete newLayers[name];
                    return newLayers;
                });
            } else {
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    const newLayer = addGeoJSONLayer(data, name, map);
                    setLayers((prev) => ({ ...prev, [name]: newLayer }));
                } catch (error) {
                    console.error(`Error fetching GeoJSON: ${error}`);
                }
            }
        }
    };

    return (
        <div className="map-container">
            <SidebarComponent toggleLayer={toggleLayer} />
            <div id="map" className="map"></div>
        </div>
    );
};

export default MapComponent;
