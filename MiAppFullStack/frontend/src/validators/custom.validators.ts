import { AbstractControl , ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
 static forbiddenWordsValidator(forbiddenWords : string [] ) : ValidatorFn {
   return (control : AbstractControl) : ValidationErrors | null => {
    if(!control.value) {
      return null;
    }
     const text = control.value.toLowerCase();
      // Buscamos si alguna palabra prohibida está incluida en el texto del usuario
      const foundWord = forbiddenWords.find(word => text.includes(word.toLowerCase()));
      if(foundWord) {
        return { forbiddenWords: { matchedWord: foundWord } };
      }
      return null;
  }
 }

static electronicsMinPrice() : ValidatorFn {
  return (control : AbstractControl) : ValidationErrors | null => {
    const formGroup = control as AbstractControl;
    const price = formGroup.get('price')?.value;
	const category = formGroup.get('category')?.value;

    if(category === 'electronics' && price < 50) {
     return { premiumCategoryMinPriceError : true }
	}
    return null;
   } 
}

}


