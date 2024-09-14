"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { like, unLike } from "./action";

export default function LikeButton({
    likeStatus,
    NoOfLikes,
    postId,
    slug,
    currentUser,
}) {
    const [isLiked, setIsLiked] = useState(likeStatus);
    const [likeCount, setLikeCount] = useState(NoOfLikes);
    const router = useRouter();

    async function likeActionButton() {
        if (!currentUser.success) {
            router.push(`/login?redirect=/blog/${slug}`);
            return;
        }

        isLiked ? setIsLiked(false) : setIsLiked(true);

        isLiked
            ? setLikeCount(parseInt(likeCount) - 1)
            : setLikeCount(parseInt(likeCount) + 1);

        const res = isLiked
            ? await unLike(postId, currentUser.id)
            : await like(postId, currentUser.id);
        if (!res.success) {
            isLiked ? setIsLiked(true) : setIsLiked(false);
            toast.error(res.message);
        }
    }
    return (
        <div
            onClick={likeActionButton}
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
