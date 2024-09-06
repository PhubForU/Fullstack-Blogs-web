"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { like, unLike } from "./likesAction";
import toast from "react-hot-toast";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import confetti from "canvas-confetti";

export default function Likes({
    likeStatus,
    NoOfLikes,
    postId,
    slug,
    isLoggedIn,
}) {
    const [isLiked, setIsLiked] = useState(likeStatus);
    const [likeCount, setLikeCount] = useState(NoOfLikes);
    const router = useRouter();

    async function followButtonAction() {
        if (!isLoggedIn) {
            router.push(`/login?redirect=/blog/${slug}`);
            return;
        }

        isLiked ? setIsLiked(false) : setIsLiked(true);

        isLiked
            ? setLikeCount(parseInt(likeCount) - 1)
            : setLikeCount(parseInt(likeCount) + 1);

        const res = isLiked ? await unLike(postId) : await like(postId);
        if (!res.success) {
            isLiked ? setIsLiked(true) : setIsLiked(false);
            toast.error(res.message);
        } else {
            toast.success(`${res.message}`);
        }
    }
    return (
        <div
            onClick={followButtonAction}
            className="cursor-pointer flex items-center gap-1 "
        >
            <div className="flex items-center justify-center p-1">
                {isLiked ? (
                    <IoMdHeart size={"1.1em"} color="red" />
                ) : (
                    <IoMdHeartEmpty size={"1.1em"} color="black" />
                )}
            </div>
            <div className="text-[12px] font-medium">{likeCount} likes</div>
        </div>
    );
}
