# Food Mahal API

Welcome to the Food Mahal API! This API serves as the backend for the Food Mahal website, providing data and functionalities related to food items, user authentication, and more.

## Live API Endpoint

You can access the live API endpoint at [Food Mahal Resturent API](https://testing-sand-phi.vercel.app).

## Endpoints

### All Foods
- **GET /allfoods**: Fetches all food items from the database.

### Increment Food Quantity
- **POST /increment/:id**: Increments the quantity of a specific food item by its ID.

### Update Food
- **PUT /update/:id**: Updates the details of a specific food item by its ID.

### Authentication
- **POST /login**: Logs in the user and generates a JWT token.
- **POST /register**: Registers a new user with the provided credentials.

### Pagination
- **GET /foods?page=:page&limit=:limit**: Retrieves paginated results of food items, with the specified page number and limit.

### Searching
- **GET /search?query=:query**: Searches for food items based on the provided query.

## Usage

To use this API, send HTTP requests to the appropriate endpoints using your preferred method (e.g., fetch API, Axios). Ensure that you include any required parameters or headers as specified in the documentation.

For example:
```javascript
fetch('https://testing-sand-phi.vercel.app/allfoods')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
