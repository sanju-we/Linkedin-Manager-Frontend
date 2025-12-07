const BASE = '/user'
const USER_AUTH = `${BASE}/auth`
const USER_PROFILE = `${BASE}/profile`

export const USER_ROUTES = {
  auth: {
    login: `${USER_AUTH}/login`
  },
  profile: {
    profile: `${USER_PROFILE}/getProfile`,
    updateCount: `${USER_PROFILE}/updateCount`,
    uploadImage: `${USER_PROFILE}/uploadImage`
  }
}
