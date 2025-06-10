export enum UserRoles {
    employee = 'Técnico',
    administrator = 'Administrador',
    superAdmin = 'super Administrador',
    manager = 'Especialista',
}

export interface CulturalHeritageProperty {
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    producerAuthor?: ProducerAuthor;
    accessAndUseConditions?: AccessAndUseConditions;
    associatedDocumentation?: AssociatedDocumentation;
    culturalRecord: CulturalRecord;
    notes?: Notes;
    entryAndLocation?: EntryAndLocation;
    descriptionControl?: DescriptionControl;
}

export interface AccessAndUseConditions {
    accessConditions: AccessConditions;
    reproductionConditions: AccessConditions;
    technicalRequirements: TechnicalRequirements;
}

export interface AccessConditions {
    value: string[];
    modifiedBy: string;
    comment: string;
    status: Status;
    history: AccessConditionsHistory[];
}

export interface AccessConditionsHistory {
    previousValue: string[];
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: Status;
}

export enum Status {
    Pending = "Pending",
    ToReview = "To Review",
    Reviewed = "Reviewed",
    HasIssue = "Has Issue"
}

export interface TechnicalRequirements {
    value: string;
    modifiedBy: string;
    comment: string;
    status: Status;
    history: TechnicalRequirementsHistory[];
}

export interface TechnicalRequirementsHistory {
    previousValue: string;
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: Status;
}

export interface AssociatedDocumentation {
    copiesExistenceAndLocation: TechnicalRequirements;
    originalsExistenceAndLocation: TechnicalRequirements;
    relatedDescriptionUnits: TechnicalRequirements;
    relatedPublicationsInformation: TechnicalRequirements;
}

export interface CulturalRecord {
    objectTitle: TechnicalRequirements;
    objectDescription: TechnicalRequirements;
    onomasticDescriptors: TechnicalRequirements;
    geographicDescriptors: TechnicalRequirements;
    institutionalDescriptors: TechnicalRequirements;
    subjectDescriptors: TechnicalRequirements;
    extremeDates: ExtremeDates;
    valueGrade: TechnicalRequirements;
    descriptionLevel: DescriptionLevel;
    valuation: DescriptionLevel;
    volumesQuantities: VolumesQuantities;
    dimensions: Dimensions;
    languages: AccessConditions;
    supports: AccessConditions;
    letters: AccessConditions;
    descriptionInstrument: AccessConditions;
    conservationState: AccessConditions;
    backgroundTitle: TechnicalRequirements;
    sectionTitle: TechnicalRequirements;
}

export interface DescriptionLevel {
    value: number;
    modifiedBy: string;
    comment: string;
    status: Status;
    history: DescriptionLevelHistory[];
}

export interface DescriptionLevelHistory {
    previousValue: number;
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: Status;
}

export interface Dimensions {
    value: DimensionsValue;
    modifiedBy: string;
    comment: string;
    status: string;
    history: DimensionsHistory[];
}

export interface DimensionsHistory {
    previousValue: DimensionsValue;
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: string;
}

export interface DimensionsValue {
    heightCms: number;
    widthCms: number;
    lengthCms: number;
    weightKg: number;
    _id: string;
}

export interface ExtremeDates {
    value: ExtremeDatesValue;
    modifiedBy: string;
    comment: string;
    status: Status;
    history: ExtremeDatesHistory[];
}

export interface ExtremeDatesHistory {
    previousValue: ExtremeDatesValue;
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: Status;
}

export interface ExtremeDatesValue {
    start: Date;
    end: Date;
    _id: string;
}

export interface VolumesQuantities {
    value: VolumesQuantitiesValue;
    modifiedBy: string;
    comment: string;
    status: string;
    history: VolumesQuantitiesHistory[];
}

export interface VolumesQuantitiesHistory {
    previousValue: VolumesQuantitiesValue;
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: string;
}

export interface VolumesQuantitiesValue {
    file: number;
    pages: number;
    books: number;
    objects: number;
    photos: number;
    engravings: number;
    slides: number;
    negatives: number;
    mapsPlansSketches: number;
    _id: string;
}

export interface DescriptionControl {
    descriptionMadeBy: TechnicalRequirements;
    descriptionDateTime: TechnicalRequirements;
    reviewedBy: TechnicalRequirements;
    reviewDateTime: TechnicalRequirements;
}

export interface EntryAndLocation {
    auxiliaryInventory: Inventory;
    declarationType: TechnicalRequirements;
    entryDate: TechnicalRequirements;
    entryMethod: TechnicalRequirements;
    genericClassification: TechnicalRequirements;
    heritageType: TechnicalRequirements;
    initialDescription: TechnicalRequirements;
    institutionType: TechnicalRequirements;
    inventoryNumber: TechnicalRequirements;
    pieceInventory: Inventory;
    objectName: TechnicalRequirements;
    objectLocation: ObjectLocation;
}

export interface Inventory {
    value: boolean;
    modifiedBy: string;
    comment: string;
    status: Status;
    history: AuxiliaryInventoryHistory[];
}

export interface AuxiliaryInventoryHistory {
    previousValue: boolean;
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: Status;
}

export interface ObjectLocation {
    comment: string;
    status: string;
    history: ObjectLocationHistory[];
    value?: ObjectLocationValue;
    modifiedBy?: string;
}

export interface ObjectLocationHistory {
    previousValue: ObjectLocationValue;
    modifiedBy: string;
    modifiedAt: Date;
    comment: string;
    status: string;
}

export interface ObjectLocationValue {
    floor: string;
    exhibitionRoom: string;
    storage: string;
    showcaseShelf: string;
    shelfDrawer: string;
    box: string;
    fileFolder: string;
    _id: string;
}

export interface Notes {
    notes: TechnicalRequirements;
}

export interface ProducerAuthor {
    betweenStreet1: TechnicalRequirements;
    betweenStreet2: TechnicalRequirements;
    district: TechnicalRequirements;
    institutionalHistory: TechnicalRequirements;
    locality: TechnicalRequirements;
    municipality: TechnicalRequirements;
    number: TechnicalRequirements;
    objectEntryHistory: TechnicalRequirements;
    producerAuthorNames: TechnicalRequirements;
    province: TechnicalRequirements;
    street: TechnicalRequirements;
}

export type StatusObject = {
    status: 'Pending' | 'To Review' | 'Reviewed' | 'Has Issue';
};

export const emptyCulturalHeritageProperty: CulturalHeritageProperty = {
    createdAt: new Date(),
    deleted: false,
    updatedAt: new Date(),
    uuid: '',
    culturalRecord: {
        objectTitle: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        objectDescription: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        onomasticDescriptors: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        geographicDescriptors: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        institutionalDescriptors: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        subjectDescriptors: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        extremeDates: {
            value: { start: new Date(), end: new Date(), _id: '' },
            modifiedBy: '',
            comment: '',
            status: Status.Pending,
            history: []
        },
        valueGrade: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        descriptionLevel: { value: 0, modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        valuation: { value: 0, modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        volumesQuantities: {
            value: {
                file: 0,
                pages: 0,
                books: 0,
                objects: 0,
                photos: 0,
                engravings: 0,
                slides: 0,
                negatives: 0,
                mapsPlansSketches: 0,
                _id: ''
            },
            modifiedBy: '',
            comment: '',
            status: Status.Pending,
            history: []
        },
        dimensions: {
            value: {
                heightCms: 0,
                widthCms: 0,
                lengthCms: 0,
                weightKg: 0,
                _id: ''
            },
            modifiedBy: '',
            comment: '',
            status: Status.Pending,
            history: []
        },
        languages: { value: [], modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        supports: { value: [], modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        letters: { value: [], modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        descriptionInstrument: { value: [], modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        conservationState: { value: [], modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        backgroundTitle: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
        sectionTitle: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] }
    }
};
