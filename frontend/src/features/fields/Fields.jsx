import styles from './fields.module.css';
import Table from '../../components/Table';

const Fields = () => {
  return (
    <div className = {styles.layout}>
      <div className = {styles["plot-1"]}></div>
      <div className = {styles["plot-2"]}></div>
      <Table className = {styles.table}/>
    </div>
  );
};

export default Fields;
