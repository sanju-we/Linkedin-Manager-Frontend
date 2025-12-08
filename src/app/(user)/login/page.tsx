"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { USER_SERVICE } from "@/service/APIs/user.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ name: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // ------------------ VALIDATION ------------------
    const validateForm = () => {
        const newErrors = { name: "", password: "" };
        let isValid = true;

        if (!name) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // ------------------ HANDLE LOGIN ------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const data = await USER_SERVICE.LOGIN({ name, password });
            if (data?.success) {
                toast.success("Login successful!");
                setTimeout(() => {
                    router.push("/profile");
                }, 500);
            }
        } catch (error: any) {
            setApiError(error?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {apiError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {apiError}
                            </div>
                        )}

                        {/* NAME FIELD */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors({ ...errors, name: "" });
                                }}
                                className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 transition-colors 
                                ${errors.name ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* PASSWORD FIELD */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors({ ...errors, password: "" });
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 transition-colors pr-12 
                                    ${errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors 
                                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
