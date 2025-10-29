import { api } from '@/context/AuthContext'

//Places
export const postNewPlaces = async (placeData: {
  name: string;
  description: string;
  addressStreet: string;
  addressCity: string;
  addressZipCode: string;
  addressCountry: string;
  managementType: string;
}) => {
  const response = await api.post('/newPlace', placeData);
  return response.data;
}

export const getSchedeEsercizi = async () => {
  const response = await api.get(`/pazienti/schede`)
  return response.data
}

export const getEsercizi = async (id: string) => {
  const response = await api.get(`/pazienti/schede/${id}`)
  return response.data
}