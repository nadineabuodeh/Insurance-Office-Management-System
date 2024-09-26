import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InsuranceService } from './insurance.service';
import { Insurance } from '../model/insurance.model';

describe('InsuranceService', () => {
  let service: InsuranceService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/insurances';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InsuranceService]
    });
    service = TestBed.inject(InsuranceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve insurances', () => {
    const mockInsurances: Insurance[] = [
      { id: 1, insuranceType: 'Health', description: 'Health insurance' },
      { id: 2, insuranceType: 'Car', description: 'Car insurance' }
    ];

    service.getInsurances().subscribe(insurances => {
      expect(insurances.length).toBe(2);
      expect(insurances).toEqual(mockInsurances);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockInsurances);
  });

  it('should retrieve an insurance by ID', () => {
    const mockInsurance: Insurance = { id: 1, insuranceType: 'Health', description: 'Health insurance' };

    service.getInsuranceById(1).subscribe(insurance => {
      expect(insurance).toEqual(mockInsurance);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInsurance);
  });

  it('should add a new insurance', () => {
    const newInsurance: Insurance = { insuranceType: 'Life', description: 'Life insurance' };

    service.addInsurance(newInsurance).subscribe(insurance => {
      expect(insurance).toEqual({ ...newInsurance, id: 3 });
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newInsurance, id: 3 });
  });

  it('should update an insurance', () => {
    const updatedInsurance: Insurance = { id: 1, insuranceType: 'Updated Health', description: 'Updated description' };

    service.updateInsurance(1, updatedInsurance).subscribe(insurance => {
      expect(insurance).toEqual(updatedInsurance);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedInsurance);
  });

  it('should delete an insurance', () => {
    service.deleteInsurance(1).subscribe(response => {
      expect(response).toBeNull(); 
    });
  
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); 
  });  
});