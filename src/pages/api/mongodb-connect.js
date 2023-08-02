import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("kartuundangan");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("user").insertOne(bodyObject);
      res.json({ status: 200, data: "success" });
      break;
    case "GET":
      const allPosts = await db.collection("user").find({}).limit(10).toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
}