const express = require("express");
const cors = require("cors");
const organizeRoutes = require("./Routes/organize.routes");
const convertRoutes = require("./Routes/convert.routes");
const rotatePdfRoutes = require("./Routes/rotatepdf");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/convert", convertRoutes);
app.use("/api/organize", organizeRoutes);
app.use("/api/pdf", rotatePdfRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
console.log ("Hello world")