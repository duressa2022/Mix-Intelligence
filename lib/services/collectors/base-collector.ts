/**
 * Base definition for Data Collectors
 * 
 * Collectors are responsible for fetching data from external sources
 * (APIs, Files, Satellites) and normalizing it for the system.
 */

export interface CollectionResult<T> {
    success: boolean;
    data?: T[];
    errors?: string[];
    source: string;
    timestamp: Date;
}

export abstract class BaseCollector<T> {
    protected abstract name: string;
    protected abstract sourceType: 'weather' | 'satellite' | 'socioeconomic' | 'other';

    /**
     * Run the collection process
     * @param regionId Optional region ID to filter collection
     */
    abstract collect(regionId?: number): Promise<CollectionResult<T>>;

    /**
     * Validate the collected data
     */
    protected validate(data: any): boolean {
        // Basic validation implementation
        return data !== null && data !== undefined;
    }

    protected handleError(error: unknown): string {
        if (error instanceof Error) return error.message;
        return String(error);
    }
}
