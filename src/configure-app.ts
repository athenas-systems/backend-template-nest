import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function configureApp(app: NestFastifyApplication): void {
  const config = app.get(ConfigService);
  const corsOrigin = config.get<string>("CORS_ORIGIN", "http://localhost:5173");
  const origins = corsOrigin.split(",").map((origin) => origin.trim());
  app.enableCors({
    origin: origins.length === 1 ? origins[0] : origins,
    credentials: corsOrigin !== "*",
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Keel API")
    .setDescription("Personal finance API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);
}
