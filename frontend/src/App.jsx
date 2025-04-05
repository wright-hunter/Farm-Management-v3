import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './features/dashboard/Dashboard';
import Fields from './features/fields/Fields';
import Equipment from './features/equipment/Equipment';
import FieldEntry from './features/fields/FieldEntry';

import './App.css';

function App() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fields/" element={<Fields api="http://127.0.0.1:5000/api/fields"/>} />
        <Route path="/fields/:id" element={<FieldEntry api="http://127.0.0.1:5000/api/fields"/>} />
        <Route path="/equipment/" element={<Equipment />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
