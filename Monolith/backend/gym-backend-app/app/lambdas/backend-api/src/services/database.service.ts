import { MONGODB_URI } from "@/config/constant";
import mongoose from "mongoose";
import { logger } from "./logger.service";


export class DatabaseService {
    private static instance: DatabaseService;
    private isConnected = false

    private constructor() { }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }


    async connect(): Promise<void> {
        if (this.isConnected) {
            return
        }

        try {
            const mongoUri = MONGODB_URI;

            if (!mongoUri) {
                throw new Error('MONGODB_URI environment variable is not defined');
            }

            mongoose.set('strictQuery', false)

            await mongoose.connect(mongoUri)

            this.isConnected = true
            logger.info('Connected to MongoDB')
        } catch (error) {
            logger.error('Failed to connect to MongoDB:', error as Error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            logger.info('Disconnected from MongoDB');
        } catch (error) {
            logger.error('Failed to disconnect from MongoDB:', error as Error);
            throw error;
        }
    }
}