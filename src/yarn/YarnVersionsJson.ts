/**
 * Types for response from yarn version endpoint.
 */
export type YarnVersionJson = {
    gameVersion: string;
    separator: string;
    build: number;
    maven: string;
    version: string;
    stable: boolean;
};
export type YarnVersionsJson = YarnVersionJson[];
