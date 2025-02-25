import React from 'react';
import './Cell.css';

type CellProps = {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  isEditing: boolean;
  value: string;
  formula: string;
  onClick: () => void;
  onChange: (value: string) => void;
};

const Cell: React.FC<CellProps> = ({
  style,
  isEditing,
  value,
  formula,
  onClick,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={style} onClick={onClick} className="cell">
      {isEditing ? (
        <input value={formula} onChange={handleChange} autoFocus />
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
};

export default Cell;
