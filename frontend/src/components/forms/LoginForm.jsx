import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Input from "../common/Input";
import Button from "../common/Button";

import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setApiError("");

            const response = await authService.login(data);

            login(response.access_token);

            navigate("/dashboard");
        } catch (error) {
            setApiError(
                error.response?.data?.detail || "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <h1 className="text-3xl font-bold">
                Welcome Back
            </h1>

            <p className="text-gray-500">
                Login to your account
            </p>

            <Input
                label="Email"
                type="email"
                name="email"
                placeholder="john@gmail.com"
                register={register}
                validation={{
                    required: "Email is required",
                }}
                errors={errors}
            />

            <Input
                label="Password"
                type="password"
                name="password"
                placeholder="********"
                register={register}
                validation={{
                    required: "Password is required",
                }}
                errors={errors}
            />

            {apiError && (
                <p className="text-red-500 text-sm">
                    {apiError}
                </p>
            )}

            <Button type="submit">
                {loading ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-center">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="text-blue-600"
                >
                    Register
                </Link>
            </p>
        </form>
    );
}

export default LoginForm;