function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`w-full bg-[#25211E] text-white py-3 rounded-xl font-semibold hover:bg-[#3B342F] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;