const mongoose = require("mongoose");
async function connect() {
   try {
       await  mongoose.connect(process.env.MONGODB_URI)
   } catch (error) {
      process.exit(1)
   }

}

module.exports = connect