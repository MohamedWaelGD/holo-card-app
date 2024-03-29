export interface CardDetails {
    imagePath: string;
    shadowGradient: Gradient[];
    holoGradient: Gradient[];
}

interface Gradient {
    color: string;
    position: string;
}