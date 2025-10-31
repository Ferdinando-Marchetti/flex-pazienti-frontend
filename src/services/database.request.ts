import { api } from '@/context/AuthContext'

export const getSchedeEsercizi = async () => {
  const response = await api.get(`/pazienti/schede`)
  return response.data
}

export const getEsercizi = async (id: string) => {
  const response = await api.get(`/pazienti/schede/${id}`)
  console.log(response.data)
  return response.data
}

//Sessione
export const createSessione = async (data: {
  id: number
  fisioterapista_id: number
  scheda_id: number
}) => {
  return api.post(`/pazienti/sessioni`, data)
}

export const listSessioniByCliente = async (id: number) => {
  return api.post(`/pazienti/sessioni/lista`, { id })
}

export const getSessioneById = async (id: string | number) => {
  return api.get(`/pazienti/sessioni/${id}`)
}

export const saveSondaggio = async (id: number, sondaggio: any) => {
  return api.put(`/pazienti/sessioni/${id}/sondaggio`, { sondaggio })
}

export const updateEsercizioSessione = async (
  id: number,
  esercizio_id: number,
  payload: {
    ripetizioni_effettive?: number
    serie_effettive?: number
    note?: string
  }
) => {
  return api.put(`/pazienti/sessioni/${id}/esercizio`, {
    esercizio_id,
    ...payload,
  })
}