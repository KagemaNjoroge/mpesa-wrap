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
    trans_cost: number;
}
