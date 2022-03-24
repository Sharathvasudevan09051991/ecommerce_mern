const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

//routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

//app
const app = express();

//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

//DB Connection
mongoose.connect(process.env.DATABASE, {
   useNewUrlParser: true
}).then(() => console.log("DB Connected Successfully"))

//routes Middleware
app.use("/api", authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);


//PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
