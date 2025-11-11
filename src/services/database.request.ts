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

// Michele
// richiesta trattamenti api.get(`/pazienti/trattamenti`)
// richiesta appuntamenti api.get(`/pazienti/appuntamenti`)
/* richiesta appuntamenti api.post(`/pazienti/creaAppuntamento`, ...)

  { trattamento_id: dato , data_appuntamento: dato, ora_appuntamento: dato }

*/

// Daniele
// richiesta messaggi api.get(`/pazienti/messaggi`)
export const listMessaggiByPaziente = async () => {
  const response = await api.get(`/pazienti/messaggi`)
  return response.data
}

export const creaMessaggioPaziente = async (trattamento_id: number, testo: string) => {
  const payload = { trattamento_id, testo }
  const response = await api.post(`/pazienti/creaMessaggi`, payload)
  return response.data
}

  
   
