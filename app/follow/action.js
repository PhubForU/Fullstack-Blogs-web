"use server";

import { cookies } from "next/headers";
import { decrypt, followUser } from "../(lib)/sessions";

export async function followAction(userId) {
    const currentUser = await decrypt(cookies().get("session")?.value);
    const res = await followUser(userId, currentUser.id);
    return res;
}
