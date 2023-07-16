import { Component } from '@angular/core';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css']
})
export class SeatBookingComponent {
  seat:any;
  counts=10;
  seaTArr=[];
  coachTotalSeats=90;
  newObject={};
  rows=12;
  columns=7;
  booked=0;
  unbooked=7;
  totalBooked:any;
  ngOnInit() {
    this.totalBooked=0;
    const element: HTMLDivElement = document.querySelector("div.get-seat");
    for(var i=0;i<this.rows;i++){
      this.newObject={};
      this.newObject["seats"]={};
      this.newObject["booked"]=this.booked;
      this.newObject["unbooked"]=this.unbooked;
      for(var j=0;j<this.columns;j++){
        if(this.counts==this.coachTotalSeats){
          break;
        }
        this.newObject["seats"][this.counts] = {
          name: "names" + (this.counts),
          color: 'black',
          status: true,
          RowId:i
        };
        this.counts++;
      }
      this.seaTArr.push(this.newObject);
    }
    console.log(this.seaTArr);
  }
  onClickSubmit(data) {
    this.seat='';
    if(data.seat > 7){
      alert('seat no cannot greater than 7');
      return;
    }
    else if(data.seat == undefined || data.seat == ''){
      alert('value cannot be empty');
      return;
    }
    else{
      for(let x in this.seaTArr){
        var count=0;
        if(this.seaTArr[x]["unbooked"] < data.seat){
          console.log(this.seaTArr);
        }
        else{
          for(let y in this.seaTArr[x].seats){
            if(this.seaTArr[x]["seats"][y].status){
              this.seaTArr[x]["seats"][y].color='green';
              this.seaTArr[x]["seats"][y].status=false;
              count++;
              if(parseInt(data.seat) == count){
                this.seaTArr[x]["booked"] += parseInt(data.seat);
                this.seaTArr[x]["unbooked"] = this.unbooked - this.seaTArr[x]["booked"];
                this.totalBooked += this.seaTArr[x]["booked"];
                console.log(this.seaTArr);
                return;
              }
            }
            else{
              if(this.totalBooked == 80){
                alert('all seats are booked');
                return;
              }
            }
          }
        }
      }
    }
 }
 setReset(){
  for(let a in this.seaTArr){
    for(let b in this.seaTArr[a].seats){
      this.seaTArr[a]["seats"][b].color='black';
      this.seaTArr[a]["seats"][b].status=true;
      this.seaTArr[a]["booked"]=this.booked;
      this.seaTArr[a]["unbooked"] = this.unbooked;
      this.seat='';
      this.totalBooked=0;
    }
  }
 }
}
