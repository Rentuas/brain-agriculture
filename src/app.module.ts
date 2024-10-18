import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducersModule } from './producers/producers.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CreateProducersTable1680012345678 } from 'migration/1680012345678-CreateProducersTable';
import { Producer } from './producers/entities/producer.entity';

@Module({
  imports: [
    ProducersModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.envConfig.typeormHost,
        port: configService.envConfig.typeormPort,
        database: configService.envConfig.typeormDatabase,
        username: configService.envConfig.typeormUsername,
        password: configService.envConfig.typeormPassword,
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [Producer],
        synchronize: false,
        migrationsRun: true,
        migrations: [
          CreateProducersTable1680012345678,
        ],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
