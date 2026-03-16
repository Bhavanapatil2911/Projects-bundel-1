import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qwert'
})
export class QwertPipe implements PipeTransform {

  transform(value: any): any {
    if (value[0] === "panel" && value[1] === undefined && value[2] === undefined) {
      return value[0] = "Panel";
    }
    if (value[0] === "non_panel" && value[1] === undefined && value[2] === undefined) {
      return value[0] = "Non Panel"
    }
    if (value[0] === "services" && value[1] === undefined && value[2] === undefined) {
      return value[0] = "Services"
    }
    if (value[0] === "panel" && value[1] ==="non_panel" && value[2]==="services") {
      return [value[0] = "Panel",value[1] = "Non Panel", value[2]="Services"];
    }

    if (value[0] === "non_panel" && value[1] ==="panel" && value[2]==="services") {
      return [value[0] = "Non Panel",value[1] = "Panel", value[2]="Services"];
    }

    if (value[0] === "services" && value[1] ==="panel" && value[2]==="non_panel") {
      return [value[0] = "Services",value[1] = "Panel", value[2]="Non Panel"];
    }
    if (value[0] === "services" && value[1] ==="non_panel" && value[2]==="panel") {
      return [value[0] = "Services",value[1] = "Non Panel", value[2]="Panel"];
    }
    if (value[0] === "panel" && value[1] ==="services" && value[2]==="non_panel") {
      return [value[0] = "Services",value[1] = "Panel", value[2]="Non Panel"];
    }
    if (value[0] === "non_panel" && value[1] ==="services" && value[2]==="panel") {
      return [value[0] = "Non Panel",value[1] = "Services", value[2]="Panel"];
    }

    if (value[0] === "non_panel" && value[1] ==="panel" && value[2]===undefined) {
      return [value[0] = "Non Panel",value[1] = "Panel"];
    }

    if (value[0] === "panel" && value[1] ==="non_panel" && value[2]===undefined) {
      return [value[0] = "Panel",value[1] = "Non Panel"];
    }
    if (value[0] === "non_panel" && value[1] ==="services" && value[2]===undefined) {
      return [value[0] = "Non Panel",value[1] = "Services"];
    }
    if (value[0] === "panel" && value[1] ==="services" && value[2]===undefined) {
      return [value[0] = "Panel",value[1] = "Services"];
    }
    if (value[0] === "services" && value[1] ==="panel" && value[2]===undefined) {
      return [value[0] = "Services",value[1] = "Panel"];
    }
    if (value[0] === "services" && value[1] ==="non_panel" && value[2]===undefined) {
      return [value[0] = "Services",value[1] = "Non Panel"];
    }

    // if (value[2] === "services") {
    //   return value[2] = "Services";
    // }
  }

}
