import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

/**
 * 1. Create Task
 */
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, priority, columnId, order } = req.body;
        const userId = req.user?.userId;

        // Validasi akses: Pastikan columnId adalah string
        if (typeof columnId !== 'string') {
            return res.status(400).json({ message: "columnId harus berupa string" });
        }

        const column = await prisma.column.findUnique({
            where: { id: columnId },
            include: { board: { include: { members: true } } }
        });

        if (!column) return res.status(404).json({ message: "Kolom tidak ditemukan" });

        const isMember = column.board.members.some(m => m.userId === userId);
        if (!isMember) return res.status(403).json({ message: "Akses ditolak" });

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                order: order || 0,
                columnId
            }
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat task" });
    }
};

/**
 * 2. Get Task Detail
 */
export const getTaskDetail = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string; // Paksa menjadi string

        const task = await prisma.task.findUnique({
            where: { id },
            include: { labels: { include: { label: true } } }
        });

        if (!task) return res.status(404).json({ message: "Task tidak ditemukan" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil detail task" });
    }
};

/**
 * 3. Update Task
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string; // Paksa menjadi string
        const { title, description, priority, columnId, order, dueDate } = req.body;

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                priority,
                columnId: columnId as string | undefined, // Type assertion untuk keamanan
                order,
                dueDate: dueDate ? new Date(dueDate) : undefined
            }
        });

        res.json({ message: "Task berhasil diperbarui", data: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui task" });
    }
};

/**
 * 4. Delete Task
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string; // Paksa menjadi string

        await prisma.task.delete({
            where: { id }
        });

        res.json({ message: "Task berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus task" });
    }
};