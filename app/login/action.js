"use server";
import { PrismaClient } from "@prisma/client";
import { createSession } from "../(lib)/sessions";

export default async function 

loginAction({ email, password }) {
    const prisma = new PrismaClient();
    
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user == null) {
            throw new Error("user not found");
        } else {
            if (password == user.password) {
                const session = await createSession({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                });
                if (session.success) {
                    return { ...session };
                } else {
                    throw new Error(session.message);
                }
            } else {
                throw new Error("wrong password");
            }
        }
    } catch (err) {
        return { message: err.message, success: false };
    }
}
