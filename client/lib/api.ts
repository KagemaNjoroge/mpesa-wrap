import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export async function fetchStatement(
    // file and password if applicable
    file: File,
    password: string | null
) {
    const formData = new FormData();
    formData.append('file', file);
    if (password) {
        formData.append('password', password);
    }

    const response = await axios.post(`${API_BASE_URL}/process-statement/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
    
}



// interfaces
/*
{
  "customer_name": "James Njoroge Nyambura",
  "phone_number": "0706076039",
  "email": "reecejames934@gmail.com",
  "statement_begin_date": "05 Jan 2026",
  "statement_end_date": "06 Jan 2026",
  "summary": {
    "SEND MONEY:": {
      "paid_in": "0.00",
      "paid_out": "280.00"
    },
    "RECEIVED MONEY:": {
      "paid_in": "7,023.00",
      "paid_out": "0.00"
    },
    "AGENT DEPOSIT:": {
      "paid_in": "0.00",
      "paid_out": "0.00"
    },
    "AGENT WITHDRAWAL:": {
      "paid_in": "0.00",
      "paid_out": "0.00"
    },
    "LIPA NA M-PESA (PAYBILL):": {
      "paid_in": "0.00",
      "paid_out": "6,762.00"
    },
    "LIPA NA M-PESA (BUY GOODS):": {
      "paid_in": "0.00",
      "paid_out": "240.00"
    },
    "OTHERS:": {
      "paid_in": "210.00",
      "paid_out": "20.00"
    },
    "TOTAL:": {
      "paid_in": "7,233.00",
      "paid_out": "7,302.00"
    }
  },
  "soul_mates": {
    "top_senders": {
      "2541******494": {
        "name": "JOSEPH MWANGI",
        "total_amount": 6400,
        "count": 3
      }
    },
    "top_receivers": {
      "2547******261": {
        "name": "ALEX WAITHERERO",
        "total_amount": 150,
        "count": 2
      }
    }
  },
  "time_of_day_spending": {
    "morning": {
      "count": 34,
      "amount": 6869
    },
    "afternoon": {
      "count": 5,
      "amount": 190
    },
    "evening": {
      "count": 0,
      "amount": 0
    },
    "night": {
      "count": 9,
      "amount": 243
    }
  },
  "day_vs_weekend_spending": {
    "weekday": {
      "count": 38,
      "amount": 7302
    },
    "weekend": {
      "count": 0,
      "amount": 0
    }
  },
  "weekday_spending": {
    "Monday": {
      "count": 25,
      "amount": 3877
    },
    "Tuesday": {
      "count": 13,
      "amount": 3425
    },
    "Wednesday": {
      "count": 0,
      "amount": 0
    },
    "Thursday": {
      "count": 0,
      "amount": 0
    },
    "Friday": {
      "count": 0,
      "amount": 0
    },
    "Saturday": {
      "count": 0,
      "amount": 0
    },
    "Sunday": {
      "count": 0,
      "amount": 0
    }
  },
  "transactions": [
    {
      "receipt_number": "UA6C22YGHI",
      "completion_time": "2026-01-06 15:13:08",
      "details": "Merchant Payment to 6552090 - ELIZABETH WANJIRU MACHARIA",
      "transaction_status": "Completed",
      "paid_in": "",
      "withdrawn": "-50.00",
      "balance": "3.10"
    },
    {
      "receipt_number": "UA6C22YJE0",
      "completion_time": "2026-01-06 15:05:13",
      "details": "Customer Transfer to - 07******495 MAGDALENE PETER",
      "transaction_status": "Completed",
      "paid_in": "",
      "withdrawn": "-50.00",
      "balance": "53.10"
    }
  ]
}

*/


interface Transaction {
    receipt_number: string;
    completion_time: string;
    details: string;
    transaction_status: string;
    paid_in: string;
    withdrawn: string;
    balance: string;
}

interface SoulMate {
    name: string;
    total_amount: number;
    count: number;
}

interface StatementMetadata{
    customer_name: string;
    phone_number: string;
    email: string;
    statement_begin_date: string;
    statement_end_date: string;
}

interface DayVsWeekdaySpending {
    weekday: {
        count: number;
        amount: number;
    };
    weekend: {
        count: number;
        amount: number;
    };
}

interface TimeOfDaySpending {
    morning: {
        count: number;
        amount: number;
    };
    afternoon: {
        count: number;
        amount: number;
    };
    evening: {
        count: number;
        amount: number;
    };
    night: {
        count: number;
        amount: number;
    };
}

interface WeekdaySpending {
    Monday: {
        count: number;
        amount: number;
    };
    Tuesday: {
        count: number;
        amount: number;
    };
    Wednesday: {
        count: number;
        amount: number;
    };
    Thursday: {
        count: number;
        amount: number;
    };
    Friday: {
        count: number;
        amount: number;
    };
    Saturday: {
        count: number;
        amount: number;
    };
    Sunday: {
        count: number;
        amount: number;
    };
}

interface StatementSummaryCategory {
    paid_in: string;
    paid_out: string;
}

interface StatementSummary {
    "SEND MONEY:": StatementSummaryCategory;
    "RECEIVED MONEY:": StatementSummaryCategory;
    "AGENT DEPOSIT:": StatementSummaryCategory;
    "AGENT WITHDRAWAL:": StatementSummaryCategory;
    "LIPA NA M-PESA (PAYBILL):": StatementSummaryCategory;
    "LIPA NA M-PESA (BUY GOODS):": StatementSummaryCategory;
    "OTHERS:": StatementSummaryCategory;
    "TOTAL:": StatementSummaryCategory;
}

export interface ParsedStatement {
    customer_name: string;
    phone_number: string;
    email: string;
    statement_begin_date: string;
    statement_end_date: string;
    summary: StatementSummary;
    soul_mates: {
        top_senders: Record<string, SoulMate>;
        top_receivers: Record<string, SoulMate>;
    };
    time_of_day_spending: TimeOfDaySpending;
    day_vs_weekend_spending: DayVsWeekdaySpending;
    weekday_spending: WeekdaySpending;
    transactions: Transaction[];
}