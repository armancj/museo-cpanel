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
    categoryMuseum: {
        getAll: '/category-museum',
        post: '/category-museum',
        getOne: (uuid: string) => `/category-museum/${uuid}`
    },
    accessConditions: {
        getAll: '/nomenclator/access-conditions',
        post: '/nomenclator/access-conditions',
        getOne: (uuid: string) => `/nomenclator/access-conditions/${uuid}`
    },
    descriptionInstruments: {
        getAll: '/description-instruments',
        post: '/description-instruments',
        getOne: (uuid: string) => `/description-instruments/${uuid}`
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

    culturalPropertyDataEndpoints: (uuid: string) => ({
        entryAndLocationRecordUrl: `/entry-and-location-record/${uuid}`,
        producerAuthorRecordUrl: `/producer-author-record/${uuid}`,
        culturalRecordUrl: `/cultural-record/${uuid}`,
        accessAndUseConditionsUrl: `/access-and-use-conditions/${uuid}`,
        associatedDocumentationUrl: `/associated-documentation/${uuid}`,
        descriptionControlUrl: `/description-control/${uuid}`,
        culturalNotesUrl: `/cultural-notes/${uuid}`,
    }),

    roles: {
        superAdmin: 'super Administrador',
        admin: 'Administrador',
        specialist: 'Especialista',
        technician: 'Técnico'
    },
    institution:{
        getAll: '/institutions',
        post: '/institutions',
        getOne: (uuid: string) => `/institutions/${uuid}`,
    }
};
