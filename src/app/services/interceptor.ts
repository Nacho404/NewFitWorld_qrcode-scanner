import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { TokenService } from "./token.service";
import { MatDialog } from "@angular/material/dialog";

export interface GenericServerError {
    errorMessage: string,
    statusCode: number
}

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(private tokenService: TokenService, private dialog: MatDialog) {}


    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenService.getTokenValue();

        return next.handle(httpRequest.clone({setHeaders: {"Authorization": "Bearer " + token}, withCredentials: true})).pipe(
            catchError(this.handleError)
            
            // The line below can be used to retry the request until it will be succesfully
            // catchError((err, caught) => caught)
        );
    }

    handleError(errorRecieved: HttpErrorResponse){
        let errorMessage: string = '';

        if (errorRecieved.status === 0) {
            errorMessage = `Conexiunea la server-ul aplicației nu a putut fi stabilită! Status eroare: ${errorRecieved.status}`;
        } else {
            let errorsList = '';

            const errorsObject = errorRecieved.error.errors;
            for (const propertyName in errorsObject) {
                if (errorsObject.hasOwnProperty(propertyName)) {
                    const propertyValue = errorsObject[propertyName];
                    for(const value of propertyValue) {
                        errorsList += `*${value}*, `;
                    }
                }
            }
            
            errorMessage = `Error title: *${errorRecieved.error.title}*. Status code: *${errorRecieved.status}*. \n 
                Errors: ${errorsList} `;
        }
        return throwError(errorMessage);
    }
}