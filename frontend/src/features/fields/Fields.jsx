import styles from './fields.module.css';
import Table from '../../components/Table';

const Fields = () => {
  return (
    <div className = {styles.layout}>
      <div className = {styles.plot}></div>
      <div className = {styles.plot}></div>
      <div className = {styles.table}>
        <h1>Fields</h1>
        <Table api='http://127.0.0.1:5000/api/users' />
      </div>
    </div>
  );
};

export default Fields;
