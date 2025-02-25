import React from 'react';
import './Header.css';

type HeaderProps = {
  index: number;
  style: React.CSSProperties;
  type: 'column' | 'row';
};

const Header: React.FC<HeaderProps> = ({ index, style, type }) => {
  const getColumnLabel = (index: number): string => {
    let label = '';
    let num = index;
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
    }
    return label;
  };

  return (
    <div style={style} className="header-container">
      {type === 'column' ? getColumnLabel(index) : (index + 1).toString()}
    </div>
  );
};

export default Header;
