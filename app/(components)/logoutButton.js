"use client";

import toast from "react-hot-toast";
import { deleteSession } from "../(lib)/sessions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    async function handleSubmit() {
        const res = await deleteSession();
        if (!res.success) {
            toast.error(res.message);
            return;
        }
        toast.success("logged out sucessfully");
        router.push("/login");
    }
    return (
        <button type="submit" onClick={handleSubmit}>
            Logout
        </button>
    );
}
