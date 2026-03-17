import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nevo/config';
import { logger } from '@nevo/logger';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const globalPrefix = 'v1/api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );

    // Enable CORS using configuration service
    app.enableCors({
        origin: configService.corsOrigins,
        credentials: true,
    });

    // Use global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Get port from configuration
    const port = configService.port;
    await app.listen(port);

    logger.info(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    logger.info(`🌍 Environment: ${configService.nodeEnv}`);
    logger.info(`🔗 CORS origins: ${configService.corsOrigins.join(', ')}`);

    if (configService.debugMode) {
        logger.info('🐛 Debug mode enabled');
    }
}

bootstrap();
