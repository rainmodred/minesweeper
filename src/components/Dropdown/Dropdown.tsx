import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import styles from './Dropdown.module.css';
import check from '@/images/check.png';
import clsx from 'clsx';

const defaultValue: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} = {
  open: false,
  setOpen: () => {},
};
const DropdownContext = createContext(defaultValue);

interface Props {
  children: React.ReactNode;
}

export function Dropdown({ children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className={styles.dropdown}>{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownButton({ children }: Props) {
  const { open, setOpen } = useContext(DropdownContext);
  return (
    <button
      className={styles['dropdown-button']}
      onClick={() => {
        setOpen(!open);
      }}
    >
      {children}
    </button>
  );
}

export function DropdownContent({ children }: Props) {
  const { open } = useContext(DropdownContext);
  return (
    <div
      className={clsx(
        styles['dropdown-content'],
        open && styles['dropdown-content--open']
      )}
    >
      {children}
    </div>
  );
}

interface DropdownItemProps {
  checked: boolean;
  onSelect: () => void;
}

export function DropdownItem({
  checked,
  children,
  onSelect,
}: PropsWithChildren<DropdownItemProps>) {
  const { setOpen } = useContext(DropdownContext);

  function handleSelect() {
    onSelect();
    setOpen(false);
  }

  return (
    <div className={styles['dropdown-item']} onClick={handleSelect}>
      {checked ? <img src={check} alt="check" /> : <div></div>}
      {children}
    </div>
  );
}

export function DropdownSeparator() {
  return <div className={styles['dropdown-separator']} />;
}
