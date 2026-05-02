import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 📦 Obtener comidas
  useEffect(() => {
    api.get("/foods").then((res) => setFoods(res.data));
  }, []);

  // 💾 Guardar carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🛒 Agregar al carrito
  const addToCart = (food: any) => {
    const exist = cart.find((item) => item.id_food === food.id);

    if (exist) {
      if (exist.cantidad >= food.cantidad_disponible) {
        alert("No hay más stock ❌");
        return;
      }

      setCart(
        cart.map((item) =>
          item.id_food === food.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id_food: food.id,
          nombre: food.nombre,
          precio: food.precio,
          cantidad: 1
        }
      ]);
    }
  };

  const increase = (id: number) => {
    setCart(
      cart.map((item) =>
        item.id_food === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const decrease = (id: number) => {
    setCart(
      cart
        .map((item) =>
          item.id_food === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id_food !== id));
  };

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // 🧾 Crear pedido
  const makeOrder = () => {
    api.post("/orders", {
      id_usuario: user.id,
      items: cart
    })
    .then(() => {
      alert("Pedido realizado ✅");
      setCart([]);
      localStorage.removeItem("cart");
    })
    .catch((err) => {
      alert(err.response?.data?.error || "Error");
    });
  };

  // 🧑‍🍳 ADMIN
  const deleteFood = (id: number) => {
    if (!confirm("¿Eliminar comida?")) return;

    api.delete(`/foods/${id}`)
      .then(() => {
        setFoods(foods.filter((f) => f.id !== id));
      })
      .catch(() => alert("Error"));
  };

  const editFood = (food: any) => {
    const nombre = prompt("Nombre:", food.nombre);
    const precio = prompt("Precio:", food.precio);
    const cantidad = prompt("Cantidad:", food.cantidad_disponible);

    if (!nombre || !precio || !cantidad) return;

    api.put(`/foods/${food.id}`, {
      nombre,
      precio,
      cantidad_disponible: cantidad
    })
    .then(() => {
      setFoods(
        foods.map((f) =>
          f.id === food.id
            ? { ...f, nombre, precio, cantidad_disponible: cantidad }
            : f
        )
      );
    })
    .catch(() => alert("Error"));
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const container = {
  padding: "20px",
  background: "#0f172a",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
  color: "white"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px"
};

const card = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  textAlign: "center",
  color: "white"
};

const cartItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  background: "#1e293b",
  marginBottom: "10px",
  borderRadius: "8px",
  color: "white"
};

const btnBlue = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "5px"
};

const btnYellow = {
  background: "#f59e0b",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnRed = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnGreen = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px"
};
  return (
    <div style={container}>
      
      {/* HEADER */}
      <div style={header}>
        <h2>👋 {user.nombre}</h2>

        <div>
          <button onClick={() => navigate("/orders")} style={btnBlue}>
            Pedidos 📊
          </button>

          {user.rol === "admin" && (
            <button onClick={() => navigate("/admin")} style={btnBlue}>
              Admin 🧑‍🍳
            </button>
          )}

          <button onClick={logout} style={btnRed}>
            Logout 🔓
          </button>
        </div>
      </div>

      <h1 style={{ color: "white" }}>Menú 🍽️</h1>

      {/* GRID */}
      <div style={grid}>
        {foods.map((food) => (
          <div key={food.id} style={card}>
            <h3>{food.nombre}</h3>
            <p>C${food.precio}</p>
            <p>Stock: {food.cantidad_disponible}</p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => addToCart(food)} style={btnBlue}>
                Agregar 🛒
              </button>

              {user.rol === "admin" && (
                <>
                  <button onClick={() => editFood(food)} style={btnYellow}>
                    Editar ✏️
                  </button>

                  <button onClick={() => deleteFood(food.id)} style={btnRed}>
                    Eliminar 🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO */}
      <h2 style={{ color: "white" }}>Carrito 🛒</h2>

      {cart.map((item) => (
        <div key={item.id_food} style={cartItem}>
          <span>{item.nombre}</span>

          <div>
            <button onClick={() => decrease(item.id_food)}>-</button>
            <span style={{ margin: "0 10px" }}>{item.cantidad}</span>
            <button onClick={() => increase(item.id_food)}>+</button>
          </div>

          <span>C${item.precio * item.cantidad}</span>

          <button onClick={() => removeItem(item.id_food)}>❌</button>
        </div>
      ))}

      <h3 style={{ color: "white" }}>Total: C${total}</h3>

      <button onClick={makeOrder} style={btnGreen}>
        Realizar pedido 🚀
      </button>
    </div>
  );
}