from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, UploadFile, Body
from parse import parse_statement
from pydantic import BaseModel
import datetime 
app = FastAPI()



origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://mpesa-wrap.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


""" 
Datapoints to extract:
 - All transaction costs => money spent to move your money around
 - Your mpesa soulmates => who you send and receive money from the most
 - Day time spending habits => what time of day do you spend the most
 - How you spend as the week progresses => spending patterns over the week
 - Monthly spending trends => how your spending changes month to month
"""


class Transansaction(BaseModel):
    receipt_number: str
    completion_time: str
    details: str
    transaction_status: str
    paid_in: str
    withdrawn: str
    balance: str



def weekday_vs_weekend_spending(
    transactions: list[Transansaction]
) -> dict[str, int | float]:
    # categorize into weekday and weekend
    categories = {
        "weekday": {
            "count": 0,
            "amount": 0.0,
        },
        "weekend": {
            "count": 0,
            "amount": 0.0,
        },
    }
    for tx in transactions:
        # trans time => "2026-01-05 03:54:43"
        try:
            date_obj = datetime.datetime.strptime(tx.completion_time, "%Y-%m-%d %H:%M:%S").date()
            weekday = date_obj.weekday()  # Monday is 0 and Sunday is 6
            amount_str = tx.withdrawn.replace(",", "").replace("-", "").strip()
            if amount_str:
                amount = float(amount_str)
                if weekday < 5:
                    categories["weekday"]["count"] += 1
                    categories["weekday"]["amount"] += amount
                else:
                    categories["weekend"]["count"] += 1
                    categories["weekend"]["amount"] += amount
        except ValueError:
            pass
    return {
        cat: {
            "count": categories[cat]["count"],
            "amount": round(categories[cat]["amount"], 2)
        } for cat in categories
    }


def figure_weekday_spending(
    transactions: list[Transansaction]
) -> dict[str, int | float]:
    # categorize into Mon, Tue, Wed, Thu, Fri, Sat, Sun
    weekday_categories = [
        {
            "name": "Monday",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "Tuesday",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "Wednesday",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "Thursday",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "Friday",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "Saturday",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "Sunday",
            "count": 0,
            "amount": 0.0,
        },
    ]
    for tx in transactions:
        # trans time => "2026-01-05 03:54:43"
        try:
            date_obj = datetime.datetime.strptime(tx.completion_time, "%Y-%m-%d %H:%M:%S").date()
            weekday = date_obj.weekday()  # Monday is 0 and Sunday is 6
            amount_str = tx.withdrawn.replace(",", "").replace("-", "").strip()
            if amount_str:
                amount = float(amount_str)
                weekday_categories[weekday]["count"] += 1
                weekday_categories[weekday]["amount"] += amount
        except ValueError:
            pass
    return {
        cat["name"]: {
            "count": cat["count"],
            "amount": round(cat["amount"], 2)
        } for cat in weekday_categories
    }


def figure_time_of_day(
    transactions: list[Transansaction]
) -> dict[str, int | float]:
    # categorize into morning[5am-12pm], afternoon[12pm-5pm], evening[5pm-9pm], night[9pm-5am]
    time_categories = [
        {
            "name": "morning",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "afternoon",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "evening",
            "count": 0,
            "amount": 0.0,
        },
        {
            "name": "night",
            "count": 0,
            "amount": 0.0,
        },
    ]
    for tx in transactions:
        # trans time => "2026-01-05 03:54:43"
        try:
            time_obj = datetime.datetime.strptime(tx.completion_time, "%Y-%m-%d %H:%M:%S").time()
            hour = time_obj.hour
            if 5 <= hour < 12:
                time_categories[0]["count"] += 1
                amount_str = tx.withdrawn.replace(",", "").replace("-", "").strip()
                if amount_str:
                    time_categories[0]["amount"] += float(amount_str)
            elif 12 <= hour < 17:
                time_categories[1]["count"] += 1
                amount_str = tx.withdrawn.replace(",", "").replace("-", "").strip()
                if amount_str:
                    time_categories[1]["amount"] += float(amount_str)
            elif 17 <= hour < 21:
                time_categories[2]["count"] += 1
                amount_str = tx.withdrawn.replace(",", "").replace("-", "").strip()
                if amount_str:
                    time_categories[2]["amount"] += float(amount_str)
            else:
                time_categories[3]["count"] += 1
                amount_str = tx.withdrawn.replace(",", "").replace("-", "").strip()
                if amount_str:
                    time_categories[3]["amount"] += float(amount_str)
        except ValueError:
            pass
    return {
        cat["name"]: {
            "count": cat["count"],
            "amount": round(cat["amount"], 2)
        } for cat in time_categories
    }


def calculate_transaction_costs(
    transactions: list[Transansaction]
) -> float:
    # transactions to consider => details containing "Pay Bill Charge", 
    for tx in transactions:
        pass
def identify_mpesa_soulmates(
    transactions: list[Transansaction]
):
    """
    Identifies people you frequently send/receive money from.  
    """
    sender_dict = {}
    receiver_dict = {}
    
    for tx in transactions:
        details = tx.details
        details_lower = details.lower()
        
        # received money transactions
        if "funds received from" in details_lower or "received from" in details_lower:
            try:
                # "Funds received from - 2547******111 JOHN NGANGA" or similar
                if " - " in details:
                    sender_info = details.split(" - ", 1)[1].strip()
                    parts = sender_info.split(" ", 1)
                    sender_phone = parts[0].strip()
                    sender_name = parts[1].strip() if len(parts) > 1 else sender_phone
                    
                    amount_str = tx.paid_in.replace(",", "").replace("-", "").strip()
                    if amount_str and amount_str != "":
                        amount_received = float(amount_str)
                        
                        if sender_phone in sender_dict:
                            sender_dict[sender_phone]["total_amount"] += amount_received
                            sender_dict[sender_phone]["count"] += 1
                        else:
                            sender_dict[sender_phone] = {
                                "name": sender_name,
                                "total_amount": amount_received,
                                "count": 1
                            }
            except (ValueError, IndexError):
                pass  # skip malformed entries
        
        # sent money transactions
        elif "customer transfer to" in details_lower or "send money to" in details_lower:
            try:
                # "Customer Transfer to - 2547******261 ALEX WAITHERERO"
                if " - " in details:
                    receiver_info = details.split(" - ", 1)[1].strip()
                    parts = receiver_info.split(" ", 1)
                    receiver_phone = parts[0].strip()
                    receiver_name = parts[1].strip() if len(parts) > 1 else receiver_phone
                    
                    amount_str = tx.withdrawn.replace(",", "").replace("-", "").strip()
                    if amount_str and amount_str != "":
                        amount_sent = float(amount_str)
                        
                        if receiver_phone in receiver_dict:
                            receiver_dict[receiver_phone]["total_amount"] += amount_sent
                            receiver_dict[receiver_phone]["count"] += 1
                        else:
                            receiver_dict[receiver_phone] = {
                                "name": receiver_name,
                                "total_amount": amount_sent,
                                "count": 1
                            }
            except (ValueError, IndexError):
                pass  # skip malformed entries
    
    # sort by total amount descending=>largest to smallest
    sorted_senders = dict(sorted(sender_dict.items(), 
                                  key=lambda x: x[1]["total_amount"], 
                                  reverse=True))
    sorted_receivers = dict(sorted(receiver_dict.items(), 
                                    key=lambda x: x[1]["total_amount"], 
                                    reverse=True))
    
    # only return top 1 soulmate in each category
    top_senders = dict(list(sorted_senders.items())[:1])
    top_receivers = dict(list(sorted_receivers.items())[:1])
    return {
        "top_senders": top_senders,
        "top_receivers": top_receivers
    }
    
            



@app.post("/process-statement/")    
async def process_statement(
    file: UploadFile,

    # optional statement password in the body
    password: Annotated[str | None, Body()] = None
):
    try:
        # parse statement without saving anything to disk for privacy
        content = await file.read()
        result = parse_statement(path_or_fp=content, statement_password=password)
        trans = result["transactions"]
        # identify mpesa soulmates
        soul_mates = identify_mpesa_soulmates(
            transactions=[
                Transansaction(**tx) for tx in trans
            ]
        )
        # figure time of day spending habits
        time_of_day_spending = figure_time_of_day(
            transactions=[
                Transansaction(**tx) for tx in result["transactions"]
            ]
        )
        # figure time of day spending habits
        time_of_day_spending = figure_time_of_day(
            transactions=[
                Transansaction(**tx) for tx in trans
            ]
        )
        # day vs weekend spending
        day_vs_weekend_spending = weekday_vs_weekend_spending(
            transactions=[
                Transansaction(**tx) for tx in trans
            ]
        )
        # weekday spending patterns
        weekday_spending = figure_weekday_spending(
            transactions=[
                Transansaction(**tx) for tx in trans
            ]
        )
        return {
            "customer_name": result["customer_name"],
            "phone_number": result["phone_number"],
            "email": result["email"],
            "statement_begin_date": result["statement_begin_date"],
            "statement_end_date": result["statement_end_date"],
            "summary": result["summary"],
            "soul_mates": soul_mates,
            "time_of_day_spending": time_of_day_spending,
            "day_vs_weekend_spending": day_vs_weekend_spending,
            "weekday_spending": weekday_spending,
            "transactions": result["transactions"],
           
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


