// Configuración de la API del Backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Headers por defecto
export const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("ecotienda_token") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Función para hacer peticiones al API
export const apiCall = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, any>,
  includeAuth = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: getHeaders(includeAuth),
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        // Leer el body como texto una sola vez
        const bodyText = await response.text();
        if (bodyText) {
          // Intentar parsearlo como JSON
          const errorData = JSON.parse(bodyText);
          errorMessage = errorData.error || errorData.mensaje || errorMessage;
        }
      } catch (parseError) {
        // Si no se puede parsear como JSON, ya tenemos el texto crudo
        // No hacer nada, usar errorMessage por defecto
      }
      
      console.error(`[API ERROR] ${method} ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[API FETCH ERROR] ${method} ${endpoint}:`, error.message);
      throw error;
    }
    throw new Error("Error desconocido en la solicitud");
  }
};
