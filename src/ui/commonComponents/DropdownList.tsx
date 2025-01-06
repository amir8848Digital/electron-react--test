import React from "react";

const DropdownList = ({
  items,
  focusedIndex,
  onSelect,
  tableHead,
}: {
  items: any[];
  focusedIndex: number | null;
  onSelect: (e: any, item: any) => void;
  tableHead: any;
}) => (
  <div
    className="dropdown-menu show overflow-auto"
    style={{ maxHeight: "200px" }}
  >
    <table className="table table-hover mb-0" style={{ fontSize: "12px" }}>
      <thead>
        <tr>
          {Object.keys(tableHead).map((key) => (
            <th key={key}>{tableHead[key]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr
            key={idx}
            className={focusedIndex === idx ? "table-primary" : ""}
            // onClick={(e) => onSelect(e, item)}
            onMouseDown={(e) => onSelect(e, item)}
          >
            {Object.keys(tableHead).map((key) => (
              <td key={key}>{item[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DropdownList;
