const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const UserModel = require('./models/usermodels')
const TweetModel = require('./models/tweetmodels')
const FriendModel = require('./models/friendmodels')
const CommentModel = require('./models/commentmodels')
const CAFModel = require('./models/CAF-model')

const app = express()
//connect to database
//port
const PORT = process.env.PORT || 3001
app.use(express.json())


// Gunakan environment variable

//! DON'T FORGET TO CHANGE THE ORIGIN
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


app.options('*', cors());

console.time("MongoDB Connection Time"); // Mulai timer
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://marveltjenyani8:miawmiawaug@test-cluster.zayivlf.mongodb.net/socialmediapp")
    .then(() => {
        console.timeEnd("MongoDB Connection Time"); // Akhiri timer dan log waktu
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.timeEnd("MongoDB Connection Time"); // Akhiri timer jika gagal
        console.error("MongoDB connection failed:", err);
        process.exit(1); // Stop server jika koneksi gagal
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

let userId
let userName

//handle log-in
app.post(`/login`, (req, res)=> {
    const {name, password} = req.body
    UserModel.findOne({name: name})
    .then(user => {
        if(user) {
            if(user.password === password) {
                userId = user._id
                userName = user.name
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

//! RECONTRUCTION 
app.post('/home', (req, res)=> {
    const {tweet} = req.body
    TweetModel.create({id: userId, userName: userName, content: tweet})
    .then(result => {
        res.json({message: 'Tweet added', result})
    })
    .catch(err => {
        res.json(err)
    })
})

//handle userpage
app.get('/userpage', (req, res)=> {
    TweetModel.find({userName: userName})
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
})

app.get('/getName', (req, res)=> {
    UserModel.findOne({_id: userId})
    .then(user => res.json(user.name))
    .catch(err=> res.json(err))
})

//handle recall user "name" data
//in search page 
//! RECONSTRUCTION 
app.get('/gettweetcontent', (req, res)=> {
    console.time("MongoDB Query Time")
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
        console.timeEnd("MongoDB Query Time")
        res.json(tweetContent)
    })
    .catch(err=> res.json(err))
})

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
app.get('/getLike', (req, res)=> {
    const {tweetId} = req.query
    TweetModel.findOne({_id: tweetId})
    .then(theTweet=> {
        res.json(theTweet.like)
    })
    .catch(err=> res.json(err))
})

//delete like
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
app.post('/addFollowList', (req, res)=> {
    const {friendId} = req.body

    FriendModel.findOne({userId: userId})
    .then(result=> {
        if(result) {
            FriendModel.updateOne({userId: userId},
                {$push: {friends: friendId}})
            .then(result=> res.json(result))
            .catch(err=> res.json(err))
        } else {
            FriendModel.create({userId: userId, friends: friendId})
            .then(result=> {
                res.json(result)
            })
            .catch(err=> res.json(err))
        }
    })    
})

//follow management / delete friend (unfollow)
app.put('/deleteFollowList', (req, res)=> {
    const {friendId} = req.body

    FriendModel.updateOne({userId: userId}, 
        {$pull: {friends: friendId}})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

//get friends list in and put it in friend-page
app.get('/getFriendsData', (req, res)=> {
    FriendModel.findOne({userId: userId})
    .then(user=> {
        res.json(user.friends)
    })
    .catch(err => res.json(err))
})

//just to get the name for friend page
app.get('/getFriendsName', (req, res)=> {
    const {Id} = req.query

    UserModel.findOne({_id: Id})
    .then(user => res.json(user.name))
    .catch(err => res.json(err))
})

//check following
app.get('/checkFollowing', (req, res)=> {
    const {friendId} = req.query

    FriendModel.findOne({userId: userId})
    .then(result => {
        const listFollower = result.friends
        res.json(listFollower.includes(friendId))
    })
    .catch(err => res.json(err))
})

//add comment
app.post('/addComment', (req, res)=> {
    const {commentIWantToAdd, tweetId} = req.body

    CommentModel.create({
        content: commentIWantToAdd,
        commenterId: userId,
        commenterUserName: userName,
        tweetId: tweetId,
    })
    .then(result=> {
        res.json(result)
    })
    .catch(err=> res.json(err))
})

//get comment
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
app.get('/getAmountOfFollowing', (req, res)=> {
    FriendModel.findOne({userId: userId})
    .then(user => {
        res.json(user)
    })
    .catch(err=> res.json(err))
})

//get amount of followers
app.get('/getAmountOfFollowers', (req, res)=> {
    FriendModel.find()
    .then(users => {
        const booleanArray = users.map(eachUser => {
            return eachUser.friends.includes(userId)
        })
        res.json(booleanArray)
    })
})

let newGender
// change profile
app.put('/changeProfile', (req, res) => {
    UserModel.findOne({_id: userId})
    .then(user => {
        newGender = !user.gender
        
        return (
            UserModel.updateOne({ _id: userId }, {
            $set: {gender: newGender}
            })
        )
    })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

//get gender
app.get('/getGender', (req, res) => {
    UserModel.findOne({ _id: userId })
    .then(user => {
        res.json(user.gender)
    })
    .catch(err => res.json(err))
})

//get friends gender
app.get('/getFriendsGender', (req, res)=> {
    const {name} = req.query
    UserModel.findOne({name: name})
    .then(user => res.json(user.gender))
    .catch(err=> res.json(err))
})



//get amount of friends followers and following

app.get('/getAmountOfFriendsFollowing', (req, res)=> {
    const {friendId} = req.query
    FriendModel.findOne({userId: friendId})
    .then(user => {
        res.json(user)
    })
    .catch(err=> res.json(err))
})


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

app.get('/getIdFromName', (req, res)=> {
    const {name} = req.query

    UserModel.findOne({name: name})
    .then(user => {
        res.json(user._id)
    })
    .catch(err=> res.json(err))
})


//post CAF
app.post('/CAF', (req, res)=> {
    const {CAF} = req.body

    CAFModel.create({content: CAF, userName: userName})
    .then(result => res.json(result))
    .catch(err=> res.json(err))
})



app.listen(PORT, () => {
    console.log(`Local dev server running on port ${PORT}`);
});

module.exports = app
//utk local machine, jalankan npm run dev
