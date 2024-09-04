import { PrismaClient } from "@prisma/client";
import { decrypt, followUser } from "../(lib)/sessions";
import { cookies } from "next/headers";
import Button from "./button";

export async function followAction(formData) {
    const prisma = new PrismaClient();
    console.log(formData);
    return;
    ("use server");
    const res = await followUser(formData.get("userId"), currentUser.id);
    console.log(res.message);
}

export default async function Follow() {
    const currentUser = await decrypt(cookies().get("session")?.value);

    const TopUserstoFollow = await prisma.user.findMany({
        where: {
            NOT: {
                followers: {
                    some: {
                        followedById: currentUser.id,
                    },
                },
            },
            id: {
                not: currentUser.id,
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            followers: {
                include: {
                    id: false,
                    followedById: false,
                    followingId: false,
                    followedBy: {
                        include: {
                            password: false,
                        },
                    },
                },
            },
            _count: {
                select: { followers: true },
            },
        },
        orderBy: {
            followers: {
                _count: "desc",
            },
        },
    });

    // console.log(TopUserstoFollow);

    return (
        <div>
            {TopUserstoFollow &&
                TopUserstoFollow.map((user) => (
                    <div className="mb-2" key={user.id}>
                        {user.name}
                        <Button userId={user.id} />
                    </div>
                ))}
        </div>
    );
}
