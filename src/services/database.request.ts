import { api } from '@/context/AuthContext'

//Appuntamenti
export const getAppuntamenti = async () => {
  const response = await api.get(`/pazienti/appuntamenti`)
  return response.data
}

//Schede Esercizi
export const getSchedeEsercizi = async () => {
  const response = await api.get(`/pazienti/schede`)
  return response.data
}

export const getEsercizi = async (id: string) => {
  const response = await api.get(`/pazienti/schede/${id}`)
  return response.data
}