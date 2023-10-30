# MANAGEMENT SALES SYSTEM API

## Instruction to start project

```
1. Clone code
2. Import file sample.sql to any SQL database management system.
3. Config file .env
4. Run npm i or npm ci
5. Run npm start
```

##. Config DB system automatically update status order when updated_on over 30days with the condition is which status not Shipped or Cancelled

1. Turn show process event & turn on (off) event scheduler

```
SHOW PROCESSLIST;
SET GLOBAL event_scheduler = OFF;
SET GLOBAL event_scheduler = ON;
```

2. Set particular schedule

```
    DROP EVENT IF EXISTS `updateStatusOrderAfter30day`;
    DELIMITER $$
    CREATE EVENT `updateStatusOrderAfter30day`
    ON SCHEDULE EVERY 1 MINUTE
    ON COMPLETION PRESERVE
    DO BEGIN
    UPDATE FA_NODEJS.orders
    SET orders.status = "On Hold"
        WHERE (TIMEDIFF(now(), updated_on) > 1) and (status not in ("Canceled", "Shipped"));
    -- WHERE datediff(now(),updateDt)>30;
END$$
DELIMITER ;
```

## Test and Report

1. Unit test coverage
    ```
    npm run test:coverage
    ```
2. Test duplicate code
    ```
    npm run test:dup
    ```
3. Test interaration testcases with newman
    ```
    npm run test:collect
    ```
4. For details apis & how to use it, please visit http://localhost:3000/api/doc to see swagger api

# APIs list

## User_Customer

1.  Register
    -   method: POST
    -   http://localhost:3000/api/users/customers/register
    -   Input:
    ```
    {
        "username": "thanhtv111",
        "password": "hoa1245@Customer",
        "customerNumber": 112
    }
    ```
    -   output:
    ```
    {
        "success": true,
        "message": "Registration successfully"
    }
    ```
2.  Login

    -   method: POST
    -   http://localhost:3000/api/users/customers/login
    -   Input:

    ```
    {
        "username": "thanhtv111",
        "password": "hoa1245@Customer"
    }
    ```

    -   output:

    ```
    {
        "success": true,
        "message": "Login successfully",
        "data": {
            "success": true,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lck51bWJlciI6MTEyLCJzYWxlc1JlcEVtcGxveWVlTnVtYmVyIjoxMTY2LCJqb2JUaXRsZSI6IkN1c3RvbWVyIiwiaWF0IjoxNjM4OTc1MTQ5LCJleHAiOjE2Mzg5Nzg3NDl9.DSjFaAGiqjcZphVL_GO9PWVYXngcILL-GrKDQadjya0"
        }
    }
    ```

## User_Employee

1.  Register
    -   method: POST
    -   http://localhost:3000/api/users/employees/register
    -   Input:
    ```
        {
            "username": "caotv131",
            "password": "hoa12345@Manager",
            "employeeNumber": 1056
        }
    ```
    -   output:
    ```
        {
            "success": true,
            "message": "Registration successfully"
        }
    ```
2.  Login

    -   method: POST
    -   http://localhost:3000/api/users/employees/login
    -   Input:

    ```
        {
            "username": "caotv131",
            "password": "hoa12345@Manager"
        }
    ```

    -   output:

    ```
        {
            "success": true,
            "message": "Login successfully",
            "data": {
                "success": true,
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZU51bWJlciI6MTA1Niwib2ZmaWNlQ29kZSI6IjEiLCJqb2JUaXRsZSI6Ik1hbmFnZXIiLCJpYXQiOjE2Mzg5NzUzNTksImV4cCI6MTYzODk3ODk1OX0._C6ppB2qrNz0ml_GaUNZHdtuUfZZ1tBaTS2-ZlC5ZoY"
            }
        }
    ```

## Employees

1.  Get all employees

    -   method: GET
    -   http://localhost:3000/api/employees
    -   output:

    ```
    {
        "success": true,
        "message": "All employees",
        "data": [
            {
                "employeeNumber": 1002,
                "lastName": "Murphy",
                "firstName": "Diane",
                "extension": "x5800",
                "email": "dmurphy@classicmodelcars.com",
                "officeCode": "1",
                "reportsTo": null,
                "jobTitle": "President",
                "created_by": 1056,
                "updated_by": null,
                "updated_on": null,
                "created_on": "2021-12-04T09:52:53.000Z"
            },
            {
                "employeeNumber": 1056,
                "lastName": "Patterson",
                "firstName": "Mary",
                "extension": "x4611",
                "email": "mpatterso@classicmodelcars.com",
                "officeCode": "1",
                "reportsTo": 1002,
                "jobTitle": "Manager",
                "created_by": 1056,
                "updated_by": null,
                "updated_on": null,
                "created_on": "2021-12-04T09:52:53.000Z"
            }
        ]
    }
    ```

2.  Get employee by employeeNumber

    -   method: GET
    -   http://localhost:3000/api/employees/{employeeNumber}
    -   output:

    ```
    {
        "success": true,
        "message": "Info of employee",
        "data": {
            "employeeNumber": 1002,
            "lastName": "Murphy",
            "firstName": "Diane",
            "extension": "x5800",
            "email": "dmurphy@classicmodelcars.com",
            "officeCode": "1",
            "reportsTo": null,
            "jobTitle": "President",
            "created_by": 1056,
            "updated_by": null,
            "updated_on": null,
            "created_on": "2021-12-04T09:52:53.000Z"
        }
    }

    ```

3.  Create a new employee

    -   method: POST
    -   http://localhost:3000/api/employees
    -   input:

    ```
    {
        "employeeNumber": 1365,
        "lastName": "Murphy",
        "firstName": "Diane",
        "extension": "x5800",
        "email": "dmurphy@classicmodelcars.com",
        "officeCode": "1",
        "reportsTo": null,
        "jobTitle": "President",
    }
    ```

    -   output:

    ```

    {
        "success": true,
        "message": "Create successfully",
        "data": {
            "employeeNumber": 1365,
            "lastName": "Murphy",
            "firstName": "Diane",
            "extension": "x5800",
            "email": "dmurphy@classicmodelcars.com",
            "officeCode": "1",
            "reportsTo": null,
            "jobTitle": "President"
        }
    }

    ```

4.  Update information employee

    -   method: PUT
    -   http://localhost:3000/api/employees/{employeeNumber}
    -   input:

    ```
    {
        "lastName":"Harry",
        "firstName":"Potter",
        "extension":"x456",
        "email":"harry_change@gmail.com",
        "officeCode":1,
        "reportsTo":2,
        "jobTitle":"Sale"
    }
    ```

    -   output:

    ```
    {
        "success": true,
        "message": "Update successfully"
    }
    ```

5.  Delete a employee
    -   method: DELETE
    -   http://localhost:3000/api/employees/{employeeNumber}
    -   output:
    ```
    {   "success": true,
        "message": "Delete successfully",
    }
    ```

## Customers

1.  Get all customers
    -   method: GET
    -   http://localhost:3000/api/customers
    -   output:
    ```
    {
    "count": 2,
    "customers": [
        {
            "customerNumber": 2,
            "customerName": "Jimbul",
            "contactLastName": "Kangche",
            "contactFirstName": "KangMi",
            "phone": "023265659",
            "addressLine1": "Co Nhue 1",
            "addressLine2": "hahaha",
            "city": "Ha Noi",
            "state": "Nam Tu Liem",
            "postalCode": "10000",
            "country": "Viet Nam",
            "salesRepEmployeeNumber": 1612,
            "creditLimit": 111,
            "created_by": 1056,
            "updated_by": null,
            "created_on": "2021-12-04T09:51:26.000Z",
            "updated_on": null
        },
        {
            "customerNumber": 3,
            "customerName": "hsdfhsdf",
            "contactLastName": "hessssss",
            "contactFirstName": "KangMi",
            "phone": "023265659",
            "addressLine1": "Co Nhue 1",
            "addressLine2": "hahaha",
            "city": "Ha Noi",
            "state": "Nam Tu Liem",
            "postalCode": "10000",
            "country": "Viet Nam",
            "salesRepEmployeeNumber": 1621,
            "creditLimit": 111,
            "created_by": 1056,
            "updated_by": null,
            "created_on": "2021-12-04T09:51:26.000Z",
            "updated_on": null
        }
      ]
    }
    ```
2.  Get customer by customerNumber

    -   method: GET
    -   http://localhost:3000/api/customers/{customerNumber}
    -   output:

    ```
    {
        "success": true,
        "message": "Information a customer by customerNumber",
        "data": {
            "customerNumber": 103,
            "customerName": "Atelier graphique",
            "contactLastName": "dfsdfsd",
            "contactFirstName": "Carine ",
            "phone": "40234234",
            "addressLine1": "54, rue Royale",
            "addressLine2": null,
            "city": "Nantes",
            "state": null,
            "postalCode": "44000",
            "country": "France",
            "salesRepEmployeeNumber": 1370,
            "creditLimit": 30000,
            "created_by": 1056,
            "updated_by": null,
            "created_on": "2021-12-04T09:51:26.000Z",
            "updated_on": null
        }
    }

    ```

3.  Create a new customer

    -   method: POST
    -   http://localhost:3000/api/customers
    -   input:

    ```
    {
        "customerName": "Jimbul",
        "contactLastName": "Kangche",
        "contactFirstName": "KangMi",
        "phone": "023265659",
        "addressLine1": "Co Nhue 1",
        "addressLine2": "hahaha",
        "city": "Ha Noi",
        "state": "Nam Tu Liem",
        "postalCode": "10000",
        "country": "Viet Nam",
        "salesRepEmployeeNumber": 1612,
        "creditLimit": 111
    }

    ```

    -   output:

    ```
    {
        "success": true,
        "message": "Create a new customer successfully",
        "customerNumber": 498
    }

    ```

4.  Update information a customer

        - method: PUT
        - http://localhost:3000/api/customers/{customerNumber}
        - input:

        ```
        {
            "customerName":"{{$randomFileName}}",
            "contactLastName":"Kim",
            "contactFirstName":"Kasss",
            "phone":"0235624234",
            "addressLine1":"Co Nhue 1",
            "addressLine2":"hahaha",
            "city":"Ha Noi",
            "state":"Nam Tu Liem",
            "postalCode":"10000",
            "country":"Viet Nam",
            "salesRepEmployeeNumber":1621,
            "creditLimit":243
        }
        ```

        - output:

        ```
        {
            "success": true,
            "message": "Updated successfully"
        }
        ```

    5 . Customers update their information

-   method: PUT
-   http://localhost:3000/api/customers/profile
-   input:

        ```
        {
            "customerName":"{{$randomFileName}}",
            "contactLastName":"Kim",
            "contactFirstName":"Kasss",
            "phone":"0235624234",
            "addressLine1":"Co Nhue 1",
            "addressLine2":"hahaha",
            "city":"Ha Noi",
            "state":"Nam Tu Liem",
            "postalCode":"10000",
            "country":"Viet Nam",
            "salesRepEmployeeNumber":1621,
            "creditLimit":243
        }
        ```

        - output:

        ```
        {
            "success": true,
            "message": "Updated successfully"
        }
        ```

    6 . The customer's own payment information

-   method: GET
-   http://localhost:3000/api/customers/mypayment

    -   output:

    ```
    {
        "success": true,
        "message": "Your payment",
        "data": [
            {
                "checkNumber": "45DF919B",
                "paymentDate": "2021-12-07T17:00:00.000Z",
                "amount": 156000,
                "created_on": "2021-12-07T17:42:49.000Z"
            },
            {
                "checkNumber": "5F61D001",
                "paymentDate": "2021-12-06T17:00:00.000Z",
                "amount": 156000,
                "created_on": "2021-12-07T02:35:29.000Z"
            }
        ]
    }
    ```

7. Delete a customer
    - method: DELETE
    - http://localhost:3000/api/customers/{customerNumber}
    - output:
    ```
    {
        "success": true,
        "message": "Delete successfully!"
    }
    ```

## orders

1.  Get all orders
    -   method: GET
    -   http://localhost:3000/api/orders
    -   output:
    ```
    {
        "success": true,
        "count": 2,
        "orders": [
            {
                "orderNumber": 10100,
                "orderDate": "2003-05-18T17:00:00.000Z",
                "requiredDate": "2003-05-27T17:00:00.000Z",
                "shippedDate": "2003-05-20T17:00:00.000Z",
                "status": "Shipped",
                "comments": null,
                "customerNumber": 103,
                "created_on": "2021-12-04T09:56:04.000Z",
                "updated_on": null,
                "created_by": 1056,
                "updated_by": null,
                "deleted": 0
            },
            {
                "orderNumber": 10101,
                "orderDate": "2003-01-08T17:00:00.000Z",
                "requiredDate": "2003-01-17T17:00:00.000Z",
                "shippedDate": "2003-01-10T17:00:00.000Z",
                "status": "Shipped",
                "comments": "Check on availability.",
                "customerNumber": 128,
                "created_on": "2021-12-04T09:56:04.000Z",
                "updated_on": null,
                "created_by": 1056,
                "updated_by": null,
                "deleted": 0
            }
        ]
    }
    ```
2.  Get orders for customer

    -   method: GET
    -   http://localhost:3000/api/orders/myorder
    -   output:

    ```
    {
        "success": true,
        "count": 2,
        "myOrder": [
            {
                "orderNumber": 10124,
                "orderDate": "2003-05-20T17:00:00.000Z",
                "requiredDate": "2003-05-28T17:00:00.000Z",
                "shippedDate": "2003-05-24T17:00:00.000Z",
                "status": "Shipped",
                "created_by": 1056,
                "orderdetails": [
                    {
                        "productCode": "S18_1749",
                        "quantityOrdered": 21,
                        "priceEach": 153,
                        "orderLineNumber": 6
                    },
                    {
                        "productCode": "S18_2248",
                        "quantityOrdered": 42,
                        "priceEach": 58.12,
                        "orderLineNumber": 5
                    }
                ]
            },
            {
                "orderNumber": 10278,
                "orderDate": "2004-08-05T17:00:00.000Z",
                "requiredDate": "2004-08-15T17:00:00.000Z",
                "shippedDate": "2004-08-08T17:00:00.000Z",
                "status": "Shipped",
                "created_by": 1056,
                "orderdetails": [
                    {
                        "productCode": "S18_1129",
                        "quantityOrdered": 34,
                        "priceEach": 114.65,
                        "orderLineNumber": 6
                    },
                    {
                        "productCode": "S18_1589",
                        "quantityOrdered": 23,
                        "priceEach": 107.02,
                        "orderLineNumber": 2
                    }
                ]
            }
        ]
    }

    ```

3.  Get order by orderNumber

    -   method: GET
    -   http://localhost:3000/api/orders/{orderNumber}
    -   output:

    ```
    {
        "success": true,
        "orders": {
            "orderNumber": 10110,
            "orderDate": "2003-03-17T17:00:00.000Z",
            "requiredDate": "2003-03-23T17:00:00.000Z",
            "shippedDate": "2003-03-19T17:00:00.000Z",
            "status": "Shipped",
            "comments": null,
            "customerNumber": 187,
            "created_on": "2021-12-04T09:56:04.000Z",
            "updated_on": null,
            "created_by": 1056,
            "updated_by": null,
            "deleted": 0
        }
    }

    ```

4.  Create a new order

    -   method: POST
    -   http://localhost:3000/api/orders
    -   input:

    ```
    {
        "orderDate": "2003-03-17T17:00:00.000Z",
        "requiredDate": "2003-03-23T17:00:00.000Z",
        "shippedDate": "2003-03-19T17:00:00.000Z",
        "status": "In Process",
        "comments": null,
        "customerNumber": 187,
        "orderdetails": [
            {
                "orderNumber": 1111,
                "productCode": "S18_1749",
                "quantityOrdered": 5,
                "priceEach": 12.365,
                "orderLineNumber": 2
            },
            {
                "orderNumber": 13311,
                "productCode": "S18_1759",
                "quantityOrdered": 5,
                "priceEach": 12.365,
                "orderLineNumber": 2
            }
        ]
    }
    ```

    -   output:

    ```
    {
        "success": true,
        "order": {
            "orderNumber": 10426,
            "orderDate": "2003-05-18T17:00:00.000Z",
            "requiredDate": "2003-05-18T17:00:00.000Z",
            "shippedDate": "2003-05-18T17:00:00.000Z",
            "status": "In Process",
            "comments": null,
            "customerNumber": 187,
            "created_on": "2021-12-08T09:04:09.000Z",
            "updated_on": null,
            "created_by": 1002,
            "updated_by": null,
            "deleted": 0,
            "orderdetails": [
                {
                    "orderNumber": 10426,
                    "productCode": "S10_1949",
                    "quantityOrdered": 5,
                    "priceEach": 12.37,
                    "orderLineNumber": 2,
                    "created_on": "2021-12-08T09:04:09.000Z",
                    "updated_on": null,
                    "deleted": 0
                },
                {
                    "orderNumber": 10426,
                    "productCode": "S18_1749",
                    "quantityOrdered": 5,
                    "priceEach": 12.37,
                    "orderLineNumber": 2,
                    "created_on": "2021-12-08T09:04:09.000Z",
                    "updated_on": null,
                    "deleted": 0
                }
            ]
        }
    }

    ```

5.  Update information a order

    -   method: PUT
    -   http://localhost:3000/api/orders/{orderNumber}
    -   input:

    ```
    {
        "status": "On Hold",
        "comments": "comments"
    }
    ```

    -   output:

    ```
    {
        success: true,
        message: "Update status order successfully",
    }
    ```

6.  Delete a order
    -   method: DELETE
    -   http://localhost:3000/api/orders/{orderNumber}
    -   output:
    ```
    {
        "success": true,
        "message": "Deleted order successfully!"
    }
    ```

## Products

1. Get all Products

    - method: GET
    - http://localhost:3000/api/products
    - output:

    ```
    {
        "success": true,
        "products": [
            {
                "productCode": "S10_1678",
                "productName": "1969 Harley Davidson Ultimate Chopper",
                "productLine": "Motorcycles",
                "productScale": "1:10",
                "productVendor": "Min Lin Diecast",
                "productDescription": "This replica features working kickstand, front suspension",
                "quantityInStock": 7933,
                "buyPrice": 48.81,
                "MSRP": 95.7,
                "created_by": 1056,
                "updated_by": null,
                "created_on": "2021-12-04T09:55:09.000Z",
                "updated_on": null
            },
            {
                "productCode": "S10_1949",
                "productName": "1952 Alpine Renault 1300",
                "productLine": "Classic Cars",
                "productScale": "1:10",
                "productVendor": "Classic Metal Creations",
                "productDescription": "Turnable front wheels",
                "quantityInStock": 7305,
                "buyPrice": 98.58,
                "MSRP": 214.3,
                "created_by": 1056,
                "updated_by": null,
                "created_on": "2021-12-04T09:55:09.000Z",
                "updated_on": null
            }
        ]
    }

    ```

2. Get product by productCode

    - method: GET
    - http://localhost:3000/api/products/{productCode}
    - output:

    ```
    {
        "success": true,
        "product": {
            "productCode": "S10_1678",
            "productName": "1969 Harley Davidson Ultimate Chopper",
            "productLine": "Motorcycles",
            "productScale": "1:10",
            "productVendor": "Min Lin Diecast",
            "productDescription": "This replica features ",
            "quantityInStock": 7933,
            "buyPrice": 48.81,
            "MSRP": 95.7,
            "created_by": 1056,
            "updated_by": null,
            "created_on": "2021-12-04T09:55:09.000Z",
            "updated_on": null
        }
    }

    ```

3. Create a new product

    - method: POST
    - http://localhost:3000/api/products
    - input:

    ```
    {
        "productCode": "S10_1674",
        "productName": "1969 Harley Davidson Ultimate Chopper",
        "productLine": "Motorcycles",
        "productScale": "1:10",
        "productVendor": "Min Lin Diecast",
        "productDescription": "This replica features working kickstand, front suspension, gear-shift lever",
        "quantityInStock": 7933,
        "buyPrice": 48.81,
        "MSRP": 95.7
    }
    ```

    - output:

    ```
    {
        "success": true,
        "message": "Create successfully new Product",
        "productCode": "S10_1674"

    }
    ```

4. Update information a product

    - method: PUT
    - http://localhost:3000/api/products/{productCode}
    - input:

    ```
    {
       "productCode": "S10_1674",
        "productName": " Harley Davidson Ultimate Chopper",
        "productLine": "Motorcycles",
        "productScale": "1:20",
        "productVendor": "Min Lin Diecast",
        "productDescription": "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
        "quantityInStock": 7933,
        "buyPrice": 48.81,
        "MSRP": 95.7
    }
    ```

    - output:

    ```
    {

       "success": true,
       "message": "Update successfully!"

    }
    ```

5. Delete a product
    - method: DELETE
    - http://localhost:3000/api/products/{productCode}
    - output:
    ```
    {
        "success": true,
        "message": "Delete successfully!"
    }
    ```

## Productlines

1.  Get all Productlines
    -   method: GET
    -   http://localhost:3000/api/product-lines
    -   output:
    ```
    {
        "success": true,
        "productLines": [
            {
                "productLine": "Classic Cars",
                "textDescription": "Attention car enthusiasts: Make your wildest car ownership dreams come true. ",
                "htmlDescription": null,
                "image": null,
                "updated_by": null,
                "created_by": 1002,
                "created_on": "2021-12-04T09:54:14.000Z",
                "updated_on": null
            },
            {
                "productLine": "Motorcycles",
                "textDescription": "Our motorcycles are state of the art replicas of classic.",
                "htmlDescription": null,
                "image": null,
                "updated_by": null,
                "created_by": 1002,
                "created_on": "2021-12-04T09:54:14.000Z",
                "updated_on": null
            }
        ]
    }
    ```
2.  Get productline by productline

    -   method: GET
    -   http://localhost:3000/api/product-lines/{productline}
    -   output:

    ```
    {
        "success": true,
        "productLine": {
            "productLine": "Vintage Cars",
            "textDescription": "Our Vintage Car models realistically portray automobiles produced from the early 1900s",
            "htmlDescription": null,
            "image": null,
            "updated_by": null,
            "created_by": 1002,
            "created_on": "2021-12-04T09:54:14.000Z",
            "updated_on": null
        }
    }

    ```

3.  Create a new product line

    -   method: POST
    -   http://localhost:3000/api/product-lines
    -   input:

    ```
    {
        "productLine": "Vintage Truck",
        "textDescription": "Our Vintage Car models realistically portray automobiles produced from the early 1900s through the 1940s. Materials used include Bakelite, diecast, plastic and wood. Most of the replicas are in the 1:18 and 1:24 scale sizes, which provide the optimum in detail and accuracy. Prices range from $30.00 up to $180.00 for some special limited edition replicas. All models include a certificate of authenticity from their manufacturers and come fully assembled and ready for display in the home or office.",
        "htmlDescription": null,
        "image": null

    }
    ```

-   output:
    ```
    {
        "success": true,
        "message": "Create successfully new Product",
        "productLine": "Vintage Truck"
    }
    ```

4. Update information a productline

    - method: PUT
    - http://localhost:3000/api/product-lines/{productline}
    - input:

    ```
    {
        "productLine": "Vintage Truck",
        "textDescription": "Our Vintage Car models realistically portray automobiles produced from the early 1900s",
        "htmlDescription": "htmlDescription",
        "image": null
    }
    ```

    - output:

    ```
    {
        "success": true,
        "message": "Update successfully!"
    }
    ```

5. Delete a productline
    - method: DELETE
    - http://localhost:3000/api/product-lines/{productline}
    - output:
    ```
    {
        "success": true,
        "message": "Delete successfully!"
    }
    ```

## Offices

1.  Get all Offices
    -   method: GET
    -   http://localhost:3000/api/offices
    -   output:
    ```
    {
    "success": true,
    "offices": [{
            "officeCode": "1",
            "city": "San Francisco",
            "phone": "+1 650 219 4782",
            "addressLine1": "100 Market Street",
            "addressLine2": "Suite 300",
            "state": "CA",
            "country": "USA",
            "postalCode": "94080",
            "territory": "NA",
            "updated_by": null,
            "created_by": 1002,
            "updated_on": null,
            "created_on": "2003-01-08T17:00:00.000Z"
        },
        {
            "officeCode": "10",
            "city": "Ha Noi",
            "phone": "123456789",
            "addressLine1": "Quang Tri",
            "addressLine2": "Tri Quang 1",
            "state": "Nam Tu Liem",
            "country": "Viet Nam",
            "postalCode": "ANUGESD",
            "territory": "Lukaku",
            "updated_by": null,
            "created_by": 1002,
            "updated_on": null,
            "created_on": "2003-01-08T17:00:00.000Z"
        }]
    }
    ```
2.  Get office by officeCode

    -   method: GET
    -   http://localhost:3000/api/offices/{officeCode}
    -   output:

    ```
    {
        "success": true,
        "office": {
            "officeCode": "10",
            "city": "Ha Noi",
            "phone": "123456789",
            "addressLine1": "Quang Tri",
            "addressLine2": "Tri Quang 1",
            "state": "Nam Tu Liem",
            "country": "Viet Nam",
            "postalCode": "ANUGESD",
            "territory": "Lukaku",
            "updated_by": null,
            "created_by": 1002,
            "updated_on": null,
            "created_on": "2003-01-08T17:00:00.000Z"
        }
    }

    ```

3.  Create a new office

    -   method: POST
    -   http://localhost:3000/api/offices
    -   input:

    ```
    {
        "officeCode": "15",
        "city": "Ha Tay",
        "phone": "123456789",
        "addressLine1": "Quang Tri",
        "addressLine2": "Tri Quang 1",
        "state": "Nam Tu Liem",
        "country": "Viet Nam",
        "postalCode": "ANUGESD",
        "territory": "Lukaku"
    }
    ```

-   output:
    ```
    {
        "success": true,
        "message": "Create successfully new office",
        "officeCode": "15"
    }
    ```

4. Update information a office

    - method: PUT
    - http://localhost:3000/api/offices/{officeCode}
    - input:

    ```
    {
            "officeCode": "15",
            "city": "Ha Tay",
            "phone": "333333",
            "addressLine1": "Quang Tri",
            "addressLine2": "Tri Quang 1",
            "state": "Nam Tu Liem",
            "country": "Viet Nam",
            "postalCode": "ANUGESD",
            "territory": "Lukaku"
            "success": true,
            "message": "Update successfully!"
    }
    ```

5. Delete a office
    - method: DELETE
    - http://localhost:3000/api/offices/{officeCode}
    - output:
    ```
    {
        "success": true,
        "message": "Delete successfully!"
    }
    ```

## report

1.  Get Revenue By Office In RangeTime
    -   method: GET
    -   http://localhost:3000/api/reports
    -   output:
    ```
    {
        "success": true,
        "message": "Sales revenue by office for a given period of time",
        "data": [{
                "officeCode": "1",
                "revenue": 1005160.36
            },
            {
                "officeCode": "2",
                "revenue": 590757.24
            },
            {
                "officeCode": "3",
                "revenue": 766414.19
            },
            {
                "officeCode": "4",
                "revenue": 2005023.76
            }
        ]
    }
    ```
2.  Get Revenue By ProductLine In Range Time By Office

    -   method: GET
    -   http://localhost:3000/api/reports/productline/{officeCode}
    -   output:

    ```
    {
        "success": true,
        "message": "Sales revenue by productLine for a given period of time in each office",
        "data": {
            "officeCode": "1",
            "Revenues": [
                {
                    "revenue": 470099.76,
                    "productLine": "Classic Cars"
                },
                {
                    "revenue": 30070.6,
                    "productLine": "Motorcycles"
                },
                {
                    "revenue": 66022.91,
                    "productLine": "Planes"
                }
            ]
        }
    }
    ```

3.  get Revenue Of Customers

    -   method: POST
    -   http://localhost:3000/api/reports/customer
    -   output:

    ```
    {
        "success": true,
        "message": "Sales revenue by customers for a given period of time",
        "data": [
            {
                "employeeNumber": 1165,
                "revenue": 668310.69,
                "customers": 6
            },
            {
                "employeeNumber": 1166,
                "revenue": 228071.75,
                "customers": 6
            },
            {
                "employeeNumber": 1188,
                "revenue": 166546.23,
                "customers": 6
            }
        ]
    }
    ```

## logger

1.  Get Log
    -   method: GET
    -   http://localhost:3000/api/loggers
    -   output:
    ```
    {
        "logger": [
            {
                "createdBy": {
                    "employeeNumber": 1002,
                    "officeCode": 1,
                    "jobTitle": "President"
                },
                "_id": "61ae3847d0c1142db32d49f3",
                "title": "customerNumber is invalid",
                "time": "2021-12-06T23:20:23",
                "action": "[PUT]: http://localhost:3000/api/customers/39884",
                "status": "Failed",
                "message": "Error: customerNumber is invalid\n    at Object.checkValidCustomerNumber (/home/hoamx1/Desktop/nodejs-knex-objection-full/utils/common.js:174:15)\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)\n    at async updateInfoCustomer (/home/hoamx1/Desktop/nodejs-knex-objection-full/services/customers.service.js:51:5)\n    at async /home/hoamx1/Desktop/nodejs-knex-objection-full/controllers/customer.controller.js:61:5",
                "__v": 0
            },
            {
                "createdBy": {
                    "employeeNumber": 1002,
                    "officeCode": 1,
                    "jobTitle": "President"
                },
                "_id": "61ae3b3d21be07185fbbfdbe",
                "title": "Cannot destructure property 'start_date' of 'filters' as it is undefined.",
                "time": "2021-12-06T23:33:01",
                "action": "[GET]: http://localhost:3000/api/loggers?start_date=2005-01-01",
                "status": "Failed",
                "message": "TypeError: Cannot destructure property 'start_date' of 'filters' as it is undefined.\n    at getLogger (/home/hoamx1/Desktop/nodejs-knex-objection-full/services/logger.service.js:26:9)\n    at /home/hoamx1/Desktop/nodejs-knex-objection-full/controllers/logger.controller.js:5:26\n    at /home/hoamx1/Desktop/nodejs-knex-objection-full/middlewares/handleError/error.js:16:9\n    at Layer.handle [as handle_request] (/home/hoamx1/Desktop/nodejs-knex-objection-full/node_modules/express/lib/router/layer.js:95:5)\n    at next (/home/hoamx1/Desktop/nodejs-knex-objection-full/node_modules/express/lib/router/route.js:137:13)\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)",
                "__v": 0
            }
        ]
    }
    ```
