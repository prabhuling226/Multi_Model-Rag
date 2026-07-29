function Input({
    label,
    type = "text",
    placeholder,
    register,
    name,
    errors,
}) {

    return (

        <div className="space-y-2">

            <label className="font-medium text-[#2E2926]">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                {...register(name)}
                className="
                    w-full
                    rounded-xl
                    border
                    border-[#E8DDD0]
                    bg-white
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-[#25211E]
                "
            />

            {errors?.[name] && (

                <p className="text-red-500 text-sm">

                    {errors[name].message}

                </p>

            )}

        </div>

    );

}

export default Input;