"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import loginAction from "./action";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    // this state is used to display weather is the user exists or the password is incorrect
    const [state, setState] = useState("");

    //zod schema for login form
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1, { message: "please enter a password" }),
    });

    //useform for zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

    //this is function called by submitting the form, this function will call a server function to create session for authenticated user
    async function post(data) {
        const res = await loginAction(data);
        if (!res.success) {
            setState(res.message);
        } else {
            router.push("/");
        }
    }

    //jsx logoin form
    return (
        <div className="w-full h-[94svh] flex justify-center bg-gray-900">
            {/* <div className="border-2 border-blue-500 sm:w-[500px] w-[350px] h-[80%] mt-[70px]">
                hello
            </div> */}
            <form
                onSubmit={handleSubmit(post)}
                className="flex flex-col gap-2 rounded-lg sm:w-[490px] w-[370px] h-[80%] mt-[70px] bg-white p-4"
            >
                <input
                    {...register("email")}
                    type="text"
                    name="email"
                    placeholder="email"
                    className="border-2 border-red-300"
                    autoCapitalize="off"
                />
                {errors.email?.message && <p>{errors.email?.message}</p>}

                <input
                    {...register("password")}
                    type="password"
                    name="password"
                    placeholder="password"
                    className="border-2 border-red-300"
                />
                {errors.password?.message && <p>{errors.password?.message}</p>}

                <div className="flex">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-red-400 disabled:bg-slate-300"
                    >
                        submit
                    </button>
                </div>
                {state && <p>{state}</p>}
            </form>
        </div>
    );
}
