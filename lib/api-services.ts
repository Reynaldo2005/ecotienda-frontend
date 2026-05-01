import { apiCall } from "./api-config";

// ==========================================
// OFERTAS
// ==========================================
export const ofertasService = {
  // Obtener todas las ofertas (cliente)
  getOfertas: () => apiCall("/ofertas", "GET"),

  // Reclamar una oferta (cliente)
  reclamarOferta: (oferta_id: number) =>
    apiCall("/ofertas/reclamar", "POST", { oferta_id }),

  // Crear oferta (admin)
  crearOferta: (data: {
    titulo: string;
    descripcion: string;
    imagen_url: string;
    kilos_requeridos: number;
    stock: number;
  }) => apiCall("/ofertas", "POST", data),

  // Ver reclamos pendientes (admin)
  getReclamos: () => apiCall("/ofertas/reclamos", "GET"),

  // Cambiar estado de reclamo (admin)
  cambiarEstadoReclamo: (id: number, estado: string) =>
    apiCall(`/ofertas/reclamos/${id}`, "PUT", { estado }),

  // Eliminar oferta (admin)
  eliminarOferta: (id: number) => apiCall(`/ofertas/${id}`, "DELETE"),

  // Subir imagen de oferta (admin)
subirImagen: async (file: File): Promise<{ url: string }> => {
  const token = localStorage.getItem("ecotienda_token");
  const formData = new FormData();
  formData.append("imagen", file);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  const response = await fetch(`${baseUrl}/ofertas/upload-imagen`,  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al subir imagen");
  }

  return response.json();
},
};

// ==========================================
// PRODUCTOS
// ==========================================
export const productosService = {
  // Obtener todos los productos
  getProductos: () => apiCall("/productos", "GET"),

  // Obtener producto por ID
  getProducto: (id: number) => apiCall(`/productos/${id}`, "GET"),

  // Crear producto (admin)
  crearProducto: (data: {
    categoria_id: number;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    costo_puntos: number;
    stock: number;
  }) => apiCall("/productos", "POST", data),

  // Editar producto (admin)
  editarProducto: (id: number, data: object) =>
    apiCall(`/productos/${id}`, "PUT", data),

  // Eliminar producto (admin)
  eliminarProducto: (id: number) => apiCall(`/productos/${id}`, "DELETE"),
};

// ==========================================
// RECICLAJE Y PUNTOS
// ==========================================
export const reciclajeService = {
  // Ver saldo del cliente
  getSaldo: () => apiCall("/reciclaje/saldo", "GET"),

  // Ver historial de puntos
  getHistorialPuntos: () => apiCall("/reciclaje/historial", "GET"),

  // Registrar reciclaje (admin)
  registrarReciclaje: (data: {
    usuario_id: number;
    material_id: number;
    kilos: number;
  }) => apiCall("/reciclaje", "POST", data),

  // Ver historial de reciclaje de un cliente (admin)
  getHistorialCliente: (usuario_id: number) =>
    apiCall(`/reciclaje/historial/${usuario_id}`, "GET"),

  // Obtener dirección principal del cliente
  getMiDireccion: () => apiCall("/reciclaje/mi-direccion", "GET"),
};

// ==========================================
// CANJES
// ==========================================
export const canjesService = {
  // Solicitar canje (cliente)
  solicitarCanje: (data: {
    producto_id: number;
    direccion_entrega_id: number;
  }) => apiCall("/canjes", "POST", data),

  // Ver mis canjes (cliente)
  getMisCanjes: () => apiCall("/canjes/mis-canjes", "GET"),

  // Ver canjes pendientes (admin)
  getCanjesPendientes: () => apiCall("/canjes/pendientes", "GET"),

  // Cambiar estado del canje (admin)
  cambiarEstado: (id: number, estado: string) =>
    apiCall(`/canjes/${id}/estado`, "PUT", { estado }),

  // Cancelar canje (admin)
  cancelarCanje: (id: number) =>
    apiCall(`/canjes/${id}/cancelar`, "PUT", {}),

  // Eliminar notificación de canje (admin)
  eliminarCanje: (id: number) => apiCall(`/canjes/${id}`, "DELETE"),
};

// ==========================================
// ADMIN
// ==========================================
export const adminService = {
  // Dashboard resumen
  getResumen: () => apiCall("/admin/resumen", "GET"),

  // Ver todos los clientes
  getClientes: () => apiCall("/admin/clientes", "GET"),

  // Buscar cliente por nombre
  buscarCliente: (nombre: string) =>
    apiCall(`/admin/clientes/buscar?nombre=${nombre}`, "GET"),

  // Ver detalle de un cliente
  getDetalleCliente: (id: number) => apiCall(`/admin/clientes/${id}`, "GET"),

  // Ver todos los canjes
  getTodosCanjes: (estado?: string) =>
    apiCall(`/admin/canjes${estado ? `?estado=${estado}` : ""}`, "GET"),

  // Actualizar configuración
  actualizarConfig: (clave: string, valor: string) =>
    apiCall("/admin/configuracion", "PUT", { clave, valor }),

  // Eliminar cliente
  eliminarCliente: (id: number) => apiCall(`/admin/clientes/${id}`, "DELETE"),
};

// ==========================================
// PERFIL
// ==========================================
export const perfilService = {
  subirFotoPerfil: async (file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem("ecotienda_token");
    const formData = new FormData();
    formData.append("foto", file);

    const response = await fetch("http://localhost:3000/api/auth/foto-perfil", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al subir foto");
    }
    return response.json();
  },
};