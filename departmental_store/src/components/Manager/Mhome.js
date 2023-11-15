import React from 'react';
import './Mhome.css' 

class Mhome extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          crm: this.props.crm,
          columns: [],
          data: [],
          operation: "insert",
          rowIDToDelete: "" ,
          groupData: [],
          showTable: false,
        };
    }

    fetchData = () => {
        fetch(`http://localhost:3001/${this.state.crm}/columns`)
            .then(response => response.json())
            .then(columns => {
                this.setState({ columns });
            })
            .catch(err => {
                console.log('Error fetching columns data:', err);
            });
    
        fetch(`http://localhost:3001/${this.state.crm}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ data });
            })
            .catch(err => {
                console.log('Error fetching data:', err);
            });
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.crm !== prevProps.crm) {
            this.setState({ crm: this.props.crm }, () => {
                this.fetchData(); // Fetch data when crm changes
            });
        }
    }   
    
    onOperationChange = (operation) => {
        this.setState({ operation });
        this.setState({showTable: false});
    }

    handleSum = (group) => {
        fetch(`http://localhost:3001/${group}/sum`)
        .then(response => response.json())
        .then(groupData => {
          this.setState({ groupData, showTable: true });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
      });
    }

    handleInsert = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Convert form data to a JSON object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch(`http://localhost:3001/${this.state.crm}/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((result) => {
            if (result === 'success') {
                // Handle successful insert
                this.fetchData();
            } else {
                // Handle errors, e.g., duplicate key
                console.log('Error inserting data:', result);
            }
        })
        .catch((err) => {
            console.log('Error inserting data:', err);
        });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleDelete = (event) => {
        event.preventDefault();
        const rowIDToDelete = this.state.rowIDToDelete;
    
        // Ensure that both tableName and rowID are provided
        if (rowIDToDelete) {
            // Send a DELETE request to your /deleteRow route with the provided values
            fetch(`http://localhost:3001/deleteRow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tableName: this.state.crm,
                    rowID: rowIDToDelete,
                }),
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result === 'success') {
                        // Handle successful delete
                        this.fetchData();
                    } else {
                        // Handle errors, e.g., row not found
                        console.log('Error deleting row:', result);
                    }
                })
                .catch((err) => {
                    console.log('Error deleting row:', err);
                });
    
            // Clear the input fields after submission
            this.setState({
                tableNameToDelete: '',
                rowIDToDelete: '',
            });
        } else {
            // Handle input validation error (both fields are required)
            console.log('Table Name and Row ID are required.');
        }
    };

    handleUpdate = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        // Convert form data to a JSON object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
    
        fetch(`http://localhost:3001/${this.state.crm}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((result) => {
            if (result === 'success') {
                // Handle successful update
                this.fetchData();
            } else {
                // Handle errors, e.g., row not found or invalid data
                console.log('Error updating data:', result);
            }
        })
        .catch((err) => {
            console.log('Error updating data:', err);
        });
    }

    hideTable = () => {
        this.setState({
          showTable: false,
        });
    };

    renderTableRows() {
        return this.state.groupData.map((row, index) => (
          <tr key={index}>
            {Object.keys(row).map(key => (
              <td key={key}>{row[key]}</td>
            ))}
          </tr>
        ));
    }

    handleNest = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Convert form data to a JSON object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('http://localhost:3001/complexQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(groupData => {
            this.setState({ groupData, showTable: true });
        })
        .catch((err) => {
            console.log('Error executing complex query:', err);
        });
    }

    handleJoin = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Convert form data to a JSON object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('http://localhost:3001/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(groupData => {
            this.setState({ groupData, showTable: true });
        })
        .catch((err) => {
            console.log('Error executing complex query:', err);
        });
    }

    render() { 
        return(
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className="bg-dark col-auto col-md-2 min-vh-100 d-flex flex-column justify-content-between">
                        <div className="bg-dark">
                            <a className="d-flex text-decoration-none mt-1 align-items-center text-white">
                                <span className="fs-4 d-none d-sm-inline">SideMenu</span>
                            </a>
                            <ul className="nav nav-pills flex-column mt-4">
                                <li className="nav-item py-2 py-sm-0">
                                    <a className="nav-link text-white">
                                        <span className="fs-4 d-none d-sm-inline pointer" onClick={() => this.onOperationChange("insert")}>Insert</span>
                                    </a>
                                </li>
                                <li className="nav-item py-2 py-sm-0">
                                    <a className="nav-link text-white">
                                        <span className="fs-4 d-none d-sm-inline pointer" onClick={() => this.onOperationChange("delete")}>Delete</span>
                                    </a>
                                </li>
                                <li className="nav-item py-2 py-sm-0">
                                    <a className="nav-link text-white">
                                        <span className="fs-4 d-none d-sm-inline pointer"  onClick={() => this.onOperationChange("join")}>Join</span>
                                    </a>
                                </li>
                                <li className="nav-item py-2 py-sm-0">
                                    <a className="nav-link text-white">
                                        <span className="fs-4 d-none d-sm-inline pointer"  onClick={() => this.onOperationChange("nest")}>Nest</span>
                                    </a>
                                </li>
                                <li className="nav-item py-2 py-sm-0">
                                    <a className="nav-link text-white">
                                        <span className="fs-4 d-none d-sm-inline pointer"  onClick={() => this.onOperationChange("sum")}>Sum</span>
                                    </a>
                                </li>
                                <li className="nav-item py-2 py-sm-0">
                                    <a className="nav-link text-white">
                                        <span className="fs-4 d-none d-sm-inline pointer"  onClick={() => this.onOperationChange("update")}>update</span>
                                    </a>
                                </li>
                            </ul>   
                        </div>
                    </div>
                    <div>
                        <div className="card mx-3" style={{width: "85rem"}}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        {this.state.columns.map(column => (
                                            <th key={column}>{column}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map(item => (
                                        <tr>
                                        {this.state.columns.map(column => (
                                            <td key={column}>{item[column]}</td>
                                        ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {this.state.operation === "insert" && (
                            <div className="card mx-3" style={{ width: "85rem" }}>
                                <form onSubmit={this.handleInsert}>
                                    <div className="form-group">
                                        {this.state.columns.map(column => (
                                            <div key={column} className="mb-3">
                                                <label htmlFor={column}>{column}</label>
                                                <input type="text" className="form-control" id={column} name={column} />
                                            </div>
                                        ))}
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        {this.state.operation}
                                    </button>
                                </form>
                            </div>
                        )}
                        {this.state.operation === "delete" && (
                            <div className="card mx-3" style={{ width: "85rem" }}>
                                <form onSubmit={this.handleDelete}>
                                    <div className="form-group">
                                        <div className="mb-3">
                                            <label htmlFor="rowIDToDelete">ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="rowIDToDelete"
                                                name="rowIDToDelete"
                                                value={this.state.rowIDToDelete}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        {this.state.operation}
                                    </button>
                                </form>
                            </div>
                        )}
                        {this.state.operation === "update" && (
                            <div className="card mx-3" style={{ width: "85rem" }}>
                                <form onSubmit={this.handleUpdate}>
                                    <div className="form-group">
                                        {this.state.columns.map(column => (
                                            <div key={column} className="mb-3">
                                                <label htmlFor={column}>{column}</label>
                                                <input type="text" className="form-control" id={column} name={column} />
                                            </div>
                                        ))}
                                    </div> 
                                    <button type="submit" className="btn btn-primary">
                                        {this.state.operation}
                                    </button>
                                </form>
                            </div>
                        )}
                        {this.state.operation === "sum" && (
                            <div className="card mx-3" style={{ width: "85rem" }}>
                                <button type="submit" className="btn btn-primary"  onClick={() => this.handleSum("quantity")}>
                                    {this.state.operation} quantity 
                                </button>
                                <button type="submit" className="btn btn-primary" onClick={() => this.handleSum("amount")}>
                                    {this.state.operation} amount
                                </button>
                                <button type="submit" className="btn btn-primary" onClick={() => this.handleSum("dept_sales")}>
                                    {this.state.operation} sales
                                </button>
                            </div>
                        )}
                        {this.state.operation === "nest" && (
                            <div className="card mx-3" style={{ width: "85rem" }}>
                                <form onSubmit={this.handleNest}>
                                    <div className="form-group">
                                        <div className="mb-3">
                                            <label htmlFor="table1">table1</label>
                                            <input type="text" className="form-control" id="table1" name="table1" />
                                            <label htmlFor="table2">table2</label>
                                            <input type="text" className="form-control" id="table2" name="table2" />
                                            <label htmlFor="condition1">condition1</label>
                                            <input type="text" className="form-control" id="condition1" name="condition1" />
                                            <label htmlFor="condition2">condition2</label>
                                            <input type="text" className="form-control" id="condition2" name="condition2" />
                                            <label htmlFor="value">value</label>
                                            <input type="text" className="form-control" id="value" name="value" />
                                        </div>
                                    </div> 
                                    <button type="submit" className="btn btn-primary">
                                        {this.state.operation}
                                    </button>
                                </form>
                            </div>
                        )}
                        {this.state.operation === "join" && (
                            <div className="card mx-3" style={{ width: "85rem" }}>
                                <form onSubmit={this.handleJoin}>
                                    <div className="form-group">
                                        <div className="mb-3">
                                            <label htmlFor="type">type</label>
                                            <input type="text" className="form-control" id="type" name="type" />
                                            <label htmlFor="table1">table1</label>
                                            <input type="text" className="form-control" id="table1" name="table1" />
                                            <label htmlFor="table2">table2</label>
                                            <input type="text" className="form-control" id="table2" name="table2" />
                                            <label htmlFor="column">column</label>
                                            <input type="text" className="form-control" id="column" name="column" />
                                        </div>
                                    </div> 
                                    <button type="submit" className="btn btn-primary">
                                        {this.state.operation}
                                    </button>
                                </form>
                            </div>
                        )}
                        {this.state.showTable && (
                            <table className="table">
                                <thead>
                                <tr>
                                    {Object.keys(this.state.groupData[0]).map(key => (
                                    <th key={key}>{key}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {this.renderTableRows()}
                                </tbody>
                            </table>
                        )}
                    </div> 
                </div>
            </div>
        );
    }
}

export default Mhome;