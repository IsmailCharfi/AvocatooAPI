import { HttpStatus } from "@nestjs/common";

export class HttpResponse {
    statusCode: HttpStatus
    message: string
    data: any

    constructor(data: any, status: HttpStatus, message: string) {
        this.statusCode = status;
        this.message = message;
        this.data = data;
    }
}

export class SuccessResponse extends HttpResponse{
    constructor(data: any, message: string) {
        super(data, HttpStatus.OK, message)
    }
}

export class CreatedResponse extends HttpResponse{
    constructor(data: any, message: string) {
        super(data, HttpStatus.CREATED, message)
    }
}

export abstract class AbstractController {

    async renderSuccessResponse<T>(data: Promise<T>, message: string = "success"): Promise<SuccessResponse> {
        return new SuccessResponse(await data, message)
    }

    async renderCreatedResponse<T>(data: Promise<T>, message: string = "created"): Promise<CreatedResponse> {
        return new CreatedResponse(data, message)
    }

    async render<T>(data: Promise<T>, status: HttpStatus = HttpStatus.OK, message: string = ""): Promise<HttpResponse> {
        return new HttpResponse(data, status, message);
    }
}