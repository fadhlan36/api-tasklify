import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

/**
 * 1. Create Board + Auto-create Columns (To Do, Doing, Done)
 */
export const createBoard = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, color } = req.body;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ message: "User tidak terautentikasi" });

        const result = await prisma.$transaction(async (tx) => {
            const board = await tx.board.create({
                data: {
                    title,
                    description,
                    color: color || "#6366f1",
                    members: {
                        create: {
                            userId: userId,
                            role: 'OWNER'
                        }
                    },
                    columns: {
                        createMany: {
                            data: [
                                { title: 'To Do', order: 0, color: '#94a3b8' },
                                { title: 'Doing', order: 1, color: '#3b82f6' },
                                { title: 'Done', order: 2, color: '#22c55e' },
                            ]
                        }
                    }
                },
                include: { columns: true }
            });
            return board;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal membuat board" });
    }
};

/**
 * 2. Get All User Boards
 */
export const getUserBoards = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "User tidak terautentikasi" });

        const boards = await prisma.board.findMany({
            where: {
                members: { some: { userId } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil daftar board" });
    }
};

/**
 * 3. Get Board Detail
 */
export const getBoardDetail = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (typeof id !== 'string' || !userId) {
            return res.status(400).json({ message: "Parameter tidak valid" });
        }

        const board = await prisma.board.findFirst({
            where: {
                id: id,
                members: { some: { userId: userId } }
            },
            include: {
                columns: {
                    orderBy: { order: 'asc' },
                    include: {
                        tasks: { orderBy: { order: 'asc' } }
                    }
                }
            }
        });

        if (!board) return res.status(404).json({ message: "Board tidak ditemukan" });

        res.json(board);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil detail board" });
    }
};

/**
 * 4. Update Board (Edit)
 */
export const updateBoard = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, color } = req.body;
        const userId = req.user?.userId;

        if (typeof id !== 'string' || !userId) {
            return res.status(400).json({ message: "Parameter tidak valid" });
        }

        // Cek apakah user adalah OWNER board ini
        const isOwner = await prisma.boardMember.findFirst({
            where: { boardId: id, userId: userId, role: 'OWNER' }
        });

        if (!isOwner) {
            return res.status(403).json({ message: "Hanya Owner yang dapat mengubah board" });
        }

        const updatedBoard = await prisma.board.update({
            where: { id },
            data: { title, description, color }
        });

        res.json({ message: "Board berhasil diperbarui", data: updatedBoard });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui board" });
    }
};

/**
 * 5. Delete Board
 */
export const deleteBoard = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (typeof id !== 'string' || !userId) {
            return res.status(400).json({ message: "Parameter tidak valid" });
        }

        // Cek izin Owner
        const isOwner = await prisma.boardMember.findFirst({
            where: { boardId: id, userId: userId, role: 'OWNER' }
        });

        if (!isOwner) {
            return res.status(403).json({ message: "Hanya Owner yang dapat menghapus board" });
        }

        await prisma.board.delete({
            where: { id }
        });

        res.json({ message: "Board berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus board" });
    }
};