export interface Timestudy {
    theorem:        string;
    maxTheorem:     string;
    amBought:       number;
    ipBought:       number;
    epBought:       number;
    studies:        any[];
    shopMinimized:  boolean;
    preferredPaths: Array<number[] | number>;
    presets:        Preset[];
}

export interface Preset {
    name:    string;
    studies: string;
} 