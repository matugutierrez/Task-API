import { Response, NextFunction } from "express"
import { AuthenticatedRequest } from "../../middleware/auth"
import { createTaskSchema, updateTaskSchema, listTasksQuerySchema } from "./tasks.validation"
import { createTask, listTasks, getTask, updateTask, deleteTask } from "./tasks.service"
import { AppError } from "../../utils/AppError"

function requireUserId(req: AuthenticatedRequest): string {
  if (!req.userId) {
    throw new AppError(401, "Unauthorized")
  }
  return req.userId
}

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req)
    const input = createTaskSchema.parse(req.body)
    const task = await createTask(userId, input)
    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

export async function list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req)
    const query = listTasksQuerySchema.parse(req.query)
    const tasks = await listTasks(userId, query)
    res.status(200).json(tasks)
  } catch (err) {
    next(err)
  }
}

export async function getOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req)
    const task = await getTask(userId, req.params.id)
    res.status(200).json(task)
  } catch (err) {
    next(err)
  }
}

export async function update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req)
    const input = updateTaskSchema.parse(req.body)
    const task = await updateTask(userId, req.params.id, input)
    res.status(200).json(task)
  } catch (err) {
    next(err)
  }
}

export async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req)
    await deleteTask(userId, req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
