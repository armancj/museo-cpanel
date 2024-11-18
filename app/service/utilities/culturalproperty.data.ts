import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { undefined } from 'zod';



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
        dimensions: undefined,
        extremeDates: undefined,
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
        volumesQuantities: {

        }

    },
    deleted: false,
    descriptionControl: {
        descriptionDateTime: new Date(Date.now()),
        descriptionMadeBy: '',
        reviewDateTime: new Date(Date.now()),
        reviewedBy: ''
    },
    entryAndLocation: undefined,
    notes: undefined,
    producerAuthor: undefined,

};
