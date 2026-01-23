import { jest } from '@jest/globals';

export const mockStellarSdk: any = {
  Keypair: {
    random: jest.fn(() => ({
      publicKey: () => 'GD77MOCKPUBLICKEY1234567890',
      secret: () => 'SABC...MOCKSECRET',
    })),
    fromSecret: jest.fn((secret: string) => ({
      publicKey: () => 'GD77MOCKPUBLICKEY1234567890',
      sign: jest.fn().mockReturnValue(Buffer.from('mock_signature')),
    })),
  },
  // Nesting Server inside Horizon to match SDK v13+
  Horizon: {
    Server: jest.fn().mockImplementation(() => ({
      loadAccount: (jest.fn() as any).mockResolvedValue({
        id: 'GD77MOCKPUBLICKEY1234567890',
        balances: [
          { asset_type: 'native', balance: '100.0000' },
          { asset_code: 'USDC', balance: '50.00' }
        ],
        sequenceNumber: () => '12345',
      }),
      submitTransaction: (jest.fn() as any).mockResolvedValue({ 
        hash: 'mock_hash_123',
        ledger: 45678 
      }),
      strictReceivePaths: jest.fn().mockImplementation(() => ({
        call: (jest.fn() as any).mockResolvedValue({
          records: [
            { source_amount: '10.00', source_asset_type: 'native' }
          ]
        })
      }))
    }))
  },
  Asset: jest.fn().mockImplementation((code, issuer) => ({
    code,
    issuer,
    isNative: () => !code
  })),
  TransactionBuilder: jest.fn().mockImplementation(() => ({
    addOperation: jest.fn().mockReturnThis(),
    addMemo: jest.fn().mockReturnThis(),
    setTimeout: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnThis(),
    sign: jest.fn().mockReturnThis(),
  })),
  Operation: {
    payment: jest.fn().mockReturnValue({ type: 'payment' }),
    pathPaymentStrictReceive: jest.fn().mockReturnValue({ type: 'pathPayment' }),
  },
  Network: {
    TESTNET: 'Test SDF Network ; September 2015',
  },
};

jest.mock('@stellar/stellar-sdk', () => mockStellarSdk);
jest.mock('stellar-sdk', () => mockStellarSdk);