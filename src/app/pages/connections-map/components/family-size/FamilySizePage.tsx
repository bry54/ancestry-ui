
import React from 'react';
import BubbleChart from '../../d3/BubbleChart';

const FamilySizePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <BubbleChart />
    </div>
  );
};

export default FamilySizePage;
