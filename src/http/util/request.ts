export const jsonRequest = (body: object, options = {}) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
  ...options,
})
