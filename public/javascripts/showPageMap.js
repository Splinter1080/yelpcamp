
mapboxgl.accessToken = mapToken ; //comes from other script in ejs , can't acces from .env file for some reason !
const map = new mapboxgl.Map({
    container : 'map', 
    style: 'mapbox://styles/mapbox/streets-v10', // stylesheet location
    center: campground.geometry.coordinates, //[long, lat]
    zoom: 9
})

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h4>${campground.title}</h4><p>${campground.location}</p>`
            )
    )
    .addTo(map)