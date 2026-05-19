import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', form);
            login(res.data.token);
            alert("¡Conexión exitosa con el Backend!");
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || "Servidor no alcanzado"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">SecondHand Store</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-6 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200">
                    Ingresar
                </button>
            </form>
        </div>
    );
};

export default Login;