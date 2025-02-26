import { Router, Request, Response, NextFunction } from "express";
import { taskMap, taskOrder, updateTaskOrder } from "../data/tasks";
import { Task } from "../models/Task";
import { v4 as uuidv4 } from "uuid";
import { mergeSort } from "../utils/mergeSort";

const router = Router();

// ** GET /tasks — List All Tasks **
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!taskOrder) {
      const error = new Error("No tasks found");
      (error as any).statusCode = 404;
      throw error;
    }

    const { isCompleted, sortBy = "createdAt", order = "asc" } = req.query;

    // ** Convert query param to boolean if provided **
    const filterCompleted =
      isCompleted !== undefined ? isCompleted === "true" : null;

    // ** Retrieve tasks in order **
    let orderedTasks: Task[] = taskOrder.map((id, index) => ({
      ...taskMap.get(id)!,
      position: index,
    }));

    // ** Apply filtering if `isCompleted` is specified **
    if (filterCompleted !== null) {
      orderedTasks = orderedTasks.filter(
        (task) => task.isCompleted === filterCompleted
      );
    }

    const validSortKeys: (keyof Task)[] = [
      "title",
      "isCompleted",
      "createdAt",
      "updatedAt",
    ];

    // ** Error handling: Validate sortBy param **
    if (!validSortKeys.includes(sortBy as keyof Task)) {
      const error = new Error("Invalid sortBy parameter");
      (error as any).statusCode = 400;
      throw error;
    }

    // ** Error handling: Validate order param **
    if (order !== "asc" && order !== "desc") {
      const error = new Error("Invalid order parameter");
      (error as any).statusCode = 400;
      throw error;
    }

    // ** Apply Merge Sort **
    orderedTasks = mergeSort(
      orderedTasks,
      sortBy as keyof Task,
      order as "asc" | "desc"
    );

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
    taskOrder.push(newTask.id);

    res.status(201).json({
      message: "Task successfully added",
      newTask: { ...newTask, position: taskOrder.length - 1 },
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
      position: taskOrder.indexOf(id),
    };

    // ** Update fields **
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    task.updatedAt = new Date();

    // ** Ensure taskMap reflects the update **
    taskMap.set(id, task);

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
      position: taskOrder.indexOf(id),
    };

    // ** Remove from `taskMap` and update `taskOrder` **
    taskMap.delete(id);
    taskOrder.splice(taskOrder.indexOf(id), 1);

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
    const currentIndex = taskOrder.indexOf(taskId);

    // ** Error handling: Check if the task exists **
    if (!taskMap.has(taskId) || currentIndex === -1) {
      const error = new Error("Task not found");
      (error as any).statusCode = 404;
      throw error;
    }

    // ** Error handling: Check if position is valid **
    if (newPosition < 0 || newPosition >= taskOrder.length) {
      const error = new Error("Invalid new position");
      (error as any).statusCode = 400;
      throw error;
    }

    // ** Remove the task ID from its current position **
    // ** Insert the task ID at the new position **

    updateTaskOrder([
      ...taskOrder.slice(0, newPosition),
      taskId,
      ...taskOrder.slice(newPosition),
    ]);

    // ** Update `updatedAt` in the `taskMap` **
    taskOrder.forEach((id) => {
      const task = taskMap.get(id);
      if (task) {
        task.updatedAt = new Date();
      }
    });

    res.status(200).json({
      message: "Task reordered successfully",
      taskOrder: taskOrder, // Updated order of task IDs
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
});

export default router;
