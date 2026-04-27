import { useErrorStore } from "@/store/useErrorStore";

export async function handleApiError(response: Response, defaultMessage: string = "Ocorreu um erro inesperado.") {
  try {
    const errorData = await response.json();
    
    // Tratamento para DRF ErrorDetail
    if (errorData && typeof errorData === "object") {
      // Se for um array de erros (ex: non_field_errors)
      const firstKey = Object.keys(errorData)[0];
      if (firstKey && Array.isArray(errorData[firstKey])) {
        useErrorStore.getState().setError(errorData[firstKey][0]);
        return;
      }
      
      // Se tiver uma chave detail (comum no DRF)
      if (errorData.detail) {
        useErrorStore.getState().setError(errorData.detail);
        return;
      }
    }
    
    useErrorStore.getState().setError(defaultMessage);
  } catch {
    // Se a resposta não for JSON
    useErrorStore.getState().setError(defaultMessage);
  }
}

export function handleNetworkError(error: unknown, defaultMessage: string = "Falha de conexão.") {
  console.error("[Network Error]:", error);
  useErrorStore.getState().setError(defaultMessage);
}
