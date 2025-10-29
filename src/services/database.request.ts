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
  const response = await api.post('/places/newPlace', placeData);
  return response.data;
}

export const getPlace = async () => {
  const response = await api.get(`/places/`)
  return response.data
}