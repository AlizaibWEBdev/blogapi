//variables functions middlewares imports libs etc etc 
const dotenv = require('dotenv')
const path = require("path")
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Dbconnect = require("./src/functions/dbConnect");
const isAuthenticated = require("./src/middlewares/isAuthenticated");
const sendUser = require("./src/functions/sendUser")
const errorhandling = require("./src/middlewares/errorhandling");
const authrouter = require("./src/routes/auth.route");
const blogrouter = require("./src/routes/blog.route");
const uploadDirectory = path.join(__dirname, './uploads');
const app = express();
const upload = require("./src/middlewares/multer")
// variables end 

// middilwares 
dotenv.config();
app.set('view engine', 'ejs');
app.use(express.static(uploadDirectory));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));










//routes
app.use("/auth", authrouter);
app.use("/blog", blogrouter);

app.post("/islogedin", isAuthenticated(process.env.KEY), sendUser);




app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ message: 'Error: No file selected!' });
      } else {
        const fileUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;
        res.status(200).json({ message: 'File uploaded successfully!', fileUrl: fileUrl });
      }
    }
  });
});

app.use(errorhandling);






Dbconnect()
  .then(() => {
    let port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`app is running on port ${port}`);
    });
  }).catch((err) => {
    console.log("database connection error", err?.message || err);
  });
