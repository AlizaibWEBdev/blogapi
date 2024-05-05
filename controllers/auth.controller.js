const dbuser = require("../models/user");
const tokenManager = require("../functions/tokenManager");
const ApiError = require("../utils/ApiError")
const bcrypt = require("bcrypt")




const auth = {
   async givNewAccessToken(req, res, next) {
      try {
         const token = req.headers['authorization'] || req.cookies.authorization;
         // if there is no token
         if (!token) {

            return next(new ApiError(401, 'Unauthorized: no token provided'))

         }
         // if Token dose not match token present in the database
         const tokeninDb = await dbuser.findOne(({ refreshtoken: token }));
         if (!tokeninDb) {

            return next(new ApiError(401, 'Unauthorized: wrong refresh token'))

         }
         // if Token mathes the database token then cheking wehther the token is ok or not
         const user = tokenManager.verifytoken(token, process.env.REFRESH_TOKEN_KEY);
         if (user == false) {

            return next(new ApiError(401, 'Forbidden: Invalid token'))

         }

         // if every thing goes okay :) creating new access token and refresh token
         const newAccesToken = tokenManager.generateToken({ id: user }, process.env.KEY);
         const newRefreshToken = tokenManager.generateToken({ id: user }, process.env.REFRESH_TOKEN_KEY, "30d");

         // saving token in the database

         tokeninDb.refreshtoken = newRefreshToken;
         await tokeninDb.save();

         return res.status(200).json({ newAccesToken, newRefreshToken })
      } catch (error) {
         next(error)
      }
   },
   async login(req, res, next) {
      try {
         const { email, password } = req?.body;
         if (!(email && password)) {

            return next(new ApiError(401, 'Unauthorized: please fill all the fields'))

         }
         const userindb = await dbuser.findOne({ email });
         if (userindb == null) {

            return next(new ApiError(401, 'Unauthorized: invalid user name or password'))
         }

         const passwordMatch = await bcrypt.compare(password, userindb.password);
         if (!passwordMatch) {
            return next(new ApiError(401, 'Unauthorized: invalid password'))
         }


         const newAccesToken = tokenManager.generateToken({ id: userindb._id }, process.env.KEY);
         const newRefreshToken = tokenManager.generateToken({ id: userindb._id }, process.env.REFRESH_TOKEN_KEY, "30d");

         userindb.refreshtoken = newRefreshToken;

         userindb.save();

         return res.status(200).json({
            newAccesToken, newRefreshToken, user: {
               id: userindb._id,
               name: userindb.name,
               intrust: userindb.intrust,
               dob: userindb.dob,
               bio: userindb.bio,
               image: userindb.image
            }
         })

      } catch (error) {
         next(error)
      }
   },
   async signup(req, res, next) {

      try {
         const { name, email, password, dob, bio, image } = req?.body;
         console.log(name, email, password, dob, bio, image)
         if (!(name && email && password && dob && bio)) {

            return next(new ApiError(401, 'Unauthorized: please fill all the fields'))

         }

         if (name.length < 3) {

            return next(new ApiError(400, 'please enter valid name'))

         }

         if (password.length < 8) {

            return next(new ApiError(400, 'please enter valid password'))

         }


         const userindb = await dbuser.findOne({ email });

         if (userindb) {

            return next(new ApiError(400, 'this email is allredy taken'))

         }

         const hashedPassword = await bcrypt.hash(password, 10);
         const newuser = new dbuser({ name, email, password: hashedPassword, dob, bio, image })



         try {
            await newuser.save();
            return res.status(200).json({ message: "Account created ." })
         } catch (err) {
            return next(new ApiError(500, 'sory we can not save the user try with diffrant name '))
         }


      } catch (error) {
         next(error)
      }
   }
}



module.exports = auth