const mongoose = require('mongoose')



const connectToDB = async () =>{
    try {
        // const URL_WITH_PASS = process.env.MONGO_URL_pass
        
         const connect =   mongoose.connect(process.env.MONGO_URL_pass)

        //  console.log(`connected to DB:${connect.connection.host}`);
         console.log(`connected to DB ${(await connect).connection.host}`);
        



    } catch (error) {
        console.log(error);
        process.exit(1)
    }
        
}


module.exports = connectToDB