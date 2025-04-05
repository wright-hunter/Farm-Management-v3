import styles from './sidebar.module.css';
import { House, Wheat, Tractor, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>My App</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <House size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/fields/">
              <Wheat size={20} />
              <span>Fields</span>
            </Link>
          </li>
          <li>
            <Link to="/equipment/">
              <Tractor size={20} />
              <span>Equipment</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>   
    );
}

export default Sidebar;