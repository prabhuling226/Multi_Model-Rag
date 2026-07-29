import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Input from "../common/Input";
import Button from "../common/Button";

import authService from "../../services/authService";

function RegisterForm() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log("Submitting Form...");
        console.log(data);

        try {
            setLoading(true);
            setApiError("");

            const response = await authService.register({
                full_name: data.full_name,
                email: data.email,
                password: data.password,
            });

            console.log("Registration Success:", response);

            alert("Registration Successful!");

            navigate("/");

        } catch (error) {
            console.error(error);

            if (error.response) {
                setApiError(error.response.data.detail);
            } else if (error.request) {
                setApiError("Cannot connect to backend server.");
            } else {
                setApiError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 w-full"
        >
            <h1 className="text-4xl font-bold">
                Create Account
            </h1>

            <Input
                label="Full Name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                register={register}
                validation={{
                    required: "Full Name is required",
                }}
                errors={errors}
            />

            <Input
                label="Email"
                name="email"
                type="email"
                placeholder="john@gmail.com"
                register={register}
                validation={{
                    required: "Email is required",
                }}
                errors={errors}
            />

            <Input
                label="Password"
                name="password"
                type="password"
                placeholder="********"
                register={register}
                validation={{
                    required: "Password is required",
                    minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                    },
                }}
                errors={errors}
            />

            {apiError && (
                <p className="text-red-500 text-sm">
                    {apiError}
                </p>
            )}

            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center">
                Already have an account?{" "}
                <Link
                    to="/"
                    className="text-blue-600 hover:underline"
                >
                    Login
                </Link>
            </p>
        </form>
    );
}

export default RegisterForm;