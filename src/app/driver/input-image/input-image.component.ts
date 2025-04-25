import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../angular.module';
import { toBase64 } from './To64';
import { error } from 'console';

@Component({
  selector: 'app-input-image',
  imports: [
    MaterialModule
  ],
  templateUrl: './input-image.component.html',
  styleUrl: './input-image.component.css'
})
export class InputImageComponent {
@Input({required: true})
title!: string;
imageBase64?: string;
change(event:Event){
  const input = event.target as HTMLInputElement;
  if(input.files && input.files.length > 0){
    const file: File = input.files[0];
    toBase64(file).then((value: string) => this.imageBase64 = value)
    .catch(error => console.log(error));
  }
}
}
