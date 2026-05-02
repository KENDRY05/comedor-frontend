import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders/details")
      .then((res) => {
        console.log("ORDERS:", res.data); // DEBUG
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("ERROR:", err);
      });
  }, []);

    const container = {
  padding: "20px",
  background: "#0f172a",
  minHeight: "100vh"
};

const card = {
  background: "#1e293b",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px"
};

const btn = {
  marginTop: "20px",
  padding: "10px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
  return (
    <div style={container}>
      <h1 style={{ color: "white" }}>📊 Historial de pedidos</h1>

      {orders.length === 0 && (
        <p style={{ color: "white" }}>No hay pedidos aún</p>
      )}

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <h3>Pedido #{order.id}</h3>
          <p>Fecha: {order.fecha}</p>

          {order.items && order.items.length > 0 ? (
            order.items.map((item: any, i: number) => (
              <p key={i}>
                {item.nombre} x{item.cantidad}
              </p>
            ))
          ) : (
            <p>No hay items</p>
          )}

          <strong>Total: C${order.total}</strong>
        </div>
      ))}

      <button onClick={() => navigate("/menu")} style={btn}>
        ← Volver al menú
      </button>
    </div>
  );
}