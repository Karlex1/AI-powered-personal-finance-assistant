import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext"; // Assuming you're using an AuthContext

const ForgotPassword = () => {
    const { resetPassword } = useAuth(); // `resetPassword` function from AuthContext
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            await resetPassword(email);
            setMessage("Password reset email sent!");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ForgotPassword;
