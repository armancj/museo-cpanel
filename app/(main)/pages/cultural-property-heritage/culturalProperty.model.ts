export interface CulturalPropertyModel {
    createdAt:               Date;
    deleted:                 boolean;
    producerAuthor:          ProducerAuthor;
    accessAndUseConditions:  AccessAndUseConditions;
    associatedDocumentation: AssociatedDocumentation;
    culturalRecord:          CulturalRecord;
    entryAndLocation:        EntryAndLocation;
    descriptionControl:      DescriptionControl;
    notes:                   Notes;
    updatedAt:               Date;
    uuid:                    string;
}

export interface AccessAndUseConditions {
    accessConditions:       string[];
    reproductionConditions: string[];
    technicalRequirements:  string;
}

export interface AssociatedDocumentation {
    copiesExistenceAndLocation:     string;
    originalsExistenceAndLocation:  string;
    relatedDescriptionUnits:        string;
    relatedPublicationsInformation: string;
}

export interface CulturalRecord {
    objectTitle:              string;
    objectDescription:        string;
    onomasticDescriptors:     string;
    geographicDescriptors:    string;
    institutionalDescriptors: string;
    subjectDescriptors:       string;
    extremeDates:             ExtremeDates;
    valueGrade:               string;
    descriptionLevel:         number;
    valuation:                number;
    volumesQuantities:        VolumesQuantities;
    dimensions:               Dimensions;
    languages:                string[];
    supports:                 string[];
    letters:                  string[];
    descriptionInstrument:    string[];
    conservationState:        string[];
    backgroundTitle:          string;
    sectionTitle:             string;
}

export interface Dimensions {
    heightCms:    number;
    widthCms:     number;
    lengthCms:    number;
    squareMeters: number;
    cubicMeters:  number;
    weightKg:     number;
}

export interface ExtremeDates {
    start: Date;
    end:   Date;
}

export interface VolumesQuantities {
    file:              number;
    pages:             number;
    books:             number;
    objects:           number;
    photos:            number;
    engravings:        number;
    slides:            number;
    negatives:         number;
    mapsPlansSketches: number;
}

export interface DescriptionControl {
    reviewDateTime: Date;
    reviewedBy: string;
    descriptionDateTime: Date;
    descriptionMadeBy: string;
}

export interface EntryAndLocation {
    auxiliaryInventory:    boolean;
    declarationType:       string;
    entryDate:             Date;
    entryMethod:           string;
    genericClassification: string;
    heritageType:          string;
    initialDescription:    string;
    institutionType:       string;
    inventoryNumber:       string;
    objectLocation:        ObjectLocation;
    objectName:            string;
    pieceInventory:        boolean;
}

export interface ObjectLocation {
    box:            string;
    exhibitionRoom: string;
    fileFolder:     string;
    floor:          string;
    shelfDrawer:    string;
    showcaseShelf:  string;
    storage:        string;
}

export interface Notes {
    notes: string;
}

export interface ProducerAuthor {
    betweenStreet1:       string;
    betweenStreet2:       string;
    district:             string;
    institutionalHistory: string;
    locality:             string;
    municipality:         string;
    number:               string;
    objectEntryHistory:   string;
    producerAuthorNames:  string;
    province:             string;
    street:               string;
}
