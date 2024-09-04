"use client";

import { useState } from "react";
import { followUser, unFollowUsr } from "./action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RiUserUnfollowLine, RiUserFollowLine } from "react-icons/ri";
import Link from "next/link";

export default function UserCard({ user }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(
        user?._count.followers
    );
    const router = useRouter();

    async function followButtonAction() {
        isFollowing ? setIsFollowing(false) : setIsFollowing(true);
        isFollowing
            ? setFollowersCount(parseInt(followersCount) - 1)
            : setFollowersCount(parseInt(followersCount) + 1);

        const res = isFollowing
            ? await unFollowUsr(user.id)
            : await followUser(user.id);

        if (!res.success) {
            if ((res.message = "not authorised")) {
                toast.error("please login");
                router.push("/login");
                return;
            }
            toast.error(res.message);
            isFollowing ? setIsFollowing(true) : setIsFollowing(false);
        } else {
            toast.success(`${res.message} ${user.name}`);
        }
    }

    return (
        <div className=" flex items-center hover:bg-[#f5f5f5] p-2 rounded-lg transition-all ease-in-out duration-500 cursor-pointer gap-3">
            <img
                src="https://avatar.iran.liara.run/public/42"
                className="w-[38px]"
            />

            <div className="flex flex-col w-[28%]">
                <Link href={`/user/${user.id}`}>
                    <div className="text-[14px] font-semibold hover:underline mb-[2px]">
                        {user.name}
                    </div>
                </Link>

                <div className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                    {followersCount} followers
                </div>
            </div>

            <button
                className="text-white bg-[#333333] px-2 py-[5px] font-medium rounded-md text-[11px] flex"
                onClick={followButtonAction}
            >
                {isFollowing ? (
                    <div className="flex items-center gap-2">
                        <RiUserUnfollowLine size={"1.2em"} />
                        <div className="pr-2">Unfollow</div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <RiUserFollowLine size={"1.2em"} />
                        <div className="pr-2">Follow</div>
                    </div>
                )}
            </button>
        </div>
    );
}
