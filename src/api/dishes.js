export async function fetchDishes(signal) {
  const response = await fetch('/menu-data.json', { signal })
  if (!response.ok) throw new Error('We could not load the menu right now.')
  return response.json()
}

export const categories = ['All', 'Ethiopian', 'Pizza', 'Burgers', 'Drinks']
