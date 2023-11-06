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
                                        <span className="fs-4 d-none d-sm-inline pointer"  onClick={() => this.onOperationChange("filter")}>Filter</span>
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

                    </div> 
                </div>
            </div>
        );
    }
}

export default Mhome;