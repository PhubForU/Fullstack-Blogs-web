import { redirect } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Timeago from "./(lib)/timeago";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import Link from "next/link";

export default async function Home() {
    const prisma = new PrismaClient();
    const posts = await prisma.post.findMany({
        include: {
            author: {
                include: {
                    password: false,
                },
            },
            comments: true,
        },
    });
    async function search(formData) {
        "use server";
        redirect(`/search?query=${formData.get("search")}`);
    }
    return (
        <div className="w-[87%] pt-[40px] mx-auto grid grid-cols-[5fr,2fr] h-[94svh]">
            <div>
                <form
                    action=""
                    className="bg-[#F4F4F4] w-[60%] rounded-2xl grid grid-cols-[8fr,1fr]"
                >
                    <input
                        type="text"
                        name="search"
                        placeholder="Search Blogs..."
                        className="focus:outline-none bg-[#F4F4F4] ml-4 px-2 py-[12px] text-sm font-medium text-gray-600"
                    />
                    <button
                        type="submit"
                        className="rounded-[28px] flex items-center justify-center"
                    >
                        <MdSearch size={"1.2em"} />
                    </button>
                </form>

                <div className="mt-6 pl-2">
                    <div className="flex gap-2 items-end">
                        <span className="text-2xl font-semibold">Blogs</span>
                        <span className="font-semibold text-sm text-[#6C6C6C]">
                            for you
                        </span>
                    </div>
                </div>

                <div className="ml-2 mt-4 h-auto">
                    {posts.length != 0 ? (
                        posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id}>
                                <div className="mb-4 py-2 pl-1 flex h-[200px]">
                                    <div className="w-[29%] rounded-md overflow-hidden">
                                        {/* <Image
                                            src={post.image}
                                            width={1800}
                                            height={1000}
                                            className="object-cover"
                                        ></Image> */}
                                        <img
                                            src={post.image}
                                            alt="cover"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="w-[71%] pl-5">
                                        <div className="flex">
                                            <div className="rounded-md mt-1 mb-1 px-3 py-1 text-slate-500 text-[10.5px] font-semibold bg-[#F6F6F6]">
                                                {post.category}
                                            </div>
                                        </div>

                                        <div className="mr-8 h-6 pt-[2px] font-semibold text-gray-600">
                                            {post.title}
                                        </div>

                                        <div
                                            className=" mt-2 mb-1 mr-7 overflow-hidden max-h-12 text-[11.5px] font-medium text-gray-500 leading-4"
                                            dangerouslySetInnerHTML={{
                                                __html: post.description,
                                            }}
                                        ></div>

                                        <div className=" pt-1 pb-[6px] text-[11.5px] font-medium text-gray-400">
                                            <span>
                                                Posted by{" "}
                                                <span className="font-semibold text-gray-500">
                                                    {post.author.name}
                                                </span>
                                            </span>{" "}
                                            , <Timeago date={post.createdAt} />
                                        </div>

                                        <div className="flex gap-3 items-center my-1 text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <div className="bg-red-100 p-[5px] rounded-full">
                                                    <CiHeart
                                                        color="#FF0808"
                                                        size={"0.8em"}
                                                    />
                                                </div>
                                                <div className="text-[10px] font-semibold">
                                                    {post.likeCount}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <div className="bg-green-100 p-[5px] rounded-full">
                                                    <GoComment
                                                        size={"0.9em"}
                                                        color="green"
                                                    />
                                                </div>
                                                <div className="text-[10px] font-semibold">
                                                    {post.comments.length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="border border-green-400">block 2</div>
        </div>
    );
}
