import { api } from '@/context/AuthContext'

//Appuntamenti
export const getAppuntamenti = async () => {
  const response = await api.get(`/pazienti/appuntamenti`)
  return response.data
}

export const confermaAppuntamento = async (id: number) => {
  const response = await api.put(`/pazienti/appuntamenti/${id}/conferma`)
  return response.data
}

export const creaRichiestaAppuntamento = async (payload: {
  trattamento_id: number
  data_appuntamento: string
  ora_appuntamento: string
}) => {
  const response = await api.post(`/pazienti/creaAppuntamento`, payload)
  return response.data
}

export const getTrattamenti = async () => {
  const response = await api.get(`/pazienti/trattamenti`)
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
/* richiesta messaggi api.post(`/pazienti/creaMessaggi`,...)

  { trattamento_id, testo }
   
*/