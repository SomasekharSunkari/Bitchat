import mongoose from "mongoose"

const connection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI + "?retryWrites=true&w=majority", {
            useNewUrlParser: true,
        });
        console.log(`Connected to Database ${connect.connection.host}`)
    }
    catch (err) {
        console.log(err.message)
        process.exit();
    }
}
export default connection;