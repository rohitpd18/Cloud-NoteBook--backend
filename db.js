const mongoose= require('mongoose')
const mongoURI= "mongodb://localhost:27017/cloudbook?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

const connectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connecated to mongoose sucessfully");
        
    })
}

module.exports= connectToMongo 