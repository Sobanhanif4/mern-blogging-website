import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken'
import cors from 'cors';
import fs from 'fs';
import path from 'path';
const serviceAccountKey = JSON.parse(
    fs.readFileSync(path.resolve('./mern-blogging-web-72a84-firebase-adminsdk-344c9-dc694c57b8.json'))
);
import aws from "aws-sdk";


import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
const { credential } = admin;
const server = express();
let PORT = 3001;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json())
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

const s3 = new aws.S3({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secrectAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const generateUploadUrl = () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`
}

const formateDataSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}
const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let isUsernameUnique = await User.exists({ "personal_info.username": username }).then((result) => result)

    isUsernameUnique ? username += nanoid().substring(0, 5) : "";

    return username;
}

server.post("/signup", (req, res) => {

    let { fullname, email, password } = req.body;

    //Validation of frontend data
    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be atleast 3 letters" })
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter Email" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is invalid" })
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a 1 lowercase and 1 uppercase letters" })
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {

        let username = await generateUsername(email);

        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hashed_password,
                username
            }
        })

        user.save().then((u) => {

            return res.status(200).json(formateDataSend(u));

        })
            .catch(err => {
                if (err.code == 11000) {
                    return res.status(500).json({ "error": "Email is already registerd, Please Use another email!" })
                }
                return res.status(500).json({ "error": err.message })
            })

    })
    // return res.status(200).json({ "status": "Okay" })
})

// Sign In
server.post("/signin", (req, res) => {

    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "Email not Found" });
            }

            if (!user.google_auth) {
                bcrypt.compare(
                    password,
                    user.personal_info.password,
                    (err, result) => {
                        if (err) {
                            return res.status(403).json({ "error": "Error occured while login, please try again" })
                        }

                        if (!result) {
                            return res.status(403).json({ "error": "Incorrect Password" }
                            )
                        } else {
                            return res.status(200).json(formateDataSend(user))
                        }
                    })
            } else { 
                return res.status(403).json({"error": "Account was signed in with google, try log in with google."})
            }
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).json({ "error": err.message })
        })
})

server.post("/google-auth", async (req, res) => {

    let { access_token } = req.body;

    getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {

            let { email, name, picture } = decodedUser;

            picture = picture.replace("s96-c", "s384-c");

            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
                return u || null;
            })
                .catch(err => {
                    return res.status(500).json({ "error": err.message })
                })

            if (user) { //login
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "This email was signed in without google. Please log in with password to access the account." })
                }
            }
            else { //sign up

                let username = await generateUsername(email);

                user = new User({
                    personal_info: {
                        fullname: name, email, username
                    },
                    google_auth: true
                })

                await user.save().then((u) => {
                    user = u;
                })
                    .catch(err => {
                        return res.status(500).json({ "error": err.message })
                    })
            }
            return res.status(200).json(formateDataSend(user))
        }).catch(err => {
            return res.status(500).json({ "error": "Failed to authenticate you with google. Try again some other time." })
        })

})

server.listen(PORT, () => {
    console.log('listening on the server ->' + PORT);
})

