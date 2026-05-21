import { useEffect, useState } from 'react';
import { Row, RowSelectionState } from '@tanstack/react-table';

let isDragging = false;
let dragAction = false;

function stopDrag() {
  isDragging = false;
  window.removeEventListener('mouseup', stopDrag);
}

interface UiTableCheckboxProps<TData extends object> {
  row: Row<TData>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export default function UiTableCheckbox<TData extends object>({ row, setRowSelection }: UiTableCheckboxProps<TData>) {
  return (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={() => {}}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !row.getIsSelected();
        isDragging = true;
        dragAction = next;
        window.addEventListener('mouseup', stopDrag);
        setRowSelection((prev) => ({ ...prev, [row.id]: next }));
      }}
      style={{ cursor: 'pointer' }}
    />
  );
}

export function useRowSelection<TData>(items: TData[]) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => { setRowSelection({}); }, [items]);

  function handleRowMouseEnter(row: Row<TData>) {
    if (!isDragging) return;
    setRowSelection((prev) => ({ ...prev, [row.id]: dragAction }));
  }

  return { rowSelection, setRowSelection, handleRowMouseEnter };
}
