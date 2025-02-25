import { Router, Request, Response } from "express";
import { tasks } from "../data/tasks";

const router = Router();

// ** GET /tasks — List All Tasks **
router.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

export default router;
