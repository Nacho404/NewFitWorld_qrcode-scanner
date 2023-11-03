import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ResponseService {
    manageErrorResponse(err: any): string {
        let startErrTextIndex: number =  err.error.indexOf('<') + 1;
        let endErrTextIndex: number =  err.error.indexOf('>');
        let errorMessage = err.error.substring(startErrTextIndex, endErrTextIndex);

        return errorMessage;
    }
}