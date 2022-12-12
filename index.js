const express = require('express');
let PORT=process.env.PORT;
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors=require("cors");
dotenv.config();
const userRoute=require('./Routes/User');
const cartRoute=require('./Routes/cart');
const productRoute=require('./Routes/product');
const orderRoute=require('./Routes/order');
const authRoute=require('./Routes/auth');
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log("Database Disconnected");
})
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/user',userRoute);
app.use('/api/cart',cartRoute);
app.use('/api/product',productRoute);
app.use('/api/order',orderRoute);

app.use('/api/auth',authRoute);
app.listen(PORT || 6000,() => {
    console.log("Benkend server is running ");
})


