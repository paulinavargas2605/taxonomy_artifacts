import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedName',
  standalone: true,
  pure: false
})
export class LocalizedNamePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(name: string | undefined | null, nameEs?: string | null): string {

    if (this.translate.currentLang() === 'es' && nameEs) {
      return nameEs;
    }

    return name || '';

  }

}