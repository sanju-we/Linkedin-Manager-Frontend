const BASE = '/admin'
const ADMIN_AUTH = `${BASE}/auth`
const ADMIN_USER = `${BASE}/m`

export const ADMIN_ROUTES = {
  auth: {
    login: `${ADMIN_AUTH}/login`
  },

  user: {
    getAll: `${ADMIN_USER}/getAll`,
    getUser: (userId:string) => `${ADMIN_USER}/getUser/${userId}`
  }
}

