import { Router, Request, Response, NextFunction } from "express";
import { tasks } from "../data/tasks";

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

export default router;
