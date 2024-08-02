import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Comment } from "./comments";
import { verifySession } from "@/app/(lib)/sessions";
import { cookies } from "next/headers";

export default async function Slug({ params }) {
    const prisma = new PrismaClient();

    const post = await prisma.post.findFirst({
        where: {
            slug: params.slug,
        },
    });

    if (post == null) {
        return notFound();
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId: post.id,
        },
    });

    comments.reverse();

    return (
        <div>
            <div>{post.title}</div>

            {(cookies().get('session')?.value) ? (
                <div>
                    <Comment postId={post.id} slug={params.slug} />
                </div>
            ) : (
                <p>please signin to add comment</p>
            )}

            <div className="p-3">all comments</div>
            <div>
                {comments &&
                    comments.map((e, key) => (
                        <div key={key}>
                            {e.comment}
                            <br />
                        </div>
                    ))}
            </div>
        </div>
    );
}
