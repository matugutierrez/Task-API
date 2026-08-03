import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from "./tasks.validation"

export async function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "PENDING",
      priority: input.priority ?? "MEDIUM",
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      userId,
    },
  })
}

export async function listTasks(userId: string, query: ListTasksQuery) {
  return prisma.task.findMany({
    where: {
      userId,
      status: query.status,
      priority: query.priority,
    },
    orderBy: { createdAt: "desc" },
  })
}

async function findOwnedTask(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } })

  if (!task || task.userId !== userId) {
    throw new AppError(404, "Task not found")
  }

  return task
}

export async function getTask(userId: string, taskId: string) {
  return findOwnedTask(userId, taskId)
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  await findOwnedTask(userId, taskId)

  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    },
  })
}

export async function deleteTask(userId: string, taskId: string) {
  await findOwnedTask(userId, taskId)
  await prisma.task.delete({ where: { id: taskId } })
}
