jest.mock("../src/lib/prisma", () => ({
  prisma: {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

import { prisma } from "../src/lib/prisma"
import { createTask, listTasks, getTask, updateTask, deleteTask } from "../src/modules/tasks/tasks.service"

const mockedPrisma = prisma as unknown as {
  task: {
    create: jest.Mock
    findMany: jest.Mock
    findUnique: jest.Mock
    update: jest.Mock
    delete: jest.Mock
  }
}

describe("tasks service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates a task with default status and priority", async () => {
    mockedPrisma.task.create.mockResolvedValue({ id: "task-1" })

    await createTask("user-1", { title: "Nueva tarea" })

    expect(mockedPrisma.task.create).toHaveBeenCalledWith({
      data: {
        title: "Nueva tarea",
        description: undefined,
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: undefined,
        userId: "user-1",
      },
    })
  })

  it("lists tasks scoped to the given user", async () => {
    mockedPrisma.task.findMany.mockResolvedValue([])

    await listTasks("user-1", {})

    expect(mockedPrisma.task.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1", status: undefined, priority: undefined },
      orderBy: { createdAt: "desc" },
    })
  })

  it("throws when getting a task that belongs to another user", async () => {
    mockedPrisma.task.findUnique.mockResolvedValue({ id: "task-1", userId: "other-user" })

    await expect(getTask("user-1", "task-1")).rejects.toThrow("Task not found")
  })

  it("throws when updating a task that does not exist", async () => {
    mockedPrisma.task.findUnique.mockResolvedValue(null)

    await expect(updateTask("user-1", "task-1", { title: "x" })).rejects.toThrow("Task not found")
  })

  it("deletes a task owned by the user", async () => {
    mockedPrisma.task.findUnique.mockResolvedValue({ id: "task-1", userId: "user-1" })
    mockedPrisma.task.delete.mockResolvedValue({ id: "task-1" })

    await deleteTask("user-1", "task-1")

    expect(mockedPrisma.task.delete).toHaveBeenCalledWith({ where: { id: "task-1" } })
  })
})
