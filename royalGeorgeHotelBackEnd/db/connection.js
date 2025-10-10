import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try {
    // Connect the client to the server (this will also start the connection pool)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("Connected successfully to MongoDB server");
    
} catch (error) {
    console.error("Error connecting to MongoDB server:", error);
}

let db = client.db("royal_george_hotel_db");

export default db;