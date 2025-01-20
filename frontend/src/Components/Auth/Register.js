import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext"; // AuthContext for Firebase functions
import { useNavigate } from "react-router-dom";
// import { doc, setDoc } from "firebase/firestore"; // Firestore methods
// import { db } from "../../firebase"; // Firestore instance from firebase.js

const Register = () => {
    const { register } = useAuth(); // Register function from AuthContext
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [gender, setGender] = useState("");
    const [som, setSom] = useState("");//start_of_month
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(email, password, name, gender, budget, som);

            // Navigate to the dashboard
            navigate("/dashboard");

            // Navigate to the dashboard
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Monthly Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Starting Date of Month"
                value={som}
                onChange={(e) => setSom(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
            >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Other">Other</option>
            </select>
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
