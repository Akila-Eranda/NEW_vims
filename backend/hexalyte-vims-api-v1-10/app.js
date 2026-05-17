const dotenv = require('dotenv')
dotenv.config({ path: '.env.dev' })
const express = require('express')
const app = express()
const routeManager = require('./route/route.manager.js')
const db = require("./models/index");
const cors = require('cors')
const swaggerDocs = require('./swagger.js')
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const helmet = require('helmet');
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
//const xss = require('xss-clean');
// const querystring = require('querystring');
// var URLSearchParams = require('url-search-params');

const fs = require('fs')
const https = require('https')


// set security HTTP headers
app.use(helmet());
// app.use(xss());
// app.use(querystring());
// app.use(URLSearchParams());
app.use(morgan("dev"));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended:true }))

// CORS Configuration - Allow frontend to access API
const allowedOrigins = [
    process.env.CORS_ORIGIN || 'https://vims.hexalyte.com',
    'https://api.vims.hexalyte.com',
    'http://localhost:3000',
    'http://localhost:3002'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        // Allow any hexalyte.com subdomain
        if (origin && origin.match(/https?:\/\/([a-z0-9-]+\.)?hexalyte\.com$/)) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
}));

// Your regular express app setup
// ...

// SSL options
// const options = {
//     cert: fs.readFileSync('/etc/letsencrypt/live/vims.hexalyte.com/fullchain.pem'),
//     key: fs.readFileSync('/etc/letsencrypt/live/vims.hexalyte.com/privkey.pem')
//   };
  
//   // Create HTTPS server
//   https.createServer(options, app).listen(443, () => {
//     console.log('HTTPS server running on port 443');
//   });
  
//   // Optional: Also keep the HTTP server running and redirect to HTTPS
//   const http = require('http');
//   http.createServer((req, res) => {
//     res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
//     res.end();
//   }).listen(80);

// Database sync disabled - migrations handle schema creation/updates
// Sequelize sync can cause issues with custom indexes and constraints
console.log("Skipping db.sequelize.sync() - using migrations for schema management");

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

routeManager(app)
swaggerDocs(app, process.env.PORT)

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({
        status: 'fail',
        code: 500,
        error: `Can't find ${err.stack}`
    });
});

// 404 handler
app.use(function (req, res, next) {
    res.status(404).json({
        status: 'fail',
        code: 404,
        error: `Can't find ${req.originalUrl}`
    });
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason', reason )
})

app.listen(process.env.PORT, () => {
    console.log(`:::::::::::::::: SERVER RUNNING ON ${process.env.PORT}.`);
});