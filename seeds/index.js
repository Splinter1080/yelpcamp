const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author : '5f91d7bcc1be244585b9f5e8' , 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type: "Point",
                coordinates: [cities[random1000].longitude, 
                                cities[random1000].latitude]
            },
            images: [
                {
                    url : 'https://res.cloudinary.com/dmqzsnqaz/image/upload/v1603727090/YelpCamp/Mountain_xexndt.jpg' , 
                    filename : 'YelpCamp/Mountain_xexndt'
                } , 
                {
                    url: 'https://res.cloudinary.com/dmqzsnqaz/image/upload/v1603727075/YelpCamp/River_zmzc5o.jpg',
                    filename : 'YelpCamp/River_zmzc5o'
                }
            ],
            description : '    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui suscipit rerum quisquam maxime doloribus recusandae pariatur id nihil eligendi soluta voluptatum incidunt, distinctio enim sit mollitia dolore numquam error quibusdam?',
            price: random1000
        })
        //console.log("Hi");
        await camp.save();
        
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})