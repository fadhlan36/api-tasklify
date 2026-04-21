import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tasklify_secret_key_2026';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validasi input sederhana
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }

        // 2. Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // 3. Hash password (keamanan)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Simpan user ke database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "Registrasi berhasil", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server saat registrasi" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Cari user berdasarkan email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        // 2. Bandingkan password yang diinput dengan yang di DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        // 3. Buat token JWT
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1d' } // Token berlaku 24 jam
        );

        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server saat login" });
    }
};