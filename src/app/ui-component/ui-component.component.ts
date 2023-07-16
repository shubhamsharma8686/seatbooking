import { AfterViewInit, Component, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environment';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
}
@Component({
  selector: 'app-ui-component',
  templateUrl: './ui-component.component.html',
  styleUrls: ['./ui-component.component.css']
})
export class UiComponentComponent implements AfterViewInit{
  
  private API_URL= environment.API_URL;
id:string;
name:string;
email:string;
role:string;
 
selectedRow=[];
  constructor(private http: HttpClient,
    public dialog: MatDialog
    ) 
  {}

  openDialog(action:any,datas): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {id: datas.id, name: datas.name, email: datas.email, role: datas.role, action:action},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.updateRowData(result.data);
      }
      else if(result.event == 'Delete'){
        this.removeData(result.data.id);
      }
    });
  }
  //dataSource: MatTableDataSource<UserInterface>;
  dataToDisplay:any;
  displayedColumns: string[] = ['select', 'name', 'email', 'role', 'action'];
  dataSource:any;
  selection = new SelectionModel<UserInterface>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit() {
    this.paginator.pageSize=10;
    this.paginator._displayedPageSizeOptions.push(10);
    this.http.
      get(this.API_URL)
      .subscribe((res:UserInterface[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataToDisplay = [...res];
        this.dataSource.paginator = this.paginator;
      });
  }
  
 /** Whether the number of selected elements matches the total number of rows. */
 isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource ? this.dataSource.data.length : null;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  var last = this.dataSource.data.length;
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }
  else {
    if(this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize){
        last = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } 
    else{
      last = this.dataSource.data.length;
    }
    for (let i = (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize); i < last; i++){
      this.selection.select(this.dataSource.data[i]);
    }
  }

  // //this.dataSource = new MatTableDataSource(this.dataSource);
  // //this.dataSource.data=this.paginator;
  // for (let index = (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize); index < this.dataSource.data.length; index++) {
  //   this.selection.select(this.dataSource.data[index]);
  // }
  

  // //this.selection.select(...this.dataSource.data);
  
}

 /** The label for the checkbox on the passed row */
 checkboxLabel(row?: UserInterface): string {
  const doc = document.getElementsByClassName('mat-mdc-checkbox-checked');
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  this.selection.isSelected(row) ? this.selectedRow.push(row.id) : this.selectedRow=this.selectedRow.filter(x=>x!=row.id);
  // /this.selectedRow.find(x=>x==row.id) ? this.selectedRow=this.selectedRow.filter(x=>x!=row.id) : this.selectedRow.push(row.id);
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}
  
  // appply filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  updateRowData(row_obj:any){
    this.dataToDisplay = this.dataToDisplay.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.name = row_obj.name;
        value.email = row_obj.email;
        value.role = row_obj.role;
      }
      return true;
    });
  }
  removeData(index) {
      this.dataToDisplay = this.dataToDisplay.filter(item => {
        var keys = Object.keys(item);
        for(let key of keys){
            if(item.id == index)
                return false;
        }
        return true;
    });
    this.dataSource = new MatTableDataSource(this.dataToDisplay);
    this.dataSource.paginator=this.paginator;
  }

  clearTable() {
    const numSelected = this.selection.selected.length
    if(numSelected >= 1){
      this.dataToDisplay = this.dataToDisplay.filter((value,key)=>{
        for(let trace of this.selection.selected){
          if(value.id == trace.id){
            return false;
          }
        }
        // if(value.id == row_obj.id){
        //   value.name = row_obj.name;
        //   value.email = row_obj.email;
        //   value.role = row_obj.role;
        // }
        return true;
      });
      this.dataSource = new MatTableDataSource(this.dataToDisplay);
      this.dataSource.paginator=this.paginator;
    }
    else{
      alert('select atleast one row')
    }
    //this.dataSource.selected = [];
  }
  
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  action:string;
  local_data:any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserInterface,
  ) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }
}
