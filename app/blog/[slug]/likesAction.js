"use server";

import { cookies } from "next/headers";

import { PrismaClient } from "@prisma/client";
import { decrypt } from "@/app/(lib)/sessions";

export async function unLike(postId) {
    const prisma = new PrismaClient();
    const currentUser = await decrypt(cookies().get("session")?.value);
    try {
        if (!currentUser.success) {
            throw new Error("not authorised");
        }
        const res = await prisma.like.deleteMany({
            where: {
                postId: postId,
                likedById: currentUser.id,
            },
        });
        return { message: "removed from the liked posts", success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function like(postId) {
    const prisma = new PrismaClient();
    const currentUser = await decrypt(cookies().get("session")?.value);
    try {
        if (!currentUser.success) {
            throw new Error("not authorised");
        }
        const res = await prisma.like.create({
            data: {
                likedById: currentUser.id,
                postId: postId,
            },
        });
        return { message: "added to the liked posts", success: true };
    } catch (err) {
        console.log(err);
        return { message: err.message, success: false };
    }
}
