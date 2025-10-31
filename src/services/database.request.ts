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
export const createSessione = async (sessionData: {
  fisioterapista_id: number;
  scheda_id: number;
}) => {
  const response = await api.post(`/pazienti/sessioni`, sessionData)
  
  return response.data
}

export const listSessioniByCliente = async () => {
  const response = await api.get(`/pazienti/sessioni/lista`)

  return response.data
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