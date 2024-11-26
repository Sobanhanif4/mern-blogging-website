// import express from 'express'
// import mongoose from 'mongoose';
// import 'dotenv/config'
// import bcrypt from 'bcrypt';
// import User from './Schema/User.js';
// import { nanoid } from 'nanoid';
// import jwt from 'jsonwebtoken'
// import cors from "cors";


// const server = express();
// let PORT = 3001;


// let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
// let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// server.use(express.json())
// server.use(cors())

// mongoose.connect(process.env.DB_LOCATION, {
//     autoIndex: true
// })

// const formateDataSend = (user) => {

//     const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

//     return {
//         access_token,
//         profile_img: user.personal_info.profile_img,
//         username: user.personal_info.username,
//         fullname: user.personal_info.fullname
//     }
// }

// const generateUsername = async (email) => {
//     let username = email.split("@")[0];

//     let isUsernameUnique = await User.exists({ "personal_info.username": username }).then((result) => result)

//     isUsernameUnique ? username += nanoid().substring(0, 5) : "";

//     return username;
// }

// server.post("/signup", (req, res) => {

//     let { fullname, email, password } = req.body;

//     //Validation of frontend data
//     if (fullname.length < 3) {
//         return res.status(403).json({ "error": "Fullname must be atleast 3 letters" })
//     }
//     if (!email.length) {
//         return res.status(403).json({ "error": "Enter Email" })
//     }
//     if (!emailRegex.test(email)) {
//         return res.status(403).json({ "error": "Email is invalid" })
//     }
//     if (!passwordRegex.test(password)) {
//         return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a 1 lowercase and 1 uppercase letters" })
//     }

//     bcrypt.hash(password, 10, async (err, hashed_password) => {

//         let username = await generateUsername(email);

//         let user = new User({
//             personal_info: {
//                 fullname,
//                 email,
//                 password: hashed_password,
//                 username
//             }
//         })

//         user.save().then((u) => {

//             return res.status(200).json(formateDataSend(u));

//         })
//             .catch(err => {
//                 if (err.code == 11000) {
//                     return res.status(500).json({ "error": "Email is already registerd, Please Use another email!" })
//                 }
//                 return res.status(500).json({ "error": err.message })
//             })

//     })
//     // return res.status(200).json({ "status": "Okay" })
// })

// // Sign In

// server.post("/signin", (req, res) => {
//     let { email, password } = req.body;

//     User.findOne({ "personal_info.email": email })
//         .then((user) => {
//             if (!user) {
//                 return res.status(403).json({ "error": "Email not Found" });
//             }

//             bcrypt.compare(
//                 password,
//                 user.personal_info.password,
//                 (err, result) => {
//                     if (err) {
//                         return res.status(403).json({ "error": "Error occured while login, please try again" })
//                     }

//                     if (!result) {
//                         return res.status(403).json({ "error": "Incorrect Password" }
//                         )
//                     } else {
//                         return res.status(200).json(formateDataSend(user))
//                     }
//                 })
//         })
//         .catch(err => {
//             console.log(err.message);
//             return res.status(500).json({ "error": err.message })
//         })
// })

// server.listen(PORT, () => {
//     console.log('listening on the server ->' + PORT);
// })

import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from "cors";

const server = express();
let PORT = 3001;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors({ origin: "http://localhost:3001" })); // Replace with your frontend URL


// Database connection
mongoose.connect(process.env.DB_LOCATION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection failed', err);
    });

// Helper function to format response data
const formateDataSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    };
};

// Generate unique username
const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameUnique = await User.exists({ "personal_info.username": username });
    if (isUsernameUnique) {
        username += nanoid().substring(0, 5); // Add random suffix if username exists
    }
    return username;
};

// Sign-up route
server.post("/signup", async (req, res) => {
    console.log("Received Signup Request:", req.body);  // Log incoming data

    let { fullname, email, password } = req.body;

    // Validation checks
    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be at least 3 characters." });
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Please enter an email." });
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is invalid." });
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be between 6 and 20 characters with at least 1 lowercase and 1 uppercase letter." });
    }

    // Hash password and save user
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let username = await generateUsername(email);

        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hashedPassword,
                username
            }
        });

        // Attempt to save user
        await user.save();
        return res.status(200).json(formateDataSend(user));
    } catch (err) {
        console.log("Error saving user:", err);  // Log any error during saving
        if (err.code == 11000) {
            return res.status(500).json({ "error": "Email is already registered. Please use another email!" });
        }
        return res.status(500).json({ "error": err.message });
    }
});

// Sign-in route
server.post("/signin", (req, res) => {
    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "Email not Found" });
            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ "error": "Error occurred during login, please try again." });
                }

                if (!result) {
                    return res.status(403).json({ "error": "Incorrect Password" });
                } else {
                    return res.status(200).json(formateDataSend(user));
                }
            });
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).json({ "error": err.message });
        });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
