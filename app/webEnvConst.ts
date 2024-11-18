export const WebEnvConst = {
    auth: {
        login: '/auth/login',
        recover: '/auth/recover',
        verifyCode: '/auth/verify-code',
        changePassword: '/auth/change-password'
    },
    user: {
        getAll: '/users/all?page=1&perPage=10',
        post: '/users',
        getOne: (uuid: string) => `/users/${uuid}`,
        changeActivate: (uuid: string) => `/users/${uuid}/change-activate`
    },
    province: {
        getAll: '/province',
        post: '/province',
        getOne: (uuid: string) => `/province/${uuid}`
    },
    country: {
        getAll: '/country',
        post: '/country',
        getOne: (uuid: string) => `/country/${uuid}`
    },
    municipality: {
        getAll: '/municipality',
        post: '/municipality',
        getOne: (uuid: string) => `/municipality/${uuid}`
    },
    culturalProperty:{
        getAll: '/cultural-heritage-property',
        post: '/cultural-heritage-property',
        getOne: (uuid: string) => `/cultural-heritage-property/${uuid}`
    },
    roles: {
        superAdmin: 'super Administrador',
        admin: 'Administrador',
        specialist: 'Especialista',
        technician: 'Técnico'
    }
};
