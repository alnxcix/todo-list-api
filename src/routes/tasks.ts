import { Router, Request, Response, NextFunction } from "express";
import { taskMap, taskOrder as taskOrderMutable } from "../data/tasks";
import { Task } from "../models/Task";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// ** GET /tasks — List All Tasks **
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!taskOrderMutable) {
      const error = new Error("No tasks found");
      (error as any).statusCode = 404;
      throw error;
    }

    // ** Retrieve tasks in order **
    const orderedTasks: Task[] = taskOrderMutable.map((id, index) => ({
      ...taskMap.get(id)!,
      position: index,
    }));

    res.status(200).json({ tasks: orderedTasks });
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ** Store task in Map and update order list **
    taskMap.set(newTask.id, newTask);
    taskOrderMutable.push(newTask.id);

    res.status(201).json({
      message: "Task successfully added",
      newTask: { ...newTask, position: taskOrderMutable.length - 1 },
    });
  } catch (error) {
    next(error); // Pass error to middleware
  }
});

// ** PUT /tasks/:id — Update a Task **
router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;

    // ** Error handling: Check if the task exists **
    if (!taskMap.has(id)) {
      const error = new Error("Task not found");
      (error as any).statusCode = 404;
      throw error;
    }

    // ** Retrieve the task to update **
    const task = {
      ...taskMap.get(id)!,
      position: taskOrderMutable.indexOf(id),
    };

    // ** Update fields **
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    task.updatedAt = new Date();

    res.status(200).json({
      message: "Task successfully updated",
      updatedTask: task,
    });
  } catch (error) {
    next(error);
  }
});

// ** DELETE /tasks/:id — Remove a Task **
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // ** Error handling: Check if the task exists **
    if (!taskMap.has(id)) {
      const error = new Error("Task not found");
      (error as any).statusCode = 404;
      throw error;
    }

    // ** Retrieve the task before deletion **
    const deletedTask = {
      ...taskMap.get(id),
      position: taskOrderMutable.indexOf(id),
    };

    // ** Remove from `taskMap` and update `taskOrderMutable` **
    taskMap.delete(id);
    taskOrderMutable.splice(taskOrderMutable.indexOf(id), 1);

    res.status(200).json({
      message: "Task successfully deleted",
      deletedTask, // Return the deleted task
    });
  } catch (error) {
    next(error); // Pass error to middleware
  }
});

// ** POST /tasks/reorder — Reorder tasks on position update **
router.post("/reorder", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId, newPosition } = req.body;

    // ** Find the current index of the task **
    const currentIndex = taskOrderMutable.indexOf(taskId);

    // ** Error handling: Check if the task exists **
    if (!taskMap.has(taskId) || currentIndex === -1) {
      const error = new Error("Task not found");
      (error as any).statusCode = 404;
      throw error;
    }

    // ** Error handling: Check if position is valid **
    if (newPosition < 0 || newPosition >= taskOrderMutable.length) {
      const error = new Error("Invalid new position");
      (error as any).statusCode = 400;
      throw error;
    }

    // ** Remove the task ID from its current position **
    taskOrderMutable.splice(currentIndex, 1);

    // ** Insert the task ID at the new position **
    taskOrderMutable.splice(newPosition, 0, taskId);

    // ** Update `updatedAt` in the `taskMap` **
    taskOrderMutable.forEach((id) => {
      const task = taskMap.get(id);
      if (task) {
        task.updatedAt = new Date();
      }
    });

    res.status(200).json({
      message: "Task reordered successfully",
      taskOrder: taskOrderMutable, // Updated order of task IDs
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
});

export default router;
