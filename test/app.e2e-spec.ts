import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import request from "supertest";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/configure-app.js";

describe("AppController (e2e)", () => {
  let app: INestApplication<NestFastifyApplication>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    configureApp(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it("serves the OpenAPI UI at /docs", () => {
    return request(app.getHttpServer()).get("/docs").expect(200);
  });

  it("returns the shared error shape for unknown routes", async () => {
    const response = await request(app.getHttpServer())
      .get("/missing-route")
      .expect(404);

    expect(response.body).toMatchObject({
      status: 404,
      message: "Cannot GET /missing-route",
      code: "http_404",
    });
  });

  it("allows the configured local frontend origin", () => {
    return request(app.getHttpServer())
      .get("/")
      .set("Origin", "http://localhost:5173")
      .expect("access-control-allow-origin", "http://localhost:5173")
      .expect(200);
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });

  afterEach(async () => {
    await app.close();
  });
});
