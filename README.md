# Blog API

This is a RESTful API for a blogging platform. The API allows users to register, login, reset passwords, and refresh tokens. It also includes functionality for handling user authentication and authorization using JWT tokens before interacting with the blogs through create, delete, update and get all blogs.


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Sovatharothh/blog_API.git
    ```

2. Change to the project directory:

    ```bash
    cd blog-api
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"

```



## API Endpoints

### Authentication

- **POST `/api/v1/users/register`**: User registration.
  
- **POST `/api/v1/users/login`**: User login.
  
- **POST `/api/v1/users/reset-password`**: Reset user password.

- **POST `/api/v1/users/refresh-token`**: Reset user token.
  
### Expenses

- **POST `/api/v1/blogs`**: Create a new blog.
  
- **GET `/api/v1/blogs`**: Get all blogs.
  
- **GET `/api/v1/blogs/:id`**: Get a blog by ID.
  
- **PUT `/api/v1/blogs/:id`**: Update a blog by ID.
  
- **DELETE `/api/v1/blogs/:id`**: Delete a blog by ID.