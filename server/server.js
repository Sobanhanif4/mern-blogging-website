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
import Blog from './Schema/Blog.js';

const serviceAccountKey = JSON.parse(
    fs.readFileSync(path.resolve('./mern-blogging-web-72a84-firebase-adminsdk-344c9-dc694c57b8.json'))
);
import aws from "aws-sdk";


import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
import { error } from 'console';
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

//Setting up s3 bucket
const s3 = new aws.S3({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const generateUploadURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'blogging-mern',
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg"

    })
}

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({ error: "No access token" })
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Access token is invalid" })
        }

        req.user = user.id
        next()
    })
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


//upload image url route

server.get('/get-upload-url', (req, res) => {
    generateUploadURL().then(url => res.status(200).json({ uploadURL: url }))
        .catch(err => {
            console.log(err.message);
            return res.status(500).json({ error: err.message })

        })
})

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
                return res.status(403).json({ "error": "Account was signed in with google, try log in with google." })
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

server.post('/create-blog', verifyJWT, (req, res) => {

    let authorID = req.user;

    let { title, des, banner, tags, content, draft } = req.body;

    if (!title.length) {
        return res.status(403).json({ error: "You must provide a title to publish the blog" });
    }


    if (!draft) {
        if (!des.length || des.length > 200) {
            return res.status(403).json({ error: "You must provide description under 200 words" });
        }
        if (!banner.length) {
            return res.status(403).json({ error: "You must provide a banner" });
        }

        if (!content.blocks.length) {
            return res.status(403).json({ error: "There must be some blog content to publish it" })
        }

        if (!tags.length) {
            return res.status(403).json({ error: "Provide tags in order to publish the blog, Maximum 10" })
        }
    }




    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    let blog = new Blog({
        title, des, banner, content, tags, author: authorID, blog_id, draft: Boolean(draft)
    })

    blog.save().then(blog => {

        let incrementVal = draft ? 0 : 1;

        User.findOneAndUpdate({ _id: authorID }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog._id } }).then(user => {
            return res.status(200).json({ id: blog.blog_id })
        })
            .catch(err => {
                return res.status(500).json({ error: "Failed to update total posts number" })
            })

    })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })

})

server.listen(PORT, () => {
    console.log('listening on the server ->' + PORT);
})

