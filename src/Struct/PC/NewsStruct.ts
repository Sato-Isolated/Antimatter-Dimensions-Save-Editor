export interface AntimatterDimensionsStructNews {
    seen:              Seen;
    specialTickerData: SpecialTickerData;
    totalSeen:         number;
}

export interface Seen {
    a: number[];
    p: number[];
    l: number[];
}

export interface SpecialTickerData {
    uselessNewsClicks:  number;
    paperclips:         number;
    newsQueuePosition:  number;
    eiffelTowerChapter: number;
} 