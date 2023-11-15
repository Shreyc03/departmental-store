const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '4264',
      database : 'departmental-store'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
    db.select('*').from('users')
        .then(user => {
            if (user.length)
                res.json(user)
        }) 
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json("unable to get user"))
            } else {
                res.status(400).json("wrong credentials")
            }
        })
        .catch(err => res.status(400).json("wrong credentials"))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .then(() => {
            return trx('users')
            .insert({
                name: name,
                email: email,
            })
            .then(() => {
                db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0]);
                })
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("The same email has already been registered"))
})

app.get('/:crm', (req, res) => {
    const { crm } = req.params;
    db.select('*').from(crm)
      .then(data => {
        res.json(data);
      })
      .catch(err => res.status(400).json('Error getting data'));
});

app.get('/:crm/columns', (req, res) => {
    const { crm } = req.params;
    db.select('*').from('information_schema.columns')
      .where({ table_name: crm })
      .then(data => { 
        const columns = data.map(item => item.column_name);
        res.json(columns);
      })
      .catch(err => res.status(400).json('Error getting column names'));
});

app.post('/:crm/insert', (req, res) => {
  const { crm } = req.params;
  const data = req.body;

  db(crm)
      .insert(data)
      .then((result) => {
          res.json('success'); // Return the inserted data
      })
      .catch((err) => {
          if (err.code === '23505') {
              // Error code '23505' corresponds to duplicate key violation (unique constraint)
              res.status(409).json('Duplicate key error');
          } else {
              console.log('Error inserting data:', err);
              res.status(500).json('Error inserting data');
          }
      });
});

app.post('/deleteRow', (req, res) => {
  const { tableName, rowID } = req.body;
  let column; // Define the column variable

  if (tableName === "store") {
    column = "store_id"; // Set the column based on tableName
  }
  else if (tableName === "department") {
    column = "dept_id";
  }
  else if (tableName === "employee") {
    column = "emp_id";
  }
  else if (tableName === "orders") {
    column = "transaction_id";
  }
  else if (tableName === "supplier") {
    column = "sup_id";
  }
  else if (tableName === "payment") {
    column = "payment_id";
  }
  else if (tableName === "product") {
    column = "product_id";
  }
  else {
    column = "cust_id";
  }

  console.log(`Deleting row with tableName: ${tableName} and rowID: ${rowID}`);

  // Execute the DeleteRowByID function using Knex
  db.raw('SELECT DeleteRowByID(?, ?, ?)', [tableName, column, rowID])
      .then(() => {
          res.json("success");
      })
      .catch((error) => {
          console.error("Error deleting row:", error);
          res.status(500).json("Error deleting row");
      });
});

app.post('/:crm/update', (req, res) => {
  const { crm } = req.params; // Get CRM from the URL
  const data = req.body; // Data to update, including rowIDToUpdate
  let column;

  if (crm === "store") {
    column = "store_id"; // Set the column based on crm
  }
  else if (crm === "department") {
    column = "dept_id";
  }
  else if (crm === "employee") { 
    column = "emp_id";
  }
  else if (crm === "orders") {
    column = "transaction_id";
  }
  else if (crm === "supplier") {
    column = "sup_id";
  }
  else if (crm === "payment") {
    column = "payment_id";
  }
  else if (crm === "product") {
    column = "product_id";
  }
  else {
    column = "cust_id";
  }
  
  db(crm)
      .where(column, data[column]) // Assuming 'id' is the primary key column
      .update(data) // Update the row with the provided data
      .then(() => {
          res.json('success'); // Return success message
      })
      .catch((err) => {
          console.log('Error updating data:', err);
          res.status(500).json('Error updating data');
      });
});

app.get('/:grp/sum', (req, res) => {
  const { grp } = req.params;
  let column, table;

  if (grp === "amount") {
    column = "cust_id";
    table = "payment"
  }
  else {
    column = "store_id";
    if (grp === "quantity") {
      table = "orders"
    }
    else {
      table = "department"
    }
  }

  db.select(column)
      .sum(grp)
      .from(table)
      .groupBy(column)
      .orderBy(column)
      .then(data => {
          res.json(data);
      })
      .catch(err => {
          console.error('Error calculating store sales:', err);
          res.status(500).json('Error calculating store sales');
      });
});

app.post('/complexQuery', (req, res) => {
  const { table1, table2, condition1, condition2, value } = req.body;

  // Assuming the provided tables and conditions are valid
  db.select('*')
    .from(table1)
    .where(condition1, 'IN', db.select(condition1)  // Select all conditions from table1 in the inner query
      .from(table2)
      .where(condition2, '=', value))
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.error('Error executing complex query:', err);
      res.status(500).json('Error executing complex query');
    });
});

app.post('/join', (req, res) => {
  const { type, table1, table2, column } = req.body;
  console.log(req.body);
  // Assuming the provided tables and conditions are valid
  let joinQuery;

  switch (type.toLowerCase()) {
      case 'inner':
          joinQuery = 'innerJoin';
          break;
      case 'left':
          joinQuery = 'leftJoin';
          break;
      case 'right':
          joinQuery = 'rightJoin';
          break;
      case 'full':
          joinQuery = 'fullOuterJoin';
          break;
      default:
          // Default to inner join if typeJoin is not recognized
          joinQuery = 'innerJoin';
  }

  db.select('*')
      .from(table1)
      [joinQuery](table2, `${table1}.${column}`, '=', `${table2}.${column}`)
      .then(data => {
          res.json(data);
      })
      .catch(err => {
          console.error(`Error executing ${typeJoin} join query:`, err);
          res.status(500).json(`Error executing ${typeJoin} join query`);
      });
});

app.listen(3001, () => {
    console.log("app is listening on port 3001");
})