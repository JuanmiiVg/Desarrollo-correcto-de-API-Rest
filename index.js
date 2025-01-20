const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const helmet = require("helmet");

const app = express();
app.use(express.json());
app.use(helmet());

const port = process.env.PORT || 8080;

const uri =
  "mongodb+srv://juanmavegacarrillo2:2OOPhqhNxdtNEHer@cluster0.sni2m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("concesionariosDB");
    const concesionariosCollection = db.collection("concesionarios");

    app.get("/concesionarios", async (req, res) => {
      const concesionarios = await concesionariosCollection.find().toArray();
      res.json(concesionarios);
    });

    app.post("/concesionarios", async (req, res) => {
      const nuevoConcesionario = req.body;
      await concesionariosCollection.insertOne(nuevoConcesionario);
      res.status(201).json(nuevoConcesionario);
    });

    app.get("/concesionarios/:id", async (req, res) => {
      const concesionario = await concesionariosCollection.findOne({
        id: parseInt(req.params.id),
      });
      if (concesionario) {
        res.json(concesionario);
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.put("/concesionarios/:id", async (req, res) => {
      const updatedConcesionario = req.body;
      const result = await concesionariosCollection.updateOne(
        { id: parseInt(req.params.id) },
        { $set: updatedConcesionario }
      );
      if (result.matchedCount > 0) {
        res.json({
          message: "Concesionario actualizado",
          updatedConcesionario,
        });
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.delete("/concesionarios/:id", async (req, res) => {
      const result = await concesionariosCollection.deleteOne({
        id: parseInt(req.params.id),
      });
      if (result.deletedCount > 0) {
        res.json({ message: "Concesionario eliminado" });
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.get("/concesionarios/:id/coches", async (req, res) => {
      const concesionario = await concesionariosCollection.findOne({
        id: parseInt(req.params.id),
      });
      if (concesionario) {
        res.json(concesionario.coches);
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.post("/concesionarios/:id/coches", async (req, res) => {
      const concesionario = await concesionariosCollection.findOne({
        id: parseInt(req.params.id),
      });
      if (concesionario) {
        const nuevoCoche = req.body;
        concesionario.coches.push(nuevoCoche);
        await concesionariosCollection.updateOne(
          { id: parseInt(req.params.id) },
          { $set: { coches: concesionario.coches } }
        );
        res.status(201).json(nuevoCoche);
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.get("/concesionarios/:id/coches/:cocheId", async (req, res) => {
      const concesionario = await concesionariosCollection.findOne({
        id: parseInt(req.params.id),
      });
      if (concesionario) {
        const coche = concesionario.coches.find(
          (c) => c.id == req.params.cocheId
        );
        if (coche) {
          res.json(coche);
        } else {
          res.status(404).json({ error: "Coche no encontrado" });
        }
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.put("/concesionarios/:id/coches/:cocheId", async (req, res) => {
      const concesionario = await concesionariosCollection.findOne({
        id: parseInt(req.params.id),
      });
      if (concesionario) {
        const coche = concesionario.coches.find(
          (c) => c.id == req.params.cocheId
        );
        if (coche) {
          Object.assign(coche, req.body);
          await concesionariosCollection.updateOne(
            { id: parseInt(req.params.id) },
            { $set: { coches: concesionario.coches } }
          );
          res.json({ message: "Coche actualizado", coche });
        } else {
          res.status(404).json({ error: "Coche no encontrado" });
        }
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.delete("/concesionarios/:id/coches/:cocheId", async (req, res) => {
      const concesionario = await concesionariosCollection.findOne({
        id: parseInt(req.params.id),
      });
      if (concesionario) {
        concesionario.coches = concesionario.coches.filter(
          (c) => c.id != req.params.cocheId
        );
        await concesionariosCollection.updateOne(
          { id: parseInt(req.params.id) },
          { $set: { coches: concesionario.coches } }
        );
        res.json({ message: "Coche eliminado" });
      } else {
        res.status(404).json({ error: "Concesionario no encontrado" });
      }
    });

    app.listen(port, () => {
      console.log(`Servidor desplegado en puerto: ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
