import { redirect } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Timeago from "./(lib)/timeago";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { Suspense } from "react";

export default async function Home({ searchParams }) {
    const selectedCategory = searchParams.category || null;
    const prisma = new PrismaClient();
    const posts = selectedCategory
        ? await prisma.post.findMany({
              where: {
                  category: selectedCategory,
              },
              include: {
                  author: {
                      include: {
                          password: false,
                      },
                  },
                  comments: true,
              },
          })
        : await prisma.post.findMany({
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
        <div className="w-[95%] sm:w-[87%] pt-[35px] mx-auto grid md:grid-cols-[5fr,2fr] h-[94svh]">
            <div>
                <form
                    action=""
                    className="bg-[#F4F4F4] sm:w-[60%] rounded-2xl grid grid-cols-[8fr,1fr]"
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

                <div className=" ml-0 mt-4 h-auto">
                    {posts.length != 0 ? (
                        posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id}>
                                <Suspense fallback="loading">
                                    <div className="mb-3 py-2 rounded-md flex sm:mx-3 hover:bg-[#f9f9f9] transition-all ease-in-out duration-300 sm:flex-row flex-col items-center sm:justify-center gap-3">
                                        {/* image container 👇 */}
                                        <div className="w-[97%] sm:w-[29%] sm:ml-3 rounded-md overflow-hidden sm:h-[170px]">
                                            <img
                                                src={post.image}
                                                alt="cover"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* 👇 this container shows the details of post and description */}
                                        <div className="w-full sm:w-[71%] pl-3 sm:pl-2 flex flex-col gap-2">
                                            <div className="max-h-14 text-lg font-semibold text-[#232b2b] overflow-hidden ">
                                                {post.title}
                                            </div>

                                            <div className="flex">
                                                <div className="rounded-[8px] px-3 py-1 text-[#444444] text-[10.5px] font-semibold bg-[#F2F2F2]">
                                                    {post.category}
                                                </div>
                                            </div>

                                            <div className="mr-[17px] pt-1 max-h-9 overflow-hidden text-[11.5px] font-medium leading-4 text-[#343434]">
                                                {post.description}
                                            </div>

                                            <div className="text-[11.4px] font-medium pt-[2px] text-[#737373] flex items-center gap-[6px]">
                                                <span>
                                                    Posted by{" "}
                                                    <span className="font-semibold text-[#4f4f4f]">
                                                        {post.author.name}
                                                    </span>
                                                </span>
                                                <GoDotFill size={"0.6em"} />

                                                <Timeago
                                                    date={post.createdAt}
                                                />
                                            </div>

                                            <div className="flex gap-3 items-center text-gray-500 pt-1">
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
                                </Suspense>
                            </Link>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            <div className="p-2 border-green-400">
                <div className="max-sm:hidden h-[200px] sm:h-[33%] rounded-3xl p-6 bg-[#f5f5f5] flex flex-col gap-3">
                    <div className="flex flex-col text-xl font-semibold gap-1">
                        <div>Share your thoughts,</div>
                        <div>Inspire the world</div>
                    </div>

                    <div className="text-sm font-semibold text-[#707070]">
                        our story matters. start writing your blog today and let
                        your thoughts make an impact.
                    </div>

                    <div className="flex">
                        <Link href={"/create"}>
                            <div className="border-2 rounded-md text-sm font-semibold bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                📝 write
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
