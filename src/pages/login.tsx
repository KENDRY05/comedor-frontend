import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate();
  

  const handleLogin = () => {
    api.post("/auth/login", { email, password })
      .then((res) => {
        console.log(res.data);

        // guardar token
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/menu");
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Error");
      });
  };

   const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
};

const card = {
  width: "400px", // 🔥 más grande
  padding: "40px",
  borderRadius: "15px",
  background: "white",
  textAlign: "center" as const,
  boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
};

const title = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1e293b", // 🔥 color visible
  marginBottom: "10px"
};

const subtitle = {
  color: "#64748b",
  fontSize: "14px",
  marginBottom: "20px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const btn = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
  color: "white",
  fontSize: "16px",
  cursor: "pointer"
};
  return (
  <div style={container}>
    <div style={card}>
      <div style={{ fontSize: "40px" }}>🔐</div>

      <h1 style={title}>Iniciar sesión</h1>
      <p style={subtitle}>
        Bienvenido, ingresa tus credenciales
      </p>

      <input
        style={input}
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={input}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} style={btn}>
        Entrar 🚀
      </button>
    </div>
  </div>
);
}
