const socket=io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", {
            latitude,
            longitude
        });
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
    }

    );
}

const map=L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const markers={};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        const marker = L.marker([latitude, longitude]).addTo(map);
        markers[id] = marker;
    }
});

socket.on("disconnect", (id) => { 
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});