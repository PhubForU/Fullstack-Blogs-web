"use server";

import { cookies } from "next/headers";
import { decrypt } from "./(lib)/sessions";

const token = cookies().get("session")?.value;

export async function unFollowUsr(userId) {
    const currentUser = await decrypt(token);
    try {
        if (!currentUser.success) {
            throw new Error("not authorised");
        }
        const res = await prisma.follows.deleteMany({
            where: {
                followedById: currentUser.id,
                followingId: userId,
            },

            // data: {
            //     followedById: currentUser.id, //current user OR user who want to follow other
            //     followingId: userId, // id of user, which current user want to follow
            // },
        });
        return { message: "unfollowed", success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}

export async function followUser(userId) {
    const currentUser = await decrypt(token);
    try {
        if (!currentUser.success) {
            throw new Error("not authorised");
        }
        const res = await prisma.follows.create({
            data: {
                followedById: currentUser.id, //current user OR user who want to follow other
                followingId: userId, // id of user, which current user want to follow
            },
        });
        return { message: "following", success: true };
    } catch (err) {
        return { message: err.message, success: false };
    }
}
