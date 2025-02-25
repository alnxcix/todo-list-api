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

    res.status(201).json({
      message: "Task succesfully added",
      newTask,
    });
  } catch (error) {
    next(error); // Pass error to middleware
  }
});

// ** PUT route to update a task **
router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, position } = req.body;

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      // ** Throw an error if task is not found **
      const error = new Error("Task not found");
      (error as any).statusCode = 404;
      throw error;
    } else {
      // ** Update fields **
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (isCompleted !== undefined) task.isCompleted = isCompleted;
      if (position !== undefined) task.position = position;
      task.updatedAt = new Date();

      res.status(200).json({
        message: "Task succesfully updated",
        updatedTask: task,
      });
    }
  } catch (error) {
    next(error);
  }
});

// ** DELETE route to remove a task **
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      // ** Throw an error if task is not found **
      const error = new Error("Task not found");
      (error as any).statusCode = 404;
      throw error;
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.status(200).json({
      message: "Task successfully deleted",
      deletedTask,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
