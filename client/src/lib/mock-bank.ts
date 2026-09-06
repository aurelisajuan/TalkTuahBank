// TS port of server/db.py — kept identical so the demo state matches the
// original FastAPI backend exactly. Do not change shape without also updating
// the docs/architecture page.
import type { BankDatabase } from "@/lib/types";

export const initialDatabase: BankDatabase = {
  users: {
    "+1-512-555-0142": {
      name: "Bill Zhang",
      accounts: ["ACC892", "ACC347"],
      ssn: "567-89-0123",
      address: "987 Cedar Ln, Austin, TX 78701",
      date_of_birth: "1993-02-10",
      email: "bill.zhang@example.com",
      phone: "+1-512-555-0142",
    },
    "+1-214-555-0183": {
      name: "Warren Yun",
      accounts: ["ACC123", "ACC456"],
      ssn: "123-45-6789",
      address: "123 Main St, Dallas, TX 75201",
      date_of_birth: "1985-03-15",
      email: "warren.yun@email.com",
      phone: "+1-214-555-0183",
    },
    "+14695550456": {
      name: "Jane Smith",
      accounts: ["ACC789", "ACC790", "ACC791"],
      ssn: "987-65-4321",
      address: "456 Oak Ave, Plano, TX 75024",
      date_of_birth: "1990-07-22",
      email: "jane.smith@email.com",
      phone: "+1-469-555-0456",
    },
    "+1-972-555-0789": {
      name: "Michael Johnson",
      accounts: ["ACC321", "ACC322"],
      ssn: "456-78-9012",
      address: "789 Elm St, Richardson, TX 75080",
      date_of_birth: "1988-11-30",
      email: "michael.j@email.com",
      phone: "+1-972-555-0789",
    },
    "+1-817-555-0321": {
      name: "Sarah Williams",
      accounts: ["ACC654", "ACC655", "ACC656"],
      ssn: "234-56-7890",
      address: "321 Pine Rd, Fort Worth, TX 76102",
      date_of_birth: "1992-04-18",
      email: "sarah.w@email.com",
      phone: "+1-817-555-0321",
    },
    "+1-214-555-0654": {
      name: "David Brown",
      accounts: ["ACC987", "ACC988"],
      ssn: "345-67-8901",
      address: "654 Maple Dr, Frisco, TX 75034",
      date_of_birth: "1983-09-25",
      email: "david.b@email.com",
      phone: "+1-214-555-0654",
    },
  },
  accounts: {
    ACC123: {
      balance: 2500.0,
      statements: {
        January: "Transaction 1: -$500.00\nTransaction 2: +$1500.00",
        February: "Transaction 1: -$300.00\nTransaction 2: +$800.00",
      },
    },
    ACC456: {
      balance: 1000.0,
      statements: {
        January: "Transaction 1: -$200.00\nTransaction 2: +$1200.00",
        February: "Transaction 1: -$100.00\nTransaction 2: +$500.00",
      },
    },
    ACC789: {
      balance: 5000.0,
      statements: {
        January: "Transaction 1: -$1000.00\nTransaction 2: +$2000.00",
        February: "Transaction 1: -$500.00\nTransaction 2: +$1500.00",
      },
    },
    ACC790: {
      balance: 12500.0,
      statements: {
        January: "Transaction 1: -$2000.00\nTransaction 2: +$5000.00",
        February: "Transaction 1: -$1500.00\nTransaction 2: +$3000.00",
      },
    },
    ACC791: {
      balance: 8000.0,
      statements: {
        January: "Transaction 1: -$1000.00\nTransaction 2: +$2500.00",
        February: "Transaction 1: -$800.00\nTransaction 2: +$1800.00",
      },
    },
    ACC892: {
      balance: 3750.0,
      statements: {
        January: "Transaction 1: -$800.00\nTransaction 2: +$2500.00",
        February: "Transaction 1: -$450.00\nTransaction 2: +$1200.00",
      },
    },
    ACC347: {
      balance: 8200.0,
      statements: {
        January: "Transaction 1: -$1500.00\nTransaction 2: +$3000.00",
        February: "Transaction 1: -$700.00\nTransaction 2: +$2100.00",
      },
    },
    ACC321: {
      balance: 15000.0,
      statements: {
        January: "Transaction 1: -$3000.00\nTransaction 2: +$5000.00",
        February: "Transaction 1: -$2000.00\nTransaction 2: +$4000.00",
      },
    },
    ACC322: {
      balance: 6500.0,
      statements: {
        January: "Transaction 1: -$1200.00\nTransaction 2: +$2800.00",
        February: "Transaction 1: -$900.00\nTransaction 2: +$1600.00",
      },
    },
    ACC654: {
      balance: 9800.0,
      statements: {
        January: "Transaction 1: -$1800.00\nTransaction 2: +$3500.00",
        February: "Transaction 1: -$1200.00\nTransaction 2: +$2500.00",
      },
    },
    ACC655: {
      balance: 4200.0,
      statements: {
        January: "Transaction 1: -$900.00\nTransaction 2: +$1500.00",
        February: "Transaction 1: -$600.00\nTransaction 2: +$1200.00",
      },
    },
    ACC656: {
      balance: 7500.0,
      statements: {
        January: "Transaction 1: -$1500.00\nTransaction 2: +$2800.00",
        February: "Transaction 1: -$1000.00\nTransaction 2: +$2000.00",
      },
    },
    ACC987: {
      balance: 11000.0,
      statements: {
        January: "Transaction 1: -$2500.00\nTransaction 2: +$4500.00",
        February: "Transaction 1: -$1800.00\nTransaction 2: +$3200.00",
      },
    },
    ACC988: {
      balance: 5800.0,
      statements: {
        January: "Transaction 1: -$1200.00\nTransaction 2: +$2200.00",
        February: "Transaction 1: -$800.00\nTransaction 2: +$1500.00",
      },
    },
  },
  payments: {
    PAY001: {
      from_account: "ACC123",
      to_account: "ACC456",
      amount: 300.0,
      date: "2024-05-01",
      status: "Scheduled",
    },
    PAY002: {
      from_account: "ACC456",
      to_account: "ACC123",
      amount: 150.0,
      date: "2024-05-15",
      status: "Completed",
    },
    PAY003: {
      from_account: "ACC789",
      to_account: "ACC892",
      amount: 500.0,
      date: "2024-04-30",
      status: "Completed",
    },
    PAY004: {
      from_account: "ACC892",
      to_account: "ACC347",
      amount: 750.0,
      date: "2024-05-10",
      status: "Pending",
    },
    PAY005: {
      from_account: "ACC347",
      to_account: "ACC789",
      amount: 1000.0,
      date: "2024-05-20",
      status: "Scheduled",
    },
    PAY006: {
      from_account: "ACC123",
      to_account: "ACC789",
      amount: 250.0,
      date: "2024-04-25",
      status: "Completed",
    },
    PAY007: {
      from_account: "ACC790",
      to_account: "ACC321",
      amount: 1500.0,
      date: "2024-05-05",
      status: "Completed",
    },
    PAY008: {
      from_account: "ACC321",
      to_account: "ACC654",
      amount: 2000.0,
      date: "2024-05-12",
      status: "Pending",
    },
    PAY009: {
      from_account: "ACC655",
      to_account: "ACC987",
      amount: 800.0,
      date: "2024-05-18",
      status: "Scheduled",
    },
    PAY010: {
      from_account: "ACC988",
      to_account: "ACC791",
      amount: 1200.0,
      date: "2024-04-28",
      status: "Completed",
    },
  },
};

export function cloneDatabase(): BankDatabase {
  return JSON.parse(JSON.stringify(initialDatabase));
}

let payCounter = 11;
export function nextPaymentId(): string {
  const id = `PAY${String(payCounter).padStart(3, "0")}`;
  payCounter += 1;
  return id;
}
