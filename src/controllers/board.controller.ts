import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

/**
 * 1. Create Board + Auto-create Columns (To Do, Doing, Done)
 * Menggunakan Transaction untuk memastikan integritas data.
 */
export const createBoard = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, color } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "User tidak terautentikasi" });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Buat Board dan hubungkan dengan User sebagai OWNER
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
                    // Otomatis buat 3 kolom default sesuai kebutuhan Kanban
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
                include: {
                    columns: true
                }
            });

            return board;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating board:", error);
        res.status(500).json({ message: "Gagal membuat board" });
    }
};

/**
 * 2. Get All User Boards
 * Menampilkan daftar board di mana user terdaftar sebagai member.
 */
export const getUserBoards = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "User tidak terautentikasi" });
        }

        const boards = await prisma.board.findMany({
            where: {
                members: { some: { userId } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(boards);
    } catch (error) {
        console.error("Error fetching user boards:", error);
        res.status(500).json({ message: "Gagal mengambil daftar board" });
    }
};

/**
 * 3. Get Board Detail (Isi Board: Kolom & Task)
 * Mengatasi error TS(2322) dengan memastikan ID adalah string tunggal.
 */
export const getBoardDetail = async (req: AuthRequest, res: Response) => {
    try {
        // Type narrowing untuk id agar tidak dianggap string[]
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
                        tasks: {
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        if (!board) {
            return res.status(404).json({ message: "Board tidak ditemukan atau Anda tidak memiliki akses" });
        }

        res.json(board);
    } catch (error) {
        console.error("Error fetching board detail:", error);
        res.status(500).json({ message: "Gagal mengambil detail board" });
    }
};