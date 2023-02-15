import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

// Create a Mongoose schema for the data
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  balance: Number,
  password: String,
  likedPosts: [String],
});

const postSchema = new mongoose.Schema({
    username: String,
    profilePicture: String,
    image: String,
    likeCount: Number,
    description: String,
    timeAgo: Object
})
// Create a Mongoose model using the schema
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema)

// Insert a new document into the database
export const createUser = (username, email, password) => {
  const user = new User({
    username,
    email,
    balance: 0.0,
    password,
    likedPosts: []
  });
  return user.save();
};

// Find all documents in the database
export const findAllUsers = () => User.find({});

// Find a single document by name
export const findUserByName = username => User.findOne({ username });

export const findUserByEmail = email => User.findOne({ email })

// Update a document by name
export const updateUserByName = (username, updates) => User.updateOne({ username }, updates);

// Delete a document by name
export const deleteUserByName = username => User.deleteOne({ username });

export const createPost = (username, profilePicture, image, likeCount, description, timeAgo) => {
  const user = new Post({
    username,
    profilePicture,
    image,
    likeCount,
    description,
    timeAgo: {
        type: timeAgo.type,
        time: timeAgo.time,
    }
  });
  return user.save();
};

export const findAllPosts = () => Post.find({});

