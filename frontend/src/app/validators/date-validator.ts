import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endDateAfterStartDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      control.get('endDate')?.setErrors({ endDateBeforeStartDate: true });
      return { endDateBeforeStartDate: true };
    }
    control.get('endDate')?.setErrors(null);
    return null;
  };
}
