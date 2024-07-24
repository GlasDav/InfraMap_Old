import L from 'leaflet';

// Define icons for each type
const icons = {
    'Fuel Terminal': L.icon({
        iconUrl: process.env.PUBLIC_URL + '/assets/images/icon1.png',
        iconSize: [10, 10], // size of the icon
        iconAnchor: [5, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    }),
    'Railway Station': L.icon({
        iconUrl: process.env.PUBLIC_URL + '/assets/images/icon2.png',
        iconSize: [10, 10],
        iconAnchor: [5, 10],
        popupAnchor: [0, -10]
    }),
    'Waste Management': L.icon({
        iconUrl: process.env.PUBLIC_URL + '/assets/images/icon3.png',
        iconSize: [10, 10],
        iconAnchor: [5, 10],
        popupAnchor: [0, -10]
    }),
    'Maritime Ports': L.icon({
        iconUrl: process.env.PUBLIC_URL + '/assets/images/icon4.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [0, -12]
    }),
    'Power Stations': L.icon({
        iconUrl: process.env.PUBLIC_URL + '/assets/images/icon5.png',
        iconSize: [10, 10],
        iconAnchor: [5, 10],
        popupAnchor: [0, -10]
    }),
    'Substations': L.icon({
        iconUrl: process.env.PUBLIC_URL + '/assets/images/icon6.png',
        iconSize: [10, 10],
        iconAnchor: [5, 10],
        popupAnchor: [0, -10]
    })
};

// Function to get the appropriate icon based on the type
export const getIconByType = (type) => {
    return icons[type] || L.icon({
        iconUrl: process.env.PUBLIC_URL + '/assets/images/icon5.png', // default icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};
