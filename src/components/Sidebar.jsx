import './sidebar.css';
import { House, Wheat, FileText, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>My App</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <House size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/users">
              <Wheat size={20} />
              <span>Fields</span>
            </Link>
          </li>
          <li>
            <Link href="/documents">
              <FileText size={20} />
              <span>Documents</span>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/help">
              <HelpCircle size={20} />
              <span>Help</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>   
    );
}

export default Sidebar;