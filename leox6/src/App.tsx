import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='logo'>
          <div className='logo-div1'></div>
          <div className='logo-div2'></div>
        </div>
        <p className='desc'>
          欢迎来到 <span className='hand'>Leonard</span> 的个人小站.
        </p>
        <p className='btns'>
          <button className='btn-primary'>简历</button>
          <button className='btn-primary'>展示</button>
          <button className='btn-primary'>联系</button>
        </p>
      </header>
    </div>
  );
}

export default App;
