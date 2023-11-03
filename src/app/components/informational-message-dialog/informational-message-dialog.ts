import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'informational-message-dialog',
    templateUrl: './informational-message-dialog.html',
    styleUrls: ['./informational-message-dialog.scss']
})

export class InformationMessageDialog { 
    constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string, isSuccesfull: boolean}, private dialogRef: MatDialogRef<InformationMessageDialog>){}

    onOK(){
        // the value 'true' send on close dialog will confirm that 
        //the parent can do something after the dialog is closed
        this.dialogRef.close(true);
    }
}