import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducersModule } from './producers/producers.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CreateProducersTable1680012345678 } from 'migrations/1680012345678-CreateProducersTable';
import { Producer } from './producers/entities/producer.entity';
import { Crops } from './crops/entities/crop.entity';
import { ProducerCrop } from './producer-crops/entities/producer-crops.entity';
import { CropsModule } from './crops/crops.module';
import { ProducerCropsModule } from './producer-crops/producer-crops.module';
import { CreateCropsTable1729630423034 } from 'migrations/1729630423034-CreateCropsTable';
import { CreateProducerCropsTable1729630454979 } from 'migrations/1729630454979-CreateProducerCropsTable';

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
        entities: [Producer, Crops, ProducerCrop],
        synchronize: true,
        migrationsRun: true,
        migrations: [CreateProducersTable1680012345678, CreateCropsTable1729630423034, CreateProducerCropsTable1729630454979],
      }),
    }),
    CropsModule,
    ProducerCropsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
