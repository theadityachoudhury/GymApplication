import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DatabaseService } from './services/database.service';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import passwordRoutes from "./routes/password.route"
import profileRoutes from './routes/profile.routes';
import imagesRoutes from './routes/image.routes';
import certificatesRoutes from './routes/certificate.routes';
import { requestLogger } from './middlewares/logger.middleware';
import { getConfig } from './config/config';
import { handleError } from './handlers/error.handler';
import logger from './config/logger';

export class App {
    private app: Express;
    private dbService: DatabaseService;

    constructor() {
        this.app = express();
        this.dbService = DatabaseService.getInstance();
        this.configureMiddleware();
        this.setupRoutes();
        this.configureErrorHandling();
    }

    private configureMiddleware(): void {
        // Security middleware
        this.app.use(helmet());
        this.app.use(cors());

        // Request parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Custom request logging
        this.app.use(requestLogger);
    }

    private setupRoutes(): void {
        // Health check endpoint
        this.app.get('/health', async (req, res) => {
            try {
                const dbHealth = await this.dbService.checkHealth();
                res.status(200).json({
                    service: getConfig().SERVICE_NAME,
                    status: 'ok',
                    database: dbHealth
                });
            } catch (error) {
                res.status(500).json({
                    service: getConfig().SERVICE_NAME,
                    status: 'error',
                    message: 'Health check failed'
                });
            }
        });

        // Auth routes
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/user', userRoutes);
        this.app.use('/api/profile', profileRoutes);
        this.app.use("/api/password", passwordRoutes)
        this.app.use("/api/images", imagesRoutes)
        this.app.use("/api/certificates",certificatesRoutes)


        // Fallback for undefined routes
        this.app.all('*', (req, res) => {
            res.status(404).json({
                status: 'error',
                message: `Can't find ${req.originalUrl} on this server!`
            });
        });
    }

    private configureErrorHandling(): void {
        // Error handling middleware
        this.app.use(handleError);
    }

    public async start(port: number): Promise<void> {
        try {
            // Connect to MongoDB
            await this.dbService.connect();

            // Start server
            this.app.listen(port, () => {
                logger.info(`Auth service started`, {
                    port,
                    environment: getConfig().NODE_ENV,
                    serviceName: getConfig().SERVICE_NAME
                });
            });
        } catch (error) {
            logger.error('Failed to start auth service', {
                error: error instanceof Error ? error.message : String(error)
            });
            process.exit(1);
        }
    }

    public getApp(): Express {
        return this.app;
    }
}