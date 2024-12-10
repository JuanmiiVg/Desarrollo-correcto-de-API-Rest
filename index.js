/**
 * Tres formas de almacenar valores en memoria en JavaScript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Definimos una estructura de datos (temporal hasta incorporar una base de datos)
let concesionarios = [
  {
    id: 1,
    nombre: "Concesionario Central",
    direccion: "Calle Principal 123",
    coches: [
      { id: 1, modelo: "Corsa", cv: 90, precio: 15000 },
      { id: 2, modelo: "Astra", cv: 110, precio: 18000 },
    ],
  },
];

// Obtener todos los concesionarios
app.get("/concesionarios", (req, res) => {
  res.json(concesionarios);
});

// Crear un nuevo concesionario
app.post("/concesionarios", (req, res) => {
  const nuevoConcesionario = {
    id: concesionarios.length + 1,
    ...req.body,
    coches: [],
  };
  concesionarios.push(nuevoConcesionario);
  res.status(201).json(nuevoConcesionario);
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", (req, res) => {
  const concesionario = concesionarios.find((c) => c.id == req.params.id);
  if (concesionario) {
    res.json(concesionario);
  } else {
    res.status(404).json({ error: "Concesionario no encontrado" });
  }
});

// Actualizar un concesionario por ID
app.put("/concesionarios/:id", (req, res) => {
  const concesionario = concesionarios.find((c) => c.id == req.params.id);
  if (concesionario) {
    Object.assign(concesionario, req.body);
    res.json({ message: "Concesionario actualizado", concesionario });
  } else {
    res.status(404).json({ error: "Concesionario no encontrado" });
  }
});

// Eliminar un concesionario por ID
app.delete("/concesionarios/:id", (req, res) => {
  concesionarios = concesionarios.filter((c) => c.id != req.params.id);
  res.json({ message: "Concesionario eliminado" });
});

// Obtener todos los coches de un concesionario
app.get("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find((c) => c.id == req.params.id);
  if (concesionario) {
    res.json(concesionario.coches);
  } else {
    res.status(404).json({ error: "Concesionario no encontrado" });
  }
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find((c) => c.id == req.params.id);
  if (concesionario) {
    const nuevoCoche = { id: concesionario.coches.length + 1, ...req.body };
    concesionario.coches.push(nuevoCoche);
    res.status(201).json(nuevoCoche);
  } else {
    res.status(404).json({ error: "Concesionario no encontrado" });
  }
});

// Obtener un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find((c) => c.id == req.params.id);
  if (concesionario) {
    const coche = concesionario.coches.find((c) => c.id == req.params.cocheId);
    if (coche) {
      res.json(coche);
    } else {
      res.status(404).json({ error: "Coche no encontrado" });
    }
  } else {
    res.status(404).json({ error: "Concesionario no encontrado" });
  }
});

// Actualizar un coche de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find((c) => c.id == req.params.id);
  if (concesionario) {
    const coche = concesionario.coches.find((c) => c.id == req.params.cocheId);
    if (coche) {
      Object.assign(coche, req.body);
      res.json({ message: "Coche actualizado", coche });
    } else {
      res.status(404).json({ error: "Coche no encontrado" });
    }
  } else {
    res.status(404).json({ error: "Concesionario no encontrado" });
  }
});

// Eliminar un coche de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find((c) => c.id == req.params.id);
  if (concesionario) {
    concesionario.coches = concesionario.coches.filter(
      (c) => c.id != req.params.cocheId
    );
    res.json({ message: "Coche eliminado" });
  } else {
    res.status(404).json({ error: "Concesionario no encontrado" });
  }
});

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
