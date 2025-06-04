
const mongoose =require("mongoose" );

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://amit0123:GOSMxJCHXwyMNCdl@namastenode.a3l1ken.mongodb.net/devTinder"
    );
};

module.exports=connectDB;
