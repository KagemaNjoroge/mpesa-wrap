import pdfplumber
import io
from pdfplumber.utils.exceptions import PdfminerException, MalformedPDFException




def parse_statement(
    path_or_fp: str | bytes | bytearray,
    statement_password: str | None = None,
):
    # handle bytes/bytearray vs file path
    if isinstance(path_or_fp, (bytes, bytearray)):
        file = io.BytesIO(path_or_fp)
    else:
        file = open(path_or_fp, "rb")
    
    try:
        with pdfplumber.open(path_or_fp=file, password=statement_password) as pdf:
            customer_name = ""
            phone_number = ""
            email = ""
            statement_begin_date = ""
            statement_end_date = ""
            # extract user info
            first_page = pdf.pages[0]
            
            first_page_text = first_page.extract_text()
            # customer name line begins with Customer Name:
            for line in first_page_text.split("\n"):
                if line.startswith("Customer Name:"):
                    customer_name = line.split("Customer Name:")[1].strip()
               
            # phone number line begins with Mobile Number:
                if line.startswith("Mobile Number:"):
                    phone_number = line.split("Mobile Number:")[1].strip()
                 
            # email line starts with Email Address:
                if line.startswith("Email Address:"):
                    email = line.split("Email Address:")[1].strip()
            
            # statement period line starts with Statement Period:
                if line.startswith("Statement Period:"):
                    period = line.split("Statement Period:")[1].strip()
                    dates = period.split(" - ")
                    if len(dates) == 2:
                        statement_begin_date = dates[0].strip()
                        statement_end_date = dates[1].strip()
            
            # extract summary table from the first page
            summary_table = first_page.extract_tables()[0] # we have to specify zero index because extract_tables returns a list of tables, we can't use .extract_table() method here because it will return only the bigger table on the page, which is the transactions table in this case
            #ignore the header row
            summary_data = summary_table[1:]
            # cols => transaction type, paid in, paid out
            # rows => SEND_MONEY, RECEIVED_MONEY, AGENT_DEPOSIT, AGENT_WITHDRAWAL, LIPA_NA_MPESA_PAYBILL, LIPA_NA_MPESA_BUY_GOODS, OTHERS, TOTAL
            summary_dict = {}
            for row in summary_data:
                transaction_type = row[0]
                paid_in = row[1]
                paid_out = row[2]
                summary_dict[transaction_type] = {
                    "paid_in": paid_in,
                    "paid_out": paid_out
                }
    

            # now loop through all pages to extract transactions
            # cols => Receipt Number, Completion Time, Details, Transaction Status, Paid In, Withdrawn, Balance
            transactions = []
            for page in pdf.pages:
                table = page.extract_table() #gives us the dominant table        
                # process transactions table
                transaction_data = table[1:]  # ignore header row
                for row in transaction_data:
                    # clean details col
                    details = row[2].strip() if row[2] else ""
                    details = details.replace("\n", " ")
                    transaction = {
                        "receipt_number": row[0],
                        "completion_time": row[1],
                        "details": details,
                        "transaction_status": row[3],
                        "paid_in": row[4],
                        "withdrawn": row[5],
                        "balance": row[6],
                    }
                    transactions.append(transaction)
            return {
                "customer_name": customer_name,
                "phone_number": phone_number,
                "email": email,
                "statement_begin_date": statement_begin_date,
                "statement_end_date": statement_end_date,
                "summary": summary_dict,
                "transactions": transactions
            }
    except PdfminerException as e:
        
        raise Exception("Wrong password or corrupted PDF file.")
    except MalformedPDFException as e:
        raise Exception("The PDF file is malformed or corrupted.")
        
   
    finally:
        if not isinstance(path_or_fp, (bytes, bytearray)):
            file.close()
    