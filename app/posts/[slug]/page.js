import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Comment } from "./comments";
import { decrypt, verifySession } from "@/app/(lib)/sessions";
import { cookies } from "next/headers";
import Image from "next/image";
import DeleteButton from "./deleteButton";

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

    const user = await decrypt(cookies().get("session")?.value);

    const comments = await prisma.comment.findMany({
        where: {
            postId: post.id,
        },
    });

    comments.reverse();

    return (
        <div className="mx-4 sm:mx-40 flex flex-col items-center">
            <div className="text-5xl my-2">{post.title}</div>

            {post.authorId == user?.id ? (
                <>
                
                    <DeleteButton id={post.id} imageId={post.imageId}/>
                </>
            ) : (
                <>you are not the author</>
            )}

            <div className="my-2">
                <Image src={post.image} width={500} height={300} />
            </div>

            <div
                className="prose-sm prose !max-w-none my-6"
                dangerouslySetInnerHTML={{
                    __html: post.description,
                }}
            />

            <div>
                {cookies().get("session")?.value ? (
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
        </div>
    );
}
