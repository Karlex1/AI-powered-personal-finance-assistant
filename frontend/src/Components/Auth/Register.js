import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext"; // Assuming you're using an AuthContext
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { register } = useAuth(); // `register` function from AuthContext
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await register(email, password);
            navigate("/dashboard"); // Redirect to the dashboard after successful registration
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
