import prisma from "@/app/(lib)/prisma";
import { notFound } from "next/navigation";
import { Comment } from "./comments";
import { decrypt } from "@/app/(lib)/sessions";
import { cookies } from "next/headers";
import Image from "next/image";
import DeleteButton from "./deleteButton";
import { GoDotFill } from "react-icons/go";
import Timeago from "./timeago";
import { getPlaiceholder } from "plaiceholder";
import { TbFileSad } from "react-icons/tb";
import { FaCircleUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";

export default async function Slug({ params }) {
    const post = await prisma.post.findFirst({
        where: {
            slug: params.slug,
        },
        include: {
            comments: {
                include: {
                    cmntAuthor: {
                        include: {
                            password: false,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            author: {
                include: {
                    password: false,
                },
            },
        },
    });

    if (post == null) {
        return notFound();
    }
    const comments = post.comments;

    const currentUser = await decrypt(cookies().get("session")?.value);

    const buffer = await fetch(post.image).then(async (res) => {
        return Buffer.from(await res.arrayBuffer());
    });
    const { base64 } = await getPlaiceholder(buffer);

    return (
        <div className="md:mx-[10%] mx-4 flex flex-col items-center">
            <div className="text-3xl font-semibold mt-10 mb-1 text-center">
                {post.title}
            </div>

            <div className="flex items-center my-2">
                <p className="font-medium text-sm text-gray-500">
                    posted by {post?.author?.name}
                </p>

                <div className="mx-2">
                    <GoDotFill color="grey" size={"0.5em"} />
                </div>

                <p className="font-medium text-sm text-gray-500">
                    <Timeago date={post?.createdAt} />
                </p>
            </div>

            <div className="w-full overflow-hidden flex items-center justify-center rounded-md my-2">
                {/* <Image
                    src={post.image}
                    placeholder="blur"
                    width={1130}
                    height={600}
                    blurDataURL={base64}
                /> */}
            </div>

            <div
                className="prose-sm prose !max-w-none mt-8"
                dangerouslySetInnerHTML={{
                    __html: post.description,
                }}
            />

            <div className="w-full mt-10 mb-2 text-gray-600">
                <div className="font-semibold text-3xl">Comments</div>
            </div>

            <div className="w-full h-[70px] py-2">
                {cookies().get("session")?.value ? (
                    <div className="h-[70px] pl-[2px]">
                        <Comment postId={post.id} slug={params.slug} />
                    </div>
                ) : (
                    <div className="flex gap-2 items-center py-3">
                        <MdLogin size={"1.4em"} />
                        <div className="font-semibold text-sm">
                            please login to add comments.
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full mt-2">
                {comments?.length == 0 ? (
                    <div className="flex gap-1 items-center mt-2 mb-8">
                        <TbFileSad size={"1.5em"} />
                        <p className="font-semibold text-sm">
                            no comments. be first to comment
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {comments.map((comment, i) => (
                            <div key={i}>
                                <div className="flex gap-[10px] items-center py-3">
                                    <div className="">
                                        <FaCircleUser
                                            size={"2.6em"}
                                            className="pt-[1px]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[1.1px]">
                                        <div className="flex gap-[5px] items-center">
                                            <p className="font-bold text-[14px]">
                                                @{comment?.cmntAuthor.name}
                                            </p>

                                            <GoDotFill
                                                color="grey"
                                                size={"0.4em"}
                                            />

                                            <p className="text-[12px] font-medium text-[grey]">
                                                <Timeago
                                                    date={comment?.createdAt}
                                                />
                                            </p>
                                        </div>
                                        <div className="text-sm font-normal">
                                            {comment?.comment}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
