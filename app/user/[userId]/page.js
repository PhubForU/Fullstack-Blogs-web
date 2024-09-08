import { PrismaClient } from "@prisma/client";

export default async function User({ params }) {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
        where: {
            id: params.userId,
        },
        // include: {
        //     following: {
        //         include: {
        //             followedBy: false,
        //             following: true,
        //         },
        //     },
        //     followers: {
        //         include: {
        //             followedBy: true,
        //             following: false,
        //         },
        //     },
        // },
        select: {
            id: true,
            email: true,
            name: true,
            posts: true,
            followers: {
                select: {
                    followedBy: {
                        include: {
                            password: false,
                        },
                    },
                },
            },
            following: {
                select: {
                    following: true,
                },
            },
        },
    });

    return (
        <div>
            User page {user.name}
            <div>
                your followers:
                {user.followers.length != 0 ? (
                    <>
                        {user.followers.map((follower) => (
                            <div>{follower.followedBy.name}</div>
                        ))}
                    </>
                ) : (
                    <>you have no followers</>
                )}
            </div>
            <div>
                people you follow:
                {user.following.length != 0 ? (
                    <>
                        {user.following.map((follower) => (
                            <div>{follower.following.name}</div>
                        ))}
                    </>
                ) : (
                    <>you have not following any one</>
                )}
            </div>
        </div>
    );
}
