"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SqliteHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteHelper = void 0;
const common_1 = require("@nestjs/common");
const sqlite_1 = require("sqlite");
const sqlite3 = require("sqlite3");
let SqliteHelper = SqliteHelper_1 = class SqliteHelper {
    constructor() {
        this.logger = new common_1.Logger(SqliteHelper_1.name);
    }
    async connect(dbPath) {
        try {
            this.db = await (0, sqlite_1.open)({
                filename: dbPath,
                driver: sqlite3.Database,
            });
            this.logger.log(`Connected to SQLite database: ${dbPath}`);
        }
        catch (error) {
            this.logger.error(`Failed to connect to SQLite database: ${error.message}`);
            if (error instanceof Error) {
                this.logger.error(error.stack);
            }
            throw error;
        }
    }
    async runQuery(query, params = []) {
        try {
            const result = await this.db.run(query, params);
            if (result.changes === 0) {
                return [];
            }
            else {
                return result;
            }
        }
        catch (error) {
            this.logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }
    async getValues(tableName, columns = ['*'], whereClause) {
        try {
            const selectColumns = columns.join(', ');
            let query = `SELECT ${selectColumns} FROM ${tableName}`;
            const params = [];
            if (whereClause && Object.keys(whereClause).length > 0) {
                const conditions = Object.entries(whereClause).map(([key, value], index) => {
                    params.push(value);
                    return `${key} = ?`;
                });
                query += ` WHERE ${conditions.join(' AND ')}`;
            }
            const result = await this.db.all(query, params);
            return result;
        }
        catch (error) {
            this.logger.error(`Error getting values from ${tableName}: ${error.message}`);
            throw error;
        }
    }
    async getOne(query, params = []) {
        try {
            return await this.db.get(query, params);
        }
        catch (error) {
            this.logger.error(`Error fetching one row: ${error.message}`);
            throw error;
        }
    }
    async getAll(query, params = []) {
        try {
            const result = await this.db.all(query, params);
            return Array.isArray(result) ? result : [result];
        }
        catch (error) {
            this.logger.error(`Error fetching all rows: ${error.message}`);
            throw error;
        }
    }
    async close() {
        if (this.db) {
            await this.db.close();
            this.logger.log('SQLite database connection closed');
        }
    }
};
exports.SqliteHelper = SqliteHelper;
exports.SqliteHelper = SqliteHelper = SqliteHelper_1 = __decorate([
    (0, common_1.Injectable)()
], SqliteHelper);
//# sourceMappingURL=sqlite.helper.js.map