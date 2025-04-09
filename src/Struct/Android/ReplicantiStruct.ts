import { BankedInfinitiesClass } from './CommonStruct';

export interface Replicanti {
    amount:              BankedInfinitiesClass;
    chanceUpgrades:      number;
    galaxies:            number;
    galaxybuyer:         boolean;
    intervalUpgrades:    number;
    maxGalaxiesUpgrades: number;
    timer:               number;
    unl:                 boolean;
} 