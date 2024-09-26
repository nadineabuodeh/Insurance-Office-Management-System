import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectCurrencyComponent } from './select-currency.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyService } from '../../service/currency.service';
import { of } from 'rxjs';

describe('SelectCurrencyComponent', () => {
  let component: SelectCurrencyComponent;
  let fixture: ComponentFixture<SelectCurrencyComponent>;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectCurrencyComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [CurrencyService],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCurrencyComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default selected currency as NIS', () => {
    expect(component.selectedCurrency).toBe('NIS');
  });

  it('should update currency on selection', () => {
    spyOn(currencyService, 'setCurrency').and.returnValue(of({}));
    component.selectedCurrency = 'USD';
    component.onCurrencySelect();
    expect(currencyService.setCurrency).toHaveBeenCalledWith('USD');
  });

  it('should capitalize username', () => {
    const result = component.capitalizeFirstLetter('john');
    expect(result).toBe('John');
  });
});