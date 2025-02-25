import { Router, Request, Response, NextFunction } from "express";
import { tasks } from "../data/tasks";
import { Task } from "../models/Task";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// ** GET /tasks — List All Tasks **
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!tasks) {
      const error = new Error("Tasks not found");
      (error as any).statusCode = 404;
      throw error;
    }

    res.status(200).json(tasks);
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// ** POST /tasks — Add a New Task **
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      const error = new Error("Title is required");
      (error as any).statusCode = 400;
      throw error;
    }

    const newTask: Task = {
      id: uuidv4(),
      title,
      description: description || "",
      isCompleted: false,
      position: tasks.length + 1, // Append to end
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
  } catch (error) {
    next(error); // Pass error to middleware
  }
});

export default router;
