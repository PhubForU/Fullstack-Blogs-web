import { redirect } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { decrypt } from "./(lib)/sessions";
import { cookies } from "next/headers";
import BlogCard from "./blogCard";
import UserCard from "./userCard";
import { Suspense } from "react";

export default async function Home() {
    const currentUser = await decrypt(cookies().get("session")?.value);

    const prisma = new PrismaClient();

    const allposts = !currentUser.success
        ? await prisma.post.findMany({
              orderBy: {
                  createdAt: "desc",
              },
              take: 6,
              select: {
                  title: true,
                  description: true,
                  image: true,
                  category: true,
                  slug: true,
                  createdAt: true,
                  author: {
                      include: {
                          password: false,
                      },
                  },
                  _count: {
                      select: {
                          comments: true,
                          likes: true,
                      },
                  },
              },
          })
        : [];

    const postsFromFollowing = currentUser.success
        ? await prisma.post.findMany({
              where: {
                  author: {
                      followers: {
                          some: {
                              followedById: currentUser.id,
                          },
                      },
                  },
              },
              orderBy: {
                  createdAt: "desc",
              },
              select: {
                  title: true,
                  description: true,
                  image: true,
                  category: true,
                  slug: true,
                  createdAt: true,
                  author: {
                      include: {
                          password: false,
                      },
                  },
                  _count: {
                      select: {
                          comments: true,
                          likes: true,
                      },
                  },
              },
          })
        : [];

    const postsFromRemaining = currentUser.success
        ? await prisma.post.findMany({
              where: {
                  author: {
                      followers: {
                          none: {
                              followedById: currentUser.id,
                          },
                      },
                  },
              },
              orderBy: {
                  createdAt: "desc",
              },
              select: {
                  title: true,
                  description: true,
                  image: true,
                  category: true,
                  slug: true,
                  createdAt: true,
                  author: {
                      include: {
                          password: false,
                      },
                  },
                  _count: {
                      select: {
                          comments: true,
                          likes: true,
                      },
                  },
              },
          })
        : [];

    const TopUserstoFollow = currentUser.success
        ? await prisma.user.findMany({
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
              take: 3,
              select: {
                  id: true,
                  name: true,
                  email: true,
                  _count: {
                      select: { followers: true },
                  },
              },
              orderBy: {
                  followers: {
                      _count: "desc",
                  },
              },
          })
        : null;

    async function search(formData) {
        "use server";
        redirect(`/search?query=${formData.get("search")}`);
    }

    return (
        <div className="w-[95%] pt-[35px] mx-auto grid md:grid-cols-[5fr,2fr] h-[94svh]">
            {/* 🔴 left section */}

            <div className="md:pl-10 mb-5">
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

                {/* for mobile view */}
                {!currentUser.success && (
                    <div className="rounded-3xl mt-5 px-5 pb-4 flex flex-col gap-3 md:hidden">
                        <div className="font-semibold text-[20px]">
                            Create & Connect
                        </div>
                        <div className="text-[13.5px] font-medium">
                            LogIn your account to share your thoughts and engage
                            with community.
                        </div>
                        <div className="flex gap-3 text-xs font-medium text- items-center pt-1">
                            <Link href={"/login"}>
                                <div className="rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                    Login
                                </div>
                            </Link>

                            <Link href={"/signup"}>
                                <div className=" rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                    SignUp
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mt-6 pl-2">
                    <div className="flex gap-2 items-end">
                        <span className="text-2xl font-semibold">Blogs</span>
                        <span className="font-semibold text-sm text-[#6C6C6C]">
                            for you
                        </span>
                    </div>
                </div>

                {!currentUser.success ? (
                    <div className=" ml-0 mt-3 h-auto">
                        <div className="pl-3 pt-2 mb-3 text-gray-400 font-semibold text-sm">
                            Recent activity
                        </div>
                        {allposts.length != 0 &&
                            allposts.map((post) => (
                                <Link href={`/blog/${post.slug}`} key={post.id}>
                                    <BlogCard post={post} />
                                </Link>
                            ))}
                    </div>
                ) : (
                    <div>
                        {postsFromFollowing.length != 0 && (
                            <div className="ml-0 mt-3 h-auto">
                                <div className="pl-3 pt-2 mb-2 text-gray-400 font-semibold text-sm">
                                    Blogs by people you follow
                                </div>
                                {postsFromFollowing.map((post) => (
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        key={post.id}
                                    >
                                        <BlogCard post={post} />
                                    </Link>
                                ))}
                            </div>
                        )}
                        {postsFromRemaining.length != 0 && (
                            <div className="ml-0 mt-3 h-auto">
                                <div className="pl-3 pt-2 mb-2 text-gray-400 font-semibold text-sm">
                                    Recent blogs
                                </div>
                                {postsFromRemaining.map((post) => (
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        key={post.id}
                                    >
                                        <BlogCard post={post} />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 👇 right side section 👇  */}
            <div className="py-2 border-green-400 flex flex-col sm:flex-row md:flex-col sm:items-center  gap-3 ">
                {TopUserstoFollow?.length > 0 ? (
                    <div className="flex flex-col gap-2 pb-4 w-full">
                        <div className="px-3 pb-3 font-semibold text-lg">
                            Suggested People
                        </div>

                        <div className="flex flex-col gap-2 px-4">
                            {TopUserstoFollow.map((user) => (
                                <Suspense
                                    fallback={<>loading..</>}
                                    key={user.id}
                                >
                                    <UserCard user={user} />
                                </Suspense>
                            ))}
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {!currentUser.success && (
                    <div className="rounded-3xl px-5 pb-4 pt-4 flex flex-col gap-3 max-md:hidden">
                        <div className="font-semibold text-[20px]">
                            Create & Connect
                        </div>
                        <div className="text-[13.5px] font-medium">
                            LogIn your account to share your thoughts and engage
                            with community.
                        </div>
                        <div className="flex gap-3 text-xs font-medium text- items-center pt-1">
                            <Link href={"/login"}>
                                <div className="rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                    Login
                                </div>
                            </Link>

                            <Link href={"/signup"}>
                                <div className=" rounded-md  bg-[#222222] hover:text-gray-300 text-white px-5 py-2 flex items-center justify-center">
                                    SignUp
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                <div className="h-[210px] my-2 md:h-[32%] rounded-3xl p-6 bg-[#f5f5f5] flex flex-col gap-3 justify-center">
                    <div className="flex flex-col text-[19px] font-semibold gap-[3px]">
                        <div>Share your thoughts,</div>
                        <div>Inspire the world</div>
                    </div>

                    <div className="text-[13px] font-medium text-[#707070]">
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
