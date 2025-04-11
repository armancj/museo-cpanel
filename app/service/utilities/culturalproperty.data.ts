import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';


export const emptyCulturalProperty: CulturalPropertyModel = {
    uuid: '',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    accessAndUseConditions: {
        accessConditions: { value: [], status: { status: 'Pending' }, modifiedBy: '', history: [] },
        reproductionConditions: { value: [], status: { status: 'Pending' }, modifiedBy: '', history: [] },
        technicalRequirements: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
    },
    associatedDocumentation: {
        copiesExistenceAndLocation: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        originalsExistenceAndLocation: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        relatedDescriptionUnits: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        relatedPublicationsInformation: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
    },
    culturalRecord: {
        objectTitle: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        objectDescription: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        valueGrade: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        descriptionLevel: { value: 0, status: { status: 'Pending' }, modifiedBy: '', history: [] },
        volumesQuantities: { value: {}, status: { status: 'Pending' }, modifiedBy: '', history: [] },
        dimensions: {
            value: {
                cubicMeters: 0,
                heightCms: 0,
                lengthCms: 0,
                squareMeters: 0,
                weightKg: 0,
                widthCms: 0,
            },
            status: { status: 'Pending' },
            modifiedBy: '',
            history: [],
        },
        languages: { value: [], status: { status: 'Pending' }, modifiedBy: '', history: [] },
        supports: { value: [], status: { status: 'Pending' }, modifiedBy: '', history: [] },
        letters: { value: [], status: { status: 'Pending' }, modifiedBy: '', history: [] },
        descriptionInstrument: { value: [], status: { status: 'Pending' }, modifiedBy: '', history: [] },
        conservationState: { value: [], status: { status: 'Pending' }, modifiedBy: '', history: [] },
        extremeDates: {
            value: { start: new Date(), end: new Date() },
            status: { status: 'Pending' },
            modifiedBy: '',
            history: [],
        },
    },
    entryAndLocation: {
        heritageType: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        declarationType: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        auxiliaryInventory: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: false },
        entryDate: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: new Date(Date.now()) },
        entryMethod: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: ''  },
        genericClassification: {
            comment: '',
            history: [],
            modifiedBy: '',
            status: { status: 'Pending' },
            value: '',
        },
        initialDescription: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: '' },
        institutionType: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: '' },
        inventoryNumber: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: '' },
        objectLocation: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: {
                box: '',
                exhibitionRoom: '',
                fileFolder: '',
                floor: '',
                shelfDrawer: '',
                showcaseShelf: '',
                storage: ''
            } },
        objectName: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: '' },
        pieceInventory: { comment: '', history: [], modifiedBy: '', status: { status: 'Pending' }, value: false },
    },
    notes: {
        notes: {
            value: '',
            status: { status: 'Pending' },
            comment: '',
            modifiedBy: '',
            history: [],
        },
    },
    producerAuthor: {
        producerAuthorNames: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        street: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        number: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        district: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        locality: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        municipality: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        province: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        betweenStreet1: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        betweenStreet2: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        institutionalHistory: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        objectEntryHistory: { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
    },
    descriptionControl: {
        descriptionDateTime:  { value: new Date(Date.now()), status: { status: 'Pending' }, modifiedBy: '', history: [] },
        descriptionMadeBy:  { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] },
        reviewDateTime:  { value: new Date(Date.now()), status: { status: 'Pending' }, modifiedBy: '', history: [] },
        reviewedBy:  { value: '', status: { status: 'Pending' }, modifiedBy: '', history: [] }

    },

    deleted: false
};
