const express = require("express");
const cors = require("cors");

const convertRoutes = require("./Routes/convert.routes");
const securityRoutes = require("./Routes/security.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/convert", convertRoutes);
app.use("/api/security",securityRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
