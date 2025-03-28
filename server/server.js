const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const UserModel = require('./models/usermodels')
const TweetModel = require('./models/tweetmodels')
const FriendModel = require('./models/friendmodels')
const CommentModel = require('./models/commentmodels')
const CAFModel = require('./models/CAF-model')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express()
//connect to database
//port
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cookieParser())

const SECRET_KEY = "5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b"

// Gunakan environment variable

//! DON'T FORGET TO CHANGE THE ORIGIN

const corsOptions = {
    origin: ["https://marr7781.github.io", "http://localhost:5173"], 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
};

app.use(cors(corsOptions));

console.time("MongoDB Connection Time"); // Mulai timer
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://marveltjenyani8:miawmiawaug@test-cluster.zayivlf.mongodb.net/socialmediapp")
    .then(() => {
        console.timeEnd("MongoDB Connection Time");
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.timeEnd("MongoDB Connection Time");
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

// mongoose.connect("mongodb+srv://marveltjenyani8:miawmiawaug@test-cluster.zayivlf.mongodb.net/socialmediapp")

//servertest
app.get('/servertest', (req, res)=> {
    res.json(`Server is working normally`)
})

//check-db-connection
app.get('/check-db-connection', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    res.json({ dbStatus });
});

//handle register
app.post(`/register`, (req, res)=> {
    const {name} = req.body

    UserModel.findOne({name: name})
    .then(user=> {
        if(user){
            res.json(`This username is already used.`)
        } else {
            return UserModel.create(req.body)
            .then(result=> res.json(result))
            .catch(err=> res.json(err))
        }
    })
    .catch(err=> res.json(err))
})

//handle log-in 
//! COOKIE ADDED
app.post(`/login`, (req, res)=> {
    const {name, password} = req.body
    UserModel.findOne({name: name})
    .then(user => {
        if(user) {
            if(user.password === password) {
                const token = jwt.sign({userId: user._id, userName: user.name}, SECRET_KEY, { expiresIn: '1h' })

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 3600000,
                });

                return res.json({
                    message: 'login success',
                })
            } else {
                return res.json(`Password wrong.`)
            }
        }else {
            return res.json(`User not found.`)
        }
    })
    .catch(err => res.json(err))
})

//handle tweet posting
//! COOKIE ADDED
app.post('/home', (req, res)=> {
    const {tweet} = req.body
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        TweetModel.create({id: decoded.userId, userName: decoded.userName, content: tweet})
        .then(result => res.json({message: 'Tweet added', result}))
        .catch(err => res.json(err))
    }
})

//handle userpage
//! COOKIE ADDED
app.get('/userpage', (req, res)=> {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        TweetModel.find({userName: decoded.userName})
        .then(listTweet=> {
        const myContent = 
        listTweet.map(eachTweet=> {
            return (
                {
                    content: eachTweet.content,
                    userName: eachTweet.userName,
                    tweetId: eachTweet._id
                }
            )
        })
        res.json(myContent)
        })
        .catch(err=> res.json(err))
    }
})

//! COOKIE ADDED
app.get('/getName', (req, res)=> {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)
        UserModel.findOne({_id: decoded.userId})
        .then(user => res.json(user.name))
        .catch(err=> res.json(err))
    }

})

//! DOESN'T NEED COOKIE
app.get('/gettweetcontent', (req, res)=> {
    TweetModel.find()
    .then(tweet=> {
        const tweetContent = 
        tweet.map(eachTweet => {
            return (
                {
                    content: eachTweet.content,
                    userName: eachTweet.userName,
                    tweetId: eachTweet._id
                }
            )
        })
        res.json(tweetContent)
    })
    .catch(err=> res.json(err))
})

//handle recall user "name" data
//in search page 
//! DOESN'T NEED COOKIE
app.get('/getNameInSearchPage', (req, res)=> {
    UserModel.find()
    .then(users=> {
        const listUserName = users.map(eachUser => {
            return (
                {
                    name: eachUser.name,
                    userId: eachUser._id,
                }
            )
        })
        res.json(listUserName)
    })
    .catch(err=> res.json(err))
})

//add like
//! DOESN'T NEED COOKIE
app.put('/postLike', (req, res)=> {
    const {tweetId} = req.body
    TweetModel.updateOne({_id: tweetId},
        {$inc: {like: 1} },
        {new: true})
    .then(result=> {
        res.json(result)
    })
    .catch(err=> res.json(err))
})

//get like amount
//! DOESN'T NEED COOKIE
app.get('/getLike', (req, res)=> {
    const {tweetId} = req.query
    TweetModel.findOne({_id: tweetId})
    .then(theTweet=> {
        res.json(theTweet.like)
    })
    .catch(err=> res.json(err))
})

//delete like
//! DOESN'T NEED COOKIE
app.put('/deleteLike', (req, res)=> {
    const {tweetId} = req.body
    TweetModel.updateOne({_id: tweetId},
        {$inc: {like: -1}},
        {new: true})
    .then(result=> {
        res.json(result)
    })
    .catch(err=> res.json(err))
})

//get friend profile data (in search page)
//! DOESN'T NEED COOKIE
app.get('/getUserProfile', (req, res) => {
    const { friendId } = req.query;
    
    TweetModel.find({ id: friendId })
        .then(tweets => {
            return UserModel.findOne({ _id: friendId })
                .then(user => {
                    if(tweets.length > 0){
                        const tweetData = tweets.map(eachTweet=> {
                            return ({
                                username: user.name, 
                                tweetId: eachTweet._id,
                                content: eachTweet.content,
                                likeAmount: eachTweet.like,
                            })
                        }) 
                        res.json(tweetData)
                    } else {
                        const tweetData = [{
                            username: user.name
                        }]
                        res.json(tweetData)
                    }
                })
        })
        .catch(err => {
            res.json(err);
        });
});

//follow management / add friend (follow)
//! COOKIE ADDED
app.post('/addFollowList', (req, res)=> {
    const {friendId} = req.body
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        FriendModel.findOne({userId: decoded.userId})
        .then(result=> {
            if(result) {
                FriendModel.updateOne({userId: decoded.userId},
                    {$push: {friends: friendId}})
                .then(result=> res.json(result))
                .catch(err=> res.json(err))
            } else {
                FriendModel.create({userId: decoded.userId, friends: friendId})
                .then(result=> {
                    res.json(result)
                })
                .catch(err=> res.json(err))
            }
        })   
    }
})

//follow management / delete friend (unfollow)
//! COOKIE ADDED
app.put('/deleteFollowList', (req, res)=> {
    const {friendId} = req.body
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        FriendModel.updateOne({userId: decoded.userId}, 
            {$pull: {friends: friendId}})
        .then(result=> res.json(result))
        .catch(err=> res.json(err))
    }
})

//get friends list in and put it in friend-page
//! COOKIE ADDED
app.get('/getFriendsData', (req, res)=> {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        FriendModel.findOne({userId: decoded.userId})
        .then(user=> {
            res.json(user.friends)
        })
        .catch(err => res.json(err))
    }
})

//just to get the name for friend page
//! DOESN'T NEED COOKIE
app.get('/getFriendsName', (req, res)=> {
    const {Id} = req.query

    UserModel.findOne({_id: Id})
    .then(user => res.json(user.name))
    .catch(err => res.json(err))
})

//check following
//! COOKIE ADDED
app.get('/checkFollowing', (req, res)=> {
    const {friendId} = req.query
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        FriendModel.findOne({userId: decoded.userId})
        .then(result => {
            const listFollower = result.friends
            res.json(listFollower.includes(friendId))
        })
        .catch(err => res.json(err))
    }
})

//add comment
//! COOKIE ADDED
app.post('/addComment', (req, res)=> {
    const {commentIWantToAdd, tweetId} = req.body
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        CommentModel.create({
            content: commentIWantToAdd,
            commenterId: decoded.userId,
            commenterUserName: decoded.userName,
            tweetId: tweetId,
        })
        .then(result=> {
            res.json(result)
        })
        .catch(err=> res.json(err))
    }
})

//get comment
//! DOESN'T NEED COOKIE
app.get('/getComment', (req,res)=> {
    const {tweetId} = req.query
    
    CommentModel.find({tweetId: tweetId})
    .then(comments=> {
        const commentData = comments.map(eachComment=> {
            return (
                {
                    commenterUserName: eachComment.commenterUserName,
                    content: eachComment.content,
                }
            )
        })
        res.json(commentData)
    })
    .catch(err=> res.json(err))
})

//get sum of comment
//! DOESN'T NEED COOKIE
app.get('/getSumOfComment', (req, res)=> {
    const {tweetId} = req.query

    CommentModel.find({tweetId: tweetId})
    .then(result=> {
        const sumOfComment = result.map(eachComment=> eachComment)

        res.json(sumOfComment.length)
    })
    .catch(err=> res.json(err))
})

//get amount of following
//! COOKIE ADDED
app.get('/getAmountOfFollowing', (req, res)=> {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        FriendModel.findOne({userId: decoded.userId})
        .then(user => {
            res.json(user)
        })
        .catch(err=> res.json(err))
    }
})

//get amount of followers
//! COOKIE ADDED
app.get('/getAmountOfFollowers', (req, res)=> {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        FriendModel.find()
        .then(users => {
            const booleanArray = users.map(eachUser => {
                return eachUser.friends.includes(decoded.userId)
            })
            res.json(booleanArray)
        })
    }
})

// change profile
//! COOKIE ADDED
app.put('/changeProfile', (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        UserModel.findOne({_id: decoded.userId})
        .then(user => {
            let newGender = !user.gender
            
            return (
                UserModel.updateOne({ _id: decoded.userId }, {
                $set: {gender: newGender}
                })
            )
        })
        .then(result => res.json(result))
        .catch(err => res.json(err))
    }
})

//get gender
//! COOKIE ADDED
app.get('/getGender', (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)
        UserModel.findOne({ _id: decoded.userId })
        .then(user => res.json(user.gender))
        .catch(err => res.json(err))
    }
})

//get friends gender
//! DOESN'T NEED COOKIE
app.get('/getFriendsGender', (req, res)=> {
    const {name} = req.query
    UserModel.findOne({name: name})
    .then(user => res.json(user.gender))
    .catch(err=> res.json(err))
})

//get amount of friends followers and following
//! DOESN'T NEED COOKIE
app.get('/getAmountOfFriendsFollowing', (req, res)=> {
    const {friendId} = req.query
    FriendModel.findOne({userId: friendId})
    .then(user => {
        res.json(user)
    })
    .catch(err=> res.json(err))
})

//! DOESN'T NEED COOKIE
app.get('/getAmountOfFriendsFollowers', (req, res)=> {
    const {friendId} = req.query
    FriendModel.find()
    .then(users => {
        const booleanArray = users.map(eachUser => {
            return eachUser.friends.includes(friendId)
        })
        res.json(booleanArray)
    })
})


//get id from name
//! DOESN'T NEED COOKIE
app.get('/getIdFromName', (req, res)=> {
    const {name} = req.query

    UserModel.findOne({name: name})
    .then(user => {
        res.json(user._id)
    })
    .catch(err=> res.json(err))
})


//post CAF
//! COOKIE ADDED
app.post('/CAF', (req, res)=> {
    const {CAF} = req.body
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    } else {
        const decoded = jwt.verify(token, SECRET_KEY)

        CAFModel.create({content: CAF, userName: decoded.userName})
        .then(result => res.json(result))
        .catch(err=> res.json(err))
    }
})

app.post('/logout', (req, res)=> {
    res.clearCookie('jwt', {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', 
        path: '/', 
    });
    
    return res.status(200).json({ message: 'Logged out successfully' });
})

app.listen(PORT, () => {
    console.log(`Local dev server running on port ${PORT}`);
});

module.exports = app
//utk local machine, jalankan npm run dev
