import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service.js";

@ApiTags("meta")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Get the API welcome message" })
  @ApiOkResponse({ description: "Welcome message" })
  getHello(): string {
    return this.appService.getHello();
  }
}
