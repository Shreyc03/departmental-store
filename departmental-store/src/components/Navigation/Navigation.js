import React from "react";

const Navigation = ({ isSignedIn, OnRouteChange, type, crm, OnTableChange }) => {
    if (isSignedIn) {
        if (type === 'manager')
        return (
            <nav className="navbar navbar-expand-lg f3 black pa3" style={{ backgroundColor: 'transparent' }}>
              <div className="container-fluid">
                <h1 className="f2 black">Manager</h1>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item" style={{marginLeft: "100px"}}>
                      <a className={`nav-link ${crm === 'store' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('store')}>Store</a>
                    </li> 
                    <li className="nav-item"  style={{marginLeft: "30px"}}>
                      <a className={`nav-link ${crm === 'department' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('department')}>Department</a>
                    </li>
                    <li className="nav-item"  style={{marginLeft: "30px"}}>
                      <a className={`nav-link ${crm === 'employee' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('employee')}>Employee</a>
                    </li>
                    <li className="nav-item"  style={{marginLeft: "30px"}}>
                      <a className={`nav-link ${crm === 'orders' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('orders')}>Orders</a>
                    </li>
                    <li className="nav-item"  style={{marginLeft: "30px"}}>
                      <a className={`nav-link ${crm === 'supplier' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('supplier')}>Suppliers</a>
                    </li>
                    <li className="nav-item"  style={{marginLeft: "30px"}}>
                      <a className={`nav-link ${crm === 'payment' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('payment')}>Payment</a>
                    </li>
                    <li className="nav-item"  style={{marginLeft: "30px"}}>
                      <a className={`nav-link ${crm === 'products' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('products')}>Products</a>
                    </li>
                    <li className="nav-item"  style={{marginLeft: "30px"}}>
                      <a className={`nav-link ${crm === 'customer' ? 'active' : ''} pointer`} aria-current="page" onClick={() => OnTableChange('customer')}>Customers</a>
                    </li>
                  </ul> 
                  
                  {/* Sign Out link on the right */}
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link underline pointer" onClick={() => OnRouteChange('signout')}>Sign Out</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          );          
    }
    else {
        return (
            <nav style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1 className="f2 black pa3">PES Departmental Store</h1>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <p onClick={() => OnRouteChange('signin')} className="f3 link dim black underline pa3 pointer">Sign In</p>
                    <p onClick={() => OnRouteChange('register')} className="f3 link dim black underline pa3 pointer">Register</p>
                </div>
            </nav>
        );
    }
}

export default Navigation;  