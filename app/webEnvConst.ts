export const WebEnvConst = {
    auth: {
        login: '/auth/login',
        recover: '/auth/recover',
        verifyCode: '/auth/verify-code',
        changePassword: '/auth/change-password'
    },
    user:{
        getAll: '/users/all?page=1&perPage=10',
        post: '/users',
        getOne: (uuid: string) => `/users/${uuid}`,
        changeActivate: (uuid: string) => `/users/${uuid}/change-activate`
    },
    province: '/province',
    country: '/country',
    municipality: '/municipality',
}
