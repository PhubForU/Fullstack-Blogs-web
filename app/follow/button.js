"use client";

import { useState } from "react";
import { followAction } from "./action";
import toast from "react-hot-toast";

export default function Button({ userId }) {
    const [isFollowing, setIsFollowing] = useState(false);

    async function changeState() {
        isFollowing ? setIsFollowing(false) : setIsFollowing(true);
        const res = await followAction(userId);
        toast.success(res.message);
    }
    return (
        <div>
            <button
                onClick={changeState}
                className="p-2 bg-black text-white rounded-md m-2"
            >
                {isFollowing ? "following" : "follow"}
            </button>
        </div>
    );
}
