import express, { Request, Response } from "express";
import tasksRouter from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

// ** Middleware to parse JSON **
app.use(express.json());

// ** Sample route **
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "TODO List API with TypeScript 🚀" });
});

// ** Tasks API **
app.use("/tasks", tasksRouter);

// ** Error Handling Middleware **
app.use(errorHandler);

// ** Start server **
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
