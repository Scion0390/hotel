const mongoose= require("mongoose");
const User= require("./user.js");

async function main(){
    await    mongoose.connect('mongodb://127.0.0.1:27017/hotel');
}
main().then(()=>{
        console.log("Database Connected")
}).catch((err)=>{
        console.log(err);
})

const Users = [
  {
    title: "Aman Singh",
    img: "https://picsum.photos/seed/aman/600/400",
    info: "Front-end developer, React & Vue",
    time: "2 Days",
    price: 1200,
    location: "Mumbai"
  },
  {
    title: "Neha Sharma",
    img: "https://picsum.photos/seed/neha/600/400",
    info: "Digital marketer & content writer",
    time: "2 Days 1 Night",
    price: 950,
    location: "New Delhi"
  },
  {
    title: "Priya Verma",
    img: "https://picsum.photos/seed/priya/600/400",
    info: "Civil engineer (site supervisor)",
    time: "1 Day",
    price: 1350,
    location: "Bengaluru"
  },
  {
    title: "Vikram Joshi",
    img: "https://picsum.photos/seed/vikram/600/400",
    info: "Photographer — wedding & events",
    time: "5 Days",
    price: 450,
    location: "Pune"
  },
  {
    title: "Sneha Kapoor",
    img: "https://picsum.photos/seed/sneha/600/400",
    info: "UX/UI designer — mobile apps",
    time: "7 Days 8 Nights",
    price: 800,
    location: "Kolkata"
  },
  {
    title: "Kavya Iyer",
    img: "https://picsum.photos/seed/kavya/600/400",
    info: "School teacher — maths & science",
    time: "1 Night",
    price: 1100,
    location: "Chennai"
  },
  {
    title: "Sameer Khan",
    img: "https://picsum.photos/seed/sameer/600/400",
    info: "E-commerce specialist",
    time: "3 Days 2 Nights",
    price: 300,
    location: "Hyderabad"
  },
];

User.insertMany(Users).then(()=>{
    console.log("Data was Saved");
}).catch((err)=>{
    console.log(err);
})