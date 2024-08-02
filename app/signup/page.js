"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import signUpAction from "./action";

export default function Signup() {
    const router = useRouter();
    const [state, setState] = useState("");

    const userSchema = z.object({
        email: z.string().email({ message: "enter a valid email id" }),
        name: z.string().min(1, { message: "please enter the name" }),
        password: z.string(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    async function post(data) {
        const res = await signUpAction(data);
        if (!res.success) {
            setState(res.message);
        } else {
            router.push("/login");
        }
    }

    //jsx signup form
    return (
        <div className="w-full flex justify-center">
            <form onSubmit={handleSubmit(post)} className="flex flex-col gap-2">
                <input
                    {...register("name")}
                    type="text"
                    name="name"
                    placeholder="name"
                    className="border-2 border-red-300"
                />
                {errors.name?.message && <p>errors.name?.message</p>}

                <input
                    {...register("email")}
                    type="text"
                    name="email"
                    placeholder="email"
                    className="border-2 border-red-300"
                />
                {errors.email?.message && <p>{errors.email?.message}</p>}

                <input
                    {...register("password")}
                    type="text"
                    name="password"
                    placeholder="password"
                    className="border-2 border-red-300"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-400 disabled:bg-red-200"
                >
                    submit
                </button>

                {state && <p>{state}</p>}
            </form>
        </div>
    );
}
