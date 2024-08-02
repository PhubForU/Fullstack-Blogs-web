"use server";
import { decrypt } from "@/app/(lib)/sessions";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function commentAction(postId, comment, slug) {
    const prisma = new PrismaClient();

    try {
        const user = await decrypt(cookies().get("session")?.value);
        const res = await prisma.comment.create({
            data: {
                comment: comment,
                postId: postId,
                cmntAuthorId: user.id,
            },
        });
        revalidatePath(process.env.BASE_URL + "/posts/" + slug);
        return res;
    } catch (err) {
        throw err;
    }
}
