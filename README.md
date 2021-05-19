# CONFERE BACKEND CHALLENGE

A NodeJS app developed by [@Mazurco066](https://github.com/Mazurco066).

## Libraries and Structure

A Job application app using the functional programming paradigm, there aere some libs i used:

* **Ramda**
* **MongoDb**
* **Moment**
* **UUID**
* **Express**

## Setup

Assuming you have [yarn](https://yarnpkg.com/), run the following commands to install dependencies and run the App:

```sh
# Install nodejs dependencies
yarn install

# Do not forget to setup your .env file based on .env.example
yarn local

# For production build run
yarn start
```

## Endpoints

Here are the endpoints this application contains:

### [GET] Version
path: /

### [POST] Store Transaction
path: /transaction

body example:

```json
{
	"value": 50.46,
	"description": "Transaction Description",
	"type": "debit", // Might be credit
  "installments": null, // inform 1 or more if credit type
	"card": {
		"number": "5545171471918193", // Must be a valid card number
		"expiry": "05/23",
		"cvv": "209",
		"holder": "Holder name"
	}
}
```

### [GET] List Transactions
path: /transactions
| Query Param | Type   | Value                                                       | Default Value |
|-------------|--------|-------------------------------------------------------------|---------------|
| limit       | number | Register limit per page, use 0 if you dont want pagination. | 0             |
| offset      | number | Cursor position at pagination, use aling limit param.       | 0             |
| type        | string | "debit" or "credit", use to filter register by type         |               |
| toDate      | string | Regex to filter transactions by description                 |               |

### [GET] List Receivables
path: /receivables
| Query Param | Type       | Value                                                                                            | Default Value |
|-------------|------------|--------------------------------------------------------------------------------------------------|---------------|
| limit       | number     | Register limit per page, use 0 if you dont want pagination.                                      | 0             |
| offset      | number     | Cursor position at pagination, use aling limit param.                                            | 0             |
| status      | string     | "received" or "expected", use to filter register by status                                       |               |
| toDate      | YYYY-MM-DD | Final date from interval filter, inform only this parameter to get registers until this day      |               |
| fromDate    | YYYY-MM-DD | Initial date from interval filter, inform only this parameter to get register from just this day |               |

### [GET] Get Balance
path: /balance
| Query Param | Type       | Value                                             | Default Value |
|-------------|------------|---------------------------------------------------|---------------|
| fromDate    | YYYY-MM-DD | fromDate interval filter, must not be used alone. |               |
| toDate      | YYYY-MM-DD | toDate interval filter, must not be used alone    |               |

### License

This project is licensed under the MIT License. Check the [LICENSE](LICENSE) file for further details.