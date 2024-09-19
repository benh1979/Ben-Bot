export declare class SqliteHelper {
    private db;
    private readonly logger;
    connect(dbPath: string): Promise<void>;
    runQuery(query: string, params?: any[]): Promise<any>;
    getValues(tableName: string, columns?: string[], whereClause?: {
        [key: string]: any;
    }): Promise<any[]>;
    getOne<T>(query: string, params?: any[]): Promise<T | null>;
    getAll<T>(query: string, params?: any[]): Promise<T[]>;
    close(): Promise<void>;
}
