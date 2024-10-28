import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';
import SidebarComponent from './SidebarComponent';

const lineStyles = {
    'Transmission Lines Capacity < 132 kV': { color: 'yellow', weight: 2 },
    'Transmission Lines Capacity 132-220 kV': { color: 'orange', weight: 3 },
    'Transmission Lines Capacity 220-500 kV': { color: 'red', weight: 4 },
    'Transmission Lines Capacity >= 500 kV': { color: 'purple', weight: 5 },
    'Gas Pipelines Gas Pipeline': { color: 'grey', weight: 3 },
    'Gas Pipelines Proposed Gas Pipeline': { color: 'grey', dashArray: '5, 5', weight: 3 },
    'Oil Pipelines Oil pipeline': { color: 'black', weight: 3 },
    'Oil Pipelines Proposed Oil pipeline': { color: 'black', dashArray: '5, 5', weight: 3 },
    'Railway Lines Operational': { color: 'blue', weight: 2 },
    'Railway Lines Abandoned': { color: 'blue', dashArray: '3, 3', weight: 1 },
    'Railway Lines Dismantled': { color: 'blue', dashArray: '1, 5', weight: 1 }
};

const icons = {
    'Airports Small Airport': '/assets/images/airport1.png',
    'Airports Medium Airport': '/assets/images/airport2.png',
    'Airports Large Airport': '/assets/images/airport3.png',
    'Airports Heliport': '/assets/images/heliport.png',
    'Liquid Fuel Terminals Operational': '/assets/images/fuel_terminal1.png',
    'Liquid Fuel Terminals Decommissioned': '/assets/images/fuel_terminal2.png',
    'Railway Stations Operational': '/assets/images/railway_station1.png',
    'Railway Stations Abandoned': '/assets/images/railway_station2.png',
    'Railway Stations Disused': '/assets/images/railway_station3.png',
    'Major Power Stations Water': '/assets/images/power_station_blue.png',
    'Major Power Stations Wind': '/assets/images/power_station_aqua.png',
    'Major Power Stations Natural Gas': '/assets/images/power_station_lgrey.png',
    'Major Power Stations Coal': '/assets/images/power_station_black.png',
    'Major Power Stations Solar': '/assets/images/power_station_yellow.png',
    'Major Power Stations Biogas': '/assets/images/power_station_green.png',
    'Major Power Stations Distillate': '/assets/images/power_station_purple.png',
    'Major Power Stations Biomass': '/assets/images/power_station_brown.png',
    'Major Power Stations Coal Seam Methane': '/assets/images/power_station_dgrey.png',
    'Major Power Stations Other': '/assets/images/power_station_pink.png',
    'Transmission Substation Substations': '/assets/images/substation1.png',
    'Transmission Substation Zone': '/assets/images/substation2.png',
    'Transmission Substation Terminal': '/assets/images/substation3.png',
    'Transmission Substation Switchyard': '/assets/images/substation4.png',
    'Transmission Substation Transmission': '/assets/images/substation5.png',
    'Waste Management C&D Waste Recycling Facility': '/assets/images/waste_management1.png',
    'Waste Management Putrescible Landfill': '/assets/images/waste_management2.png',
    'Waste Management Transfer Station': '/assets/images/waste_management3.png',
    'Waste Management Reuse Shop': '/assets/images/waste_management4.png',
    'Waste Management Organics Recycling Facility': '/assets/images/waste_management5.png',
    'Waste Management E-Waste Drop-Off Facility': '/assets/images/waste_management6.png',
    'Waste Management Materials Recovery Facility': '/assets/images/waste_management7.png',
    'Waste Management Other Waste Facility': '/assets/images/waste_management8.png',
    'Waste Management Soft Plastics Drop-Off Facility': '/assets/images/waste_management9.png',
    'Waste Management Other Recycling Facility': '/assets/images/waste_management10.png',
    'Waste Management Unclassified Landfill': '/assets/images/waste_management11.png',
    'Waste Management Metals Recovery Facility': '/assets/images/waste_management12.png',
    'Waste Management Plastics Recovery Facility': '/assets/images/waste_management13.png',
    'Waste Management Plastics Processing Facility': '/assets/images/waste_management14.png',
    'Waste Management Paper Recycling Facility': '/assets/images/waste_management15.png',
    'Waste Management Rubber Recycling Facility': '/assets/images/waste_management16.png',
    'Waste Management Inert Landfill': '/assets/images/waste_management17.png',
    'Waste Management CDS Drop-Off Facility': '/assets/images/waste_management18.png',
    'Waste Management Other': '/assets/images/waste_management19.png',
    'Maritime Ports Commodity': '/assets/images/port1.png',
    'Maritime Ports Commodity & Military': '/assets/images/port2.png',
    'Mineral Deposits Mineral Deposit': '/assets/images/mineral_deposits1.png',
    'Mineral Deposits Historic Mine': '/assets/images/mineral_deposits2.png',
    'Mineral Deposits Mine Under Development': '/assets/images/mineral_deposits3.png',
    'Mineral Deposits Operating Mine': '/assets/images/mineral_deposits4.png',
    'Mineral Deposits Care and Maintenance': '/assets/images/mineral_deposits5.png',
    // Add more icons as needed
};

const addGeoJSONLayer = (data, type, subType, property, value, searchText, map) => {
    const onEachFeature = (feature, layer) => {
        if (feature.properties) {
            let popupContent = '<ul>';
            for (const prop in feature.properties) {
                popupContent += `<li><strong>${prop}</strong>: ${feature.properties[prop]}</li>`;
            }
            popupContent += '</ul>';
            layer.bindPopup(popupContent);
        }
    };

    const filterFeature = (feature, file) => {
        let matchesProperty = false;
        if (property === 'capacity_kv') {
            const capacity = feature.properties[property];
            if (value === '<132') matchesProperty = capacity < 132;
            if (value === '>=132<220') matchesProperty = capacity >= 132 && capacity < 220;
            if (value === '>=220<500') matchesProperty = capacity >= 220 && capacity < 500;
            if (value === '>=500') matchesProperty = capacity >= 500;
        } else if (value === 'Other') {
            const specifiedValues = file.subTypes.map(sub => sub.value);
            matchesProperty = !specifiedValues.includes(feature.properties[property]);
        } else {
            matchesProperty = feature.properties[property] === value;
        }

        // Check if searchText matches any property value in the feature
        const matchesSearchText = searchText
            ? Object.values(feature.properties).some(propValue =>
                String(propValue).toLowerCase().includes(searchText.toLowerCase())
            )
            : true;

        return matchesProperty && matchesSearchText;
    };

    const layer = L.geoJSON(data, {
        filter: (feature) => filterFeature(feature, { subTypes: [/* Provide necessary subTypes here */] }),
        style: (feature) => {
            const key = `${type} ${subType}`;
            return lineStyles[key] || {};
        },
        pointToLayer: (feature, latlng) => {
            const key = `${type} ${subType}`;
            const icon = icons[key];
            if (!icon) {
                console.error(`Icon not found for key: ${key}`);
                return L.marker(latlng);
            }
            return L.marker(latlng, { icon: L.icon({ iconUrl: icon, iconSize: [15, 15] }) });
        },
        onEachFeature: onEachFeature
    });

    layer.addTo(map);
    return layer;
};


const MapComponent = ({ geoJsonFiles }) => {
    const [map, setMap] = useState(null);
    const [layers, setLayers] = useState({});
    const [activeLayers, setActiveLayers] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (map) return;

        const mapElement = document.getElementById('map');
        const mapInstance = L.map(mapElement).setView([-25.2744, 133.7751], 5);
        setMap(mapInstance);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(mapInstance);
    }, []);

    const addLegendToMap = (map, activeLayers) => {
        if (map.legend) {
            map.removeControl(map.legend);
        }

        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = '<h4>Legend</h4>';

            activeLayers.forEach(layer => {
                const layerName = layer.split(' ').slice(1).join(' ');
                if (icons[layer]) {
                    div.innerHTML += `<i style="background-image: url(${icons[layer]}); width: 20px; height: 20px; display: inline-block;"></i> ${layerName}<br>`;
                } else if (lineStyles[layer]) {
                    const style = lineStyles[layer];
                    const dashArray = style.dashArray ? `stroke-dasharray: ${style.dashArray};` : '';
                    div.innerHTML += `<svg width="20" height="10" style="display: inline-block;"><line x1="0" y1="5" x2="20" y2="5" style="stroke:${style.color}; stroke-width:2; ${dashArray}"></line></svg> ${layerName}<br>`;
                }
            });

            return div;
        };

        legend.addTo(map);
        map.legend = legend;
    };

    useEffect(() => {
        if (!map) return;
        addLegendToMap(map, activeLayers);

        return () => {
            if (map.legend) {
                map.removeControl(map.legend);
            }
        };
    }, [map, activeLayers, searchText]);

    const applySearchFilter = () => {
        console.log('applySearchFilter called with searchText:', searchText);

        // Split search text by commas and trim whitespace to create an array of search terms
        const searchTerms = searchText.split(',').map(term => term.trim().toLowerCase());

        activeLayers.forEach(layerName => {
            if (layers[layerName]) {
                map.removeLayer(layers[layerName]);
                console.log(`Removed layer: ${layerName}`);
            }
        });

        setActiveLayers([]);

        geoJsonFiles.forEach(file => {
            file.subTypes.forEach(subTypeObj => {
                const layerName = `${file.name} ${subTypeObj.name}`;

                if (activeLayers.includes(layerName)) {
                    fetchAndToggleLayer(file.name, subTypeObj.name, subTypeObj.property, subTypeObj.value, subTypeObj.url, searchTerms, true);
                }
            });
        });
    };

    const fetchAndToggleLayer = async (type, subType, property, value, url, searchTerms, isSearchUpdate = false) => {
        const uniqueId = subType ? `${type} ${subType}` : type;

        if (!Array.isArray(searchTerms)) {
            searchTerms = [searchTerms]; // Convert to array if it's not already
        }

        if (!isSearchUpdate && activeLayers.includes(uniqueId)) {
            if (layers[uniqueId]) {
                map.removeLayer(layers[uniqueId]);
                console.log(`Removed layer: ${uniqueId}`);
            }
            setActiveLayers(prev => prev.filter(layer => layer !== uniqueId));
            return;
        }

        try {
            if (!url) throw new Error('URL is null or undefined');
            const timestamp = new Date().getTime();
            const cacheBypassUrl = `${url}?t=${timestamp}`;

            const response = await fetch(cacheBypassUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log(`Adding layer with search terms: ${searchTerms}`);

            // Filter features to match any of the search terms
            const filteredData = {
                ...data,
                features: data.features.filter(feature =>
                    searchTerms.some(term =>
                        Object.values(feature.properties).some(prop =>
                            String(prop).toLowerCase().includes(term)
                        )
                    )
                )
            };

            const newLayer = addGeoJSONLayer(filteredData, type, subType, property, value, searchTerms.join(', '), map);

            setLayers(prev => ({ ...prev, [uniqueId]: newLayer }));
            setActiveLayers(prev => [...prev, uniqueId]);
        } catch (error) {
            console.error(`Error fetching GeoJSON: ${error}`);
        }
    };



    const toggleLayer = (type, subType, property, value, url) => {
        fetchAndToggleLayer(type, subType, property, value, url, searchText);
    };

    return (
        <div className="map-container">
            <SidebarComponent
                toggleLayer={toggleLayer}
                updateSearchText={setSearchText}
                geoJsonFiles={geoJsonFiles}
                applySearchFilter={applySearchFilter}
            />
            <div id="map" className="map"></div>
        </div>
    );
};

export default MapComponent;