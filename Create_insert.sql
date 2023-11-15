use departmental_store;

CREATE TABLE Store
(
  Location VARCHAR(20) NOT NULL,
  Store_id INT NOT NULL,
  Name VARCHAR(20) NOT NULL,
  Contact_Store INT NOT NULL,
  PRIMARY KEY (Store_id)
);

CREATE TABLE Department
(
  Dept_id INT NOT NULL,
  Store_id INT NOT NULL,
  Dept_name VARCHAR(20) NOT NULL,
  Dept_sales INT NOT NULL,
  PRIMARY KEY (Dept_id),
  FOREIGN KEY (Store_id) REFERENCES Store(Store_id) ON DELETE CASCADE
);

CREATE TABLE Products
(
  Product_id INT NOT NULL,
  Store_id INT NOT NULL,
  Name VARCHAR(20) NOT NULL,
  Dept_id INT NOT NULL,
  Dept_name VARCHAR(20) NOT NULL,
  Price INT NOT NULL,
  Quantity INT NOT NULL,
  PRIMARY KEY (Product_id),
  FOREIGN KEY (Dept_id) REFERENCES Department(Dept_id) ON DELETE CASCADE,
  FOREIGN KEY (Store_id) REFERENCES Store(Store_id) ON DELETE CASCADE
);

CREATE TABLE Employee
(
  Emp_id INT NOT NULL,
  Store_id INT NOT NULL,
  Contact_Employee INT NOT NULL,
  Position VARCHAR(20) NOT NULL,
  F_name VARCHAR(20) NOT NULL,
  L_name VARCHAR(20) NOT NULL,
  Dept_id INT NOT NULL,
  PRIMARY KEY (Emp_id),
  FOREIGN KEY (Dept_id) REFERENCES Department(Dept_id),
  FOREIGN KEY (Store_id) REFERENCES Store(Store_id) ON DELETE CASCADE
);

CREATE TABLE Customer
(
  Cust_id INT NOT NULL,
  F_name VARCHAR(20) NOT NULL,
  L_name VARCHAR(20) NOT NULL,
  Contact_Customer INT NOT NULL,
  PRIMARY KEY (Cust_id)
);

CREATE TABLE Payment
(
  Payment_id INT NOT NULL,
  Method VARCHAR(20) NOT NULL,
  Amount INT NOT NULL,
  PaymentDate DATE NOT NULL,
  Cust_id INT NOT NULL,
  PRIMARY KEY (Payment_id),
  FOREIGN KEY (Cust_id) REFERENCES Customer(Cust_id) ON DELETE CASCADE
);

CREATE TABLE Supplier
(
  Sup_id INT NOT NULL,
  Sup_name VARCHAR(20) NOT NULL,
  Location VARCHAR(20) NOT NULL,
  Contact_Supplier INT NOT NULL,
  PRIMARY KEY (Sup_id)
);

CREATE TABLE Orders
(
  TransactionDate DATE NOT NULL,
  Transaction_id INT NOT NULL,
  Sup_id INT NOT NULL,
  Store_id INT NOT NULL,
  Quantity INT NOT NULL,
  Product_id INT NOT NULL,
  PRIMARY KEY (Transaction_id),
  FOREIGN KEY (Sup_id) REFERENCES Supplier(Sup_id) ON DELETE CASCADE,
  FOREIGN KEY (Product_id) REFERENCES Products(Product_id) ON DELETE CASCADE,
  FOREIGN KEY (Store_id) REFERENCES Store(Store_id) ON DELETE CASCADE
);

CREATE TABLE USERS (
	id serial PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE login (
	id serial PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO Store (Location, Store_id, Name, Contact_Store)
VALUES
('New York', 1, 'StoreA', 1234567890),
('Los Angeles', 2, 'StoreB', 9876543210),
('Chicago', 3, 'StoreC', 5551234567),
('San Francisco', 4, 'StoreD', 9990001111),
('Dallas', 5, 'StoreE', 4447778888),
('Miami', 6, 'StoreF', 6669990000),
('Seattle', 7, 'StoreG', 3332221111),
('Houston', 8, 'StoreH', 8881112222),
('Atlanta', 9, 'StoreI', 2224445555),
('Boston', 10, 'StoreJ', 7776665555);

-- Insert values into the Department table
INSERT INTO Department (Dept_id, Store_id, Dept_name, Dept_sales)
VALUES
(1, 1, 'Electronics', 100000),
(2, 2, 'Clothing', 75000),
(3, 3, 'Grocery', 120000),
(4, 4, 'Toys', 50000),
(5, 5, 'Shoes', 90000),
(6, 6, 'Books', 60000),
(7, 7, 'Home Goods', 80000),
(8, 8, 'Sporting Goods', 110000),
(9, 9, 'Beauty', 45000),
(10, 10, 'Jewelry', 70000);

-- Insert values into the Products table
INSERT INTO Products (Product_id, Store_id, Name, Dept_id, Dept_name, Price, Quantity)
VALUES
(1, 1, 'Laptop', 1, 'Electronics', 1200, 50),
(2, 2, 'Jeans', 2, 'Clothing', 50, 200),
(3, 3, 'Cereal', 3, 'Grocery', 5, 1000),
(4, 4, 'Action Figure', 4, 'Toys', 10, 300),
(5, 5, 'Sneakers', 5, 'Shoes', 80, 150),
(6, 6, 'Novel', 6, 'Books', 15, 120),
(7, 7, 'Couch', 7, 'Home Goods', 500, 20),
(8, 8, 'Basketball', 8, 'Sporting Goods', 30, 50),
(9, 9, 'Shampoo', 9, 'Beauty', 8, 300),
(10, 10, 'Necklace', 10, 'Jewelry', 100, 30);

-- Insert values into the Employee table
INSERT INTO Employee (Emp_id, Store_id, Contact_Employee, Position, F_name, L_name, Dept_id)
VALUES
(1, 1, 1112223333, 'Manager', 'John', 'Doe', 1),
(2, 2, 4445556666, 'Sales Associate', 'Jane', 'Smith', 2),
(3, 3, 7778889999, 'Clerk', 'Robert', 'Johnson', 3),
(4, 4, 9990001111, 'Cashier', 'Emily', 'Williams', 4),
(5, 5, 2223334444, 'Stock Clerk', 'Michael', 'Brown', 5),
(6, 6, 6667778888, 'Librarian', 'Sarah', 'Taylor', 6),
(7, 7, 3334445555, 'Assistant Manager', 'David', 'Jones', 7),
(8, 8, 8889990000, 'Trainer', 'Jessica', 'Miller', 8),
(9, 9, 2221114444, 'Beautician', 'Megan', 'Anderson', 9),
(10, 10, 7776665555, 'Jeweler', 'Ryan', 'Moore', 10);

-- Insert values into the Customer table
INSERT INTO Customer (Cust_id, F_name, L_name, Contact_Customer)
VALUES
(1, 'Alice', 'Johnson', 9998887777),
(2, 'Bob', 'Smith', 3332221111),
(3, 'Charlie', 'Doe', 6665554444),
(4, 'Diana', 'Williams', 1114447777),
(5, 'Ethan', 'Brown', 5558881111),
(6, 'Fiona', 'Taylor', 2225558888),
(7, 'George', 'Jones', 7772225555),
(8, 'Hannah', 'Miller', 4441118888),
(9, 'Ian', 'Anderson', 8884441111),
(10, 'Julia', 'Moore', 5557772222);

-- Insert values into the Payment table
INSERT INTO Payment (Payment_id, Method, Amount, PaymentDate, Cust_id)
VALUES
(1, 'Credit Card', 100, '2023-11-11', 1),
(2, 'Cash', 50, '2023-11-10', 2),
(3, 'Debit Card', 75, '2023-11-09', 3),
(4, 'Check', 120, '2023-11-08', 4),
(5, 'Cash', 200, '2023-11-07', 5),
(6, 'Credit Card', 30, '2023-11-06', 6),
(7, 'Debit Card', 45, '2023-11-05', 7),
(8, 'Cash', 80, '2023-11-04', 8),
(9, 'Credit Card', 25, '2023-11-03', 9),
(10, 'Debit Card', 60, '2023-11-02', 10);

-- Insert values into the Supplier table
INSERT INTO Supplier (Sup_id, Sup_name, Location, Contact_Supplier)
VALUES
(1, 'TechSupplier', 'San Francisco', 1112223333),
(2, 'ClothingWholesaler', 'Dallas', 4445556666),
(3, 'GroceryDistributor', 'Miami', 7778889999),
(4, 'ToyManufacturer', 'Los Angeles', 8889990000),
(5, 'ShoeSupplier', 'Chicago', 5554443333),
(6, 'BookPublisher', 'New York', 6667778888),
(7, 'HomeGoodsSupplier', 'Seattle', 3332221111),
(8, 'SportingGoodsSupplier', 'Houston', 9990001111),
(9, 'BeautySupplier', 'Atlanta', 2223334444),
(10, 'JewelrySupplier', 'Boston', 7776665555);

-- Insert values into the Orders table
INSERT INTO Orders (TransactionDate, Transaction_id, Sup_id, Store_id, Quantity, Product_id)
VALUES
('2023-11-10', 1, 1, 1, 10, 1),
('2023-11-09', 2, 2, 2, 20, 2),
('2023-11-08', 3, 3, 3, 15, 3),
('2023-11-07', 4, 4, 4, 30, 4),
('2023-11-06', 5, 5, 5, 25, 5),
('2023-11-05', 6, 6, 6, 12, 6),
('2023-11-04', 7, 7, 7, 8, 7),
('2023-11-03', 8, 8, 8, 5, 8),
('2023-11-02', 9, 9, 9, 18, 9),
('2023-11-01', 10, 10, 10, 22, 10);

