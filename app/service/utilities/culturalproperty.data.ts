import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';


export const emptyCulturalProperty: CulturalPropertyModel = {
    uuid: '',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    accessAndUseConditions: {
        accessConditions: [], reproductionConditions: [], technicalRequirements: ''
    },
    associatedDocumentation: {
        copiesExistenceAndLocation: '',
        originalsExistenceAndLocation: '',
        relatedDescriptionUnits: '',
        relatedPublicationsInformation: ''
    },
    culturalRecord: {
        backgroundTitle: '',
        conservationState: [],
        descriptionInstrument: [],
        descriptionLevel: 0,
        extremeDates: {
            end: new Date(Date.now()), start: new Date(Date.now())
        },
        geographicDescriptors: '',
        institutionalDescriptors: '',
        languages: [],
        letters: [],
        objectDescription: '',
        objectTitle: '',
        onomasticDescriptors: '',
        sectionTitle: '',
        subjectDescriptors: '',
        supports: [],
        valuation: 0,
        valueGrade: '',
        dimensions: {
            cubicMeters: 0,
            heightCms: 0,
            lengthCms: 0,
            squareMeters: 0,
            weightKg: 0,
            widthCms: 0
        },
        volumesQuantities: {
            books: 0,
            engravings: 0,
            file: 0,
            mapsPlansSketches: 0,
            negatives: 0,
            objects: 0,
            pages: 0,
            photos: 0,
            slides: 0
        }

    },
    deleted: false,
    descriptionControl: {
        descriptionDateTime: new Date(Date.now()),
        descriptionMadeBy: '',
        reviewDateTime: new Date(Date.now()),
        reviewedBy: ''
    },
    entryAndLocation: {
        auxiliaryInventory: false,
        declarationType: '',
        entryDate: new Date(Date.now()),
        entryMethod: '',
        genericClassification: '',
        heritageType: '',
        initialDescription: '',
        institutionType: '',
        inventoryNumber: '',
        objectLocation: {
            box: '',
            exhibitionRoom: '',
            fileFolder: '',
            floor: '',
            shelfDrawer: '',
            showcaseShelf: '',
            storage: ''
        },
        objectName: '',
        pieceInventory: false

    },
    notes: {
        notes: ''
    },
    producerAuthor: {
        betweenStreet1: '',
        betweenStreet2: '',
        district: '',
        institutionalHistory: '',
        locality: '',
        municipality: '',
        number: '',
        objectEntryHistory: '',
        producerAuthorNames: '',
        province: '',
        street: ''
    },
};
