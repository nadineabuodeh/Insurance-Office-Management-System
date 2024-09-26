import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  const mockToken = 'mockAuthToken';
  const baseUrl = 'http://localhost:8080/api/admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService]
    });

    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.setItem('authToken', mockToken); 
  });

  afterEach(() => {
    localStorage.removeItem('authToken'); 
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve admin profile', () => {
    const mockProfile = { id: 1, name: 'Admin' };

    service.getAdminProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(`${baseUrl}/profile`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockProfile);
  });

  it('should set currency', () => {
    const mockCurrency = 'USD';
    const mockResponse = { success: true };

    service.setCurrency(mockCurrency).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/setCurrency`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ currency: mockCurrency });
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockResponse);
  });

  it('should retrieve admin currency', () => {
    const mockCurrency = 'USD';

    service.getAdminCurrency().subscribe((currency) => {
      expect(currency).toBe(mockCurrency);
    });

    const req = httpMock.expectOne(`${baseUrl}/currency`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockCurrency);
  });
});