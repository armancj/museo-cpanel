export interface CulturalPropertyModel {
    createdAt: Date;
    deleted: boolean;
    producerAuthor: ProducerAuthor;
    accessAndUseConditions: AccessAndUseConditions;
    associatedDocumentation: AssociatedDocumentation;
    culturalRecord: CulturalRecord;
    entryAndLocation: EntryAndLocation;
    descriptionControl: DescriptionControl;
    notes: Notes;
    updatedAt: Date;
    uuid: string;
}

export interface AccessAndUseConditions {
    accessConditions: FieldMetadata<string[]>;
    reproductionConditions: FieldMetadata<string[]>;
    technicalRequirements: FieldMetadata<string>;
}

export interface AssociatedDocumentation {
    copiesExistenceAndLocation: FieldMetadata<string>;
    originalsExistenceAndLocation?: FieldMetadata<string>;
    relatedDescriptionUnits?: FieldMetadata<string>;
    relatedPublicationsInformation?: FieldMetadata<string>;
}

export interface CulturalRecord {
    objectTitle: FieldMetadata<string>;
    objectDescription: FieldMetadata<string>;
    onomasticDescriptors?: FieldMetadata<string>;
    geographicDescriptors?: FieldMetadata<string>;
    institutionalDescriptors?: FieldMetadata<string>;
    subjectDescriptors?: FieldMetadata<string>;
    extremeDates?: FieldMetadata<ExtremeDates>;
    valueGrade: FieldMetadata<string>;
    descriptionLevel: FieldMetadata<number>;
    valuation?: FieldMetadata<number>;
    volumesQuantities: FieldMetadata<VolumesQuantities>;
    dimensions: FieldMetadata<Dimensions>;
    languages: FieldMetadata<string[]>;
    supports: FieldMetadata<string[]>;
    letters: FieldMetadata<string[]>;
    descriptionInstrument: FieldMetadata<string[]>;
    conservationState: FieldMetadata<string[]>;
    backgroundTitle?: FieldMetadata<string>;
    sectionTitle?: FieldMetadata<string>;
}

export interface Dimensions {
    heightCms: number;
    widthCms: number;
    lengthCms: number;
    squareMeters: number;
    cubicMeters: number;
    weightKg: number;
}

export interface ExtremeDates {
    start: Date;
    end: Date;
}

export interface VolumesQuantities {
    file?: number;
    pages?: number;
    books?: number;
    objects?: number;
    photos?: number;
    engravings?: number;
    slides?: number;
    negatives?: number;
    mapsPlansSketches?: number;
}

export interface DescriptionControl {
    descriptionMadeBy: FieldMetadata<string>;
    descriptionDateTime: FieldMetadata<Date>;
    reviewedBy: FieldMetadata<string>;
    reviewDateTime: FieldMetadata<Date>;
}

export interface EntryAndLocation {
    heritageType: FieldMetadata<string>;
    declarationType: FieldMetadata<string>;
    inventoryNumber: FieldMetadata<string>;
    genericClassification: FieldMetadata<string>;
    pieceInventory: FieldMetadata<boolean>;
    auxiliaryInventory: FieldMetadata<boolean>;
    objectName: FieldMetadata<string>;
    initialDescription: FieldMetadata<string>;
    entryMethod: FieldMetadata<string>;
    entryDate: FieldMetadata<Date>;
    objectLocation: FieldMetadata<ObjectLocation>;
    institutionType: FieldMetadata<string>;
}

export interface ObjectLocation {
    box: string;
    exhibitionRoom: string;
    fileFolder: string;
    floor: string;
    shelfDrawer: string;
    showcaseShelf: string;
    storage: string;
}

export interface Notes {
    notes: FieldMetadata<string>;
}

export interface ProducerAuthor {
    producerAuthorNames: FieldMetadata<string>;
    street: FieldMetadata<string>;
    number: FieldMetadata<string>;
    betweenStreet1: FieldMetadata<string>;
    betweenStreet2: FieldMetadata<string>;
    district: FieldMetadata<string>;
    locality: FieldMetadata<string>;
    municipality: FieldMetadata<string>;
    province: FieldMetadata<string>;
    institutionalHistory?: FieldMetadata<string>;
    objectEntryHistory?: FieldMetadata<string>;
}


export interface FieldMetadata<T> {
    value: T;
    status: StatusObject;
    comment?: string;
    modifiedBy: string;
    history: Array<HistoryItem<T>>;
}

export type StatusObject = {
    status: 'Pending' | 'To Review' | 'Reviewed' | 'Has Issue';
};

export interface HistoryItem<T> {
    modifiedBy: string;
    previousValue: T;
    modifiedAt: Date;
    comment?: string;
    status: StatusObject;
}
