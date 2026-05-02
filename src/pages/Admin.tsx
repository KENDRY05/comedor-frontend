import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");

  const navigate = useNavigate();

  const createFood = () => {
    api.post("/foods", {
      nombre,
      precio,
      cantidad_disponible: cantidad
    })
    .then(() => {
      alert("Comida creada ✅");
      setNombre("");
      setPrecio("");
      setCantidad("");
    })
    .catch(() => {
      alert("Error al crear");
    });
  };

    const container = {
  height: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)"
};

const title = {
  color: "white",
  fontSize: "32px",
  marginBottom: "20px"
};

const card = {
  width: "420px",
  padding: "25px",
  borderRadius: "15px",
  background: "#f1f5f9",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white",
  fontSize: "14px"
};

const btnCreate = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#22c55e",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px"
};

const btnBack = {
  marginTop: "25px",
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontSize: "16px",
  cursor: "pointer"
};
  return (
    <div style={container}>
      
      <h1 style={title}>👨‍🍳 Panel Admin</h1>

      <div style={card}>
        <input
          style={input}
          placeholder="🍽️ Nombre comida"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          style={input}
          placeholder="💲 Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <input
          style={input}
          placeholder="📦 Cantidad disponible"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button onClick={createFood} style={btnCreate}>
          + Crear comida 👨‍🍳
        </button>
      </div>

      {/* 🔙 BOTÓN VOLVER */}
      <button onClick={() => navigate("/menu")} style={btnBack}>
        ← Volver al menú
      </button>

    </div>
  );
}