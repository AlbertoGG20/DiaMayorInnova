import "./Table.css";
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import React from 'react';

const Table = ({
  titles,
  data,
  actions,
  show,
  openModal,
  exportCSV,
  deleteItem,
  columnConfig,
  showCheckboxes,
  selectedItems,
  onItemSelection,
  onToggleVisibility,
  customActions
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [sortedData, setSortedData] = useState(data);
  const [expandedRows, setExpandedRows] = useState({});

  const handleSort = (field) => {
    let direction = 'ascending';
    if (sortConfig.key === field && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key: field, direction });

    const sorted = [...data].sort((a, b) => {
      if (direction === 'ascending') {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });
    setSortedData(sorted);
  };

  const getSortIcon = (field) => {
    if (sortConfig.key !== field) return null;
    return sortConfig.direction === 'ascending'
      ? <i className='fi fi-rr-angle-small-down' />
      : <i className='fi fi-rr-angle-small-up' />;
  };

  const toggleRow = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {titles.map((title, index) => (
              <th
                key={index}
                onClick={() => columnConfig[index]?.sortable && handleSort(columnConfig[index].field)}
                className={`${columnConfig[index]?.sortable ? 'pointer' : ''} ${index > 1 ? 'hide-on-mobile' : ''} ${columnConfig[index]?.align === 'right' ? 'text-right' : ''}`}
              >
                {title} {columnConfig[index]?.sortable && getSortIcon(columnConfig[index].field)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData && sortedData.map((row, index) => (
            <React.Fragment key={index}>
              <tr className={`table-row ${expandedRows[index] ? 'expanded' : ''}`}>
                {columnConfig.map((config, colIndex) => (
                  <td
                    key={colIndex}
                    className={`${colIndex > 1 ? 'hide-on-mobile' : ''} ${config.align === 'right' ? 'text-right' : ''}`}
                  >
                    {config.render ? config.render(row) : row[config.field]}
                  </td>
                ))}
                {actions && <td className="table__actions hide-on-mobile">
                  {showCheckboxes && (
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedItems?.includes(row.id)}
                        onChange={() => onItemSelection?.(row)}
                      />
                      <span className="task-page__button-text">Añadir</span>
                    </label>
                  )}
                  {onToggleVisibility && (
                    <div className="statement-page__toggle-visibility">
                      <button
                        onClick={() => onToggleVisibility(row.id, false)}
                        className={`toggle-option ${!row.is_public ? "active" : ""}`}
                        disabled={row.is_public && row.user_id !== row.current_user_id}
                      >
                        Privado
                      </button>
                      <button
                        onClick={() => onToggleVisibility(row.id, true)}
                        className={`toggle-option ${row.is_public ? "active" : ""}`}
                        disabled={row.is_public && row.user_id !== row.current_user_id}
                      >
                        Público
                      </button>
                    </div>
                  )}
                  {customActions && customActions(row)}
                  {show && <button className="btn__icon" onClick={() => show(row.id)}>
                    <i className="fi-rr-eye" />
                  </button>}
                  {openModal &&
                    <button className="btn__icon " onClick={() => openModal(row.id)}>
                      <i className="fi-rr-pencil" />
                    </button>}
                  {exportCSV && <button className="btn__icon download" onClick={() => exportCSV(row.id)}>
                    <i className="fi-rr-download" /> CSV
                  </button>}
                  {deleteItem && <button aria-label="Eliminar" className="btn__icon "
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(row.id);
                    }}>
                    <i className="fi-rr-trash" />
                  </button>
                  }
                </td>}
                <td className="table__actions show-on-mobile">
                  <button
                    className="expand-button"
                    onClick={() => toggleRow(index)}
                  >
                    <i className={`fi ${expandedRows[index] ? 'fi-rr-angle-small-up' : 'fi-rr-angle-small-down'}`} />
                  </button>
                </td>
              </tr>
              {expandedRows[index] && (
                <tr className="expanded-details">
                  <td colSpan={titles.length}>
                    <div className="expanded-content">
                      {columnConfig.map((config, colIndex) => (
                        colIndex > 1 && (
                          <div key={colIndex} className="expanded-item">
                            <strong>{titles[colIndex]}:</strong>
                            <span className={config.align === 'right' ? 'text-right' : ''}>
                              {config.render ? config.render(row) : row[config.field]}
                            </span>
                          </div>
                        )
                      ))}
                      <div className="expanded-actions">
                        {showCheckboxes && (
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedItems?.includes(row.id)}
                              onChange={() => onItemSelection?.(row)}
                            />
                            <span className="task-page__button-text">Añadir</span>
                          </label>
                        )}
                        {onToggleVisibility && (
                          <div className="statement-page__toggle-visibility">
                            <button
                              onClick={() => onToggleVisibility(row.id, false)}
                              className={`toggle-option ${!row.is_public ? "active" : ""}`}
                              disabled={row.is_public && row.user_id !== row.current_user_id}
                            >
                              Privado
                            </button>
                            <button
                              onClick={() => onToggleVisibility(row.id, true)}
                              className={`toggle-option ${row.is_public ? "active" : ""}`}
                              disabled={row.is_public && row.user_id !== row.current_user_id}
                            >
                              Público
                            </button>
                          </div>
                        )}
                        {customActions && customActions(row)}
                        {show && <button className="btn__icon" onClick={() => show(row.id)}>
                          <i className="fi-rr-eye" />
                        </button>}
                        {openModal &&
                          <button className="btn__icon " onClick={() => openModal(row.id)}>
                            <i className="fi-rr-pencil" />
                          </button>}
                        {exportCSV && <button className="btn__icon download" onClick={() => exportCSV(row.id)}>
                          <i className="fi-rr-download" /> CSV
                        </button>}
                        {deleteItem && <button aria-label="Eliminar" className="btn__icon "
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(row.id);
                          }}>
                          <i className="fi-rr-trash" />
                        </button>
                        }
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
