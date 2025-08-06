import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AreasExamesPage } from "./areas-exames";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AreasExamesPage],
  imports: [IonicPageModule.forChild(AreasExamesPage), FormsModule],
})
export class AreasExamesPageModule {}
