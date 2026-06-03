import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

async function getBoardIdFromColumn(columnId: string): Promise<string | null> {
  const col = await prisma.column.findUnique({
    where: { id: columnId },
    select: { boardId: true },
  });
  return col?.boardId ?? null;
}

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, columnId, order } = req.body;
    const userId = req.user?.userId;

    if (!title || !columnId)
      return res.status(400).json({ message: "Title dan columnId wajib diisi" });

    // const column = await prisma.column.findUnique({
    //   where: { id: columnId },
    //   include: { board: { include: { members: true } } },
    // });

    const column = await prisma.column.findUnique({
      where: { id: columnId },
      select: {
        board: {
          select: {
            members: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!column) return res.status(404).json({ message: "Column tidak ditemukan" });

    const isMember = column.board.members.some((m) => m.userId === userId);
    if (!isMember) return res.status(403).json({ message: "Akses ditolak" });

    const maxOrder = await prisma.task.aggregate({
      where: { columnId },
      _max: { order: true },
    });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        order: order ?? (maxOrder._max.order ?? -1) + 1,
        columnId,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat task" });
  }
};

export const getTaskDetail = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id },
      include: { labels: { include: { label: true } } },
    });

    if (!task) return res.status(404).json({ message: "Task tidak ditemukan" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil task" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, description, priority, columnId, order, dueDate } = req.body;

    const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Priority tidak valid" });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(priority !== undefined && { priority }),
        ...(columnId !== undefined && { columnId }),
        ...(order !== undefined && { order }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
      },
    });

    res.json({ message: "Task berhasil diupdate", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update task" });
  }
};

export const moveTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId, columnId, order } = req.body;

    if (!taskId || !columnId)
      return res.status(400).json({ message: "Invalid move payload" });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { columnId, order: order ?? 0 },
    });

    res.json({ message: "Task berhasil dipindahkan", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal move task" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    await prisma.task.delete({ where: { id } });

    res.json({ message: "Task berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal delete task" });
  }
};