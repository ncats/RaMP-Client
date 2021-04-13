export interface Pathway {
    rampId?: string;
    pathwayRampId: string;
    pathwayName: string;
    pathwaysourceId: string;
    pathwaysource: string;
    pathwayCategory?: string;
    commonName?: string;
    pathwaySourceList?: Array<string>;
    pathwaySources?: string;
    isSelected?: boolean;
}
