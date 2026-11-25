import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

interface ErrorResponse {
  status: number;
  message: string;
  code: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function messageFrom(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "string") return value;
  return "Unexpected error";
}

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const rawMessage = isRecord(response) ? response.message : response;
    const message =
      status >= 500 ? "Internal server error" : messageFrom(rawMessage);
    const code =
      isRecord(response) && typeof response.code === "string"
        ? response.code
        : `http_${status}`;
    const body: ErrorResponse = { status, message, code };

    this.adapterHost.httpAdapter.reply(http.getResponse(), body, status);
  }
}
