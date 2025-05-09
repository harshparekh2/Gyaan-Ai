const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ 
  
  extended: true 
}));
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dbname')
var db= mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function() {
  console.log("Connected to MongoDB successfully!");
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  conformpassword: String
});
const User = mongoose.model('Userdata', userSchema);
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});
const Contact = mongoose.model('Contact', contactSchema);
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  foodquality: String,
  ratings: String,
  comments: String
  
});
const Feedback = mongoose.model('Feedback', feedbackSchema);


app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const conformpassword = req.body.conformpassword;
  const user = new User({
    name: name,
    email: email,
    password: password,
    conformpassword: conformpassword
  });
  return user.save()
    .then(() => {
      console.log("User registered successfully!");
      res.status(200).send("User registered successfully!");
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      res.status(500).send("Error registering user");
    });
  
  });
  app.post("/contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const contact = new Contact({
      name: name,
      email: email,
      subject: subject,
      message: message
    });
    return contact.save()
      .then(() => {
        console.log("Contact message sent successfully!");
        res.status(200).send("Contact message sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending contact message:", error);
        res.status(500).send("Error sending contact message");
      });
  });

  app.post("/feedback", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const foodquality = req.body.foodquality;
    const ratings = req.body.ratings;
    const comments = req.body.comments;
    const feedback = new Feedback({
      name: name,
      email: email,
      phone: phone,
      foodquality: foodquality,
      ratings: ratings,
      comments: comments
    });
    return feedback.save()
      .then(() => {
        console.log("Feedback submitted successfully!");
        res.status(200).send("Feedback submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        res.status(500).send("Error submitting feedback");
      });
      });
  
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
    
  })

const port=8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
