import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
app.use(
  cors({
    origin: ["https://chatbot-le-grain.vercel.app"],
  })
);
app.use(express.json());

// Déclare la route
app.use("/ask", aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Serveur lancé : http://localhost:${PORT}`);
});
