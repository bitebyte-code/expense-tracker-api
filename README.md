# Expense Tracker API

A REST API built with Node.js, Express and MongoDB. It covers expense CRUD, category and date filtering, monthly and category-wise aggregation reports, and optional monthly budget alerts.

## Requirements

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection string
- Postman

## Setup

1. Open this project folder in VS Code.
2. Open the terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` and rename the copy to `.env`.
5. Set the MongoDB connection string in `.env`.

   Local MongoDB example:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
   ```

   For MongoDB Atlas, replace the value with your own connection string.

6. Start the API:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:5000`. A successful response confirms that the API is running.

For a normal start, use `npm start`.

## Base URL

`http://localhost:5000`

## Module 1: Expense CRUD

### Create an expense

`POST /api/expenses`

Body:

```json
{
  "amount": 450,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-11-12"
}
```

### Get all expenses

`GET /api/expenses`

### Get one expense

`GET /api/expenses/EXPENSE_ID`

Replace `EXPENSE_ID` with the `_id` returned when an expense is created.

### Update an expense

`PATCH /api/expenses/EXPENSE_ID`

Body:

```json
{
  "amount": 520,
  "description": "Lunch and snacks"
}
```

### Delete an expense

`DELETE /api/expenses/EXPENSE_ID`

## Module 2: Category and Date Filtering

### Filter by category

`GET /api/expenses?category=Food`

### Filter by date range

`GET /api/expenses?startDate=2026-11-01&endDate=2026-11-30`

### Combine category and date filters

`GET /api/expenses?category=Food&startDate=2026-11-01&endDate=2026-11-30`

### Pagination

`GET /api/expenses?page=1&limit=10`

Filtering and pagination can be combined.

## Module 3: Aggregation and Summaries

### Monthly expense totals

`GET /api/reports/monthly?year=2026`

The response contains all 12 months, total amount per month, expense count and the yearly grand total.

### Category-wise breakdown

`GET /api/reports/categories`

### Category-wise breakdown for a date range

`GET /api/reports/categories?startDate=2026-11-01&endDate=2026-11-30`

These report endpoints use MongoDB aggregation stages including `$match`, `$group`, `$sum`, `$sort` and `$project`.

## Module 4: Monthly Budget Alerts (Optional)

### Set or update a monthly budget

`PUT /api/budgets/2026/11`

Body:

```json
{
  "amount": 10000
}
```

The year and month are part of the URL. The request creates the budget if it does not exist, or updates it if it already exists.

### Check budget status

`GET /api/budgets/2026/11/status`

The response includes the budget, total spending, remaining amount, an `exceeded` boolean and an alert message.

## Suggested Postman testing order

1. `GET /`
2. `POST /api/expenses` with the sample body. Save the returned `_id`.
3. `GET /api/expenses`
4. `GET /api/expenses/EXPENSE_ID`
5. `PATCH /api/expenses/EXPENSE_ID`
6. `GET /api/expenses?category=Food`
7. `GET /api/expenses?startDate=2026-11-01&endDate=2026-11-30`
8. `GET /api/expenses?category=Food&startDate=2026-11-01&endDate=2026-11-30`
9. `GET /api/reports/monthly?year=2026`
10. `GET /api/reports/categories`
11. `GET /api/reports/categories?startDate=2026-11-01&endDate=2026-11-30`
12. `PUT /api/budgets/2026/11` with the sample budget body.
13. `GET /api/budgets/2026/11/status`
14. `DELETE /api/expenses/EXPENSE_ID`
15. `GET /api/expenses/EXPENSE_ID` to confirm that the deleted record is no longer available.

Use the actual expense ID returned by Postman wherever `EXPENSE_ID` appears. Create a few expenses with different categories and dates before testing the report endpoints so the aggregation results are meaningful.

## Notes

- Amounts must be greater than zero.
- Category is required.
- Date must be a valid date.
- Date filters include the full start and end dates.
- The API returns JSON responses and uses standard HTTP status codes.
- This starter project does not include user accounts or authentication because they are not listed as requirements in the supplied project guide.
