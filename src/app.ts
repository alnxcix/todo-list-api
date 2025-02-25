import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// ** Middleware to parse JSON **
app.use(express.json());

// ** Sample route **
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "TODO List API with TypeScript 🚀" });
});

// ** Start server **
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
