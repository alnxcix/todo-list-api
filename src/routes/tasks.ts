import { Router } from "express";
import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../controllers/tasks.controller";

const router = Router();

router.get("/", getAllTasks);
router.post("/", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/reorder", reorderTasks);

export default router;
