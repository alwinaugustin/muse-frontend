import { HttpResponseBase } from '@angular/common/http';

export interface JsendResponse extends HttpResponseBase {
    data: any;
    message: string;
    status: number;
}
