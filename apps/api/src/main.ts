/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from './config/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const globalPrefix = 'v1/api';
    app.setGlobalPrefix(globalPrefix);

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

    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`🌍 Environment: ${configService.nodeEnv}`);
    Logger.log(`🔗 CORS origins: ${configService.corsOrigins.join(', ')}`);

    if (configService.debugMode) {
        Logger.log('🐛 Debug mode enabled');
    }
}

bootstrap();
