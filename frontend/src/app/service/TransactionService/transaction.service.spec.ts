import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService, Transaction } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  const mockToken = 'test-token';
  const baseUrl = 'http://localhost:8080/transactions';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService],
    });

    service = TestBed.inject(TransactionService);
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

  it('should retrieve all transactions', () => {
    const mockTransactions: Transaction[] = [
      { id: 1, startDate: '2023-01-01', endDate: '2023-12-31', amount: 100, transactionType: 'DEPOSIT', userId: 1, policyId: 101 },
      { id: 2, startDate: '2023-02-01', endDate: '2023-12-31', amount: 200, transactionType: 'DEBT', userId: 1, policyId: 102 }
    ];

    service.getAllTransactions().subscribe(transactions => {
      expect(transactions.length).toBe(2);
      expect(transactions[0].transactionType).toBe('DEPOSIT');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockTransactions);
  });

  it('should retrieve a transaction by ID', () => {
    const mockTransaction: Transaction = {
      id: 1, startDate: '2023-01-01', endDate: '2023-12-31',
      amount: 100, transactionType: 'DEPOSIT', userId: 1, policyId: 101
    };

    service.getTransactionById(1).subscribe(transaction => {
      expect(transaction).toEqual(mockTransaction);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockTransaction);
  });

  it('should create a new transaction', () => {
    const newTransaction: Transaction = {
      id: 3, startDate: '2023-03-01', endDate: '2023-12-31',
      amount: 300, transactionType: 'DEPOSIT', userId: 1, policyId: 103
    };

    service.createTransaction(newTransaction).subscribe(transaction => {
      expect(transaction).toEqual(newTransaction);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(newTransaction);
  });

  it('should update an existing transaction', () => {
    const updatedTransaction: Transaction = {
      id: 1, startDate: '2023-01-01', endDate: '2023-12-31',
      amount: 150, transactionType: 'DEPOSIT', userId: 1, policyId: 101
    };

    service.updateTransaction(1, updatedTransaction).subscribe(transaction => {
      expect(transaction).toEqual(updatedTransaction);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(updatedTransaction);
  });

  it('should delete a transaction by ID', () => {
    service.deleteTransaction(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(null);
  });
});