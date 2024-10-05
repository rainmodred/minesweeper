import {
  Dropdown,
  DropdownButton,
  DropdownContent,
  DropdownSeparator,
  DropdownItem,
} from '@/components/Dropdown/Dropdown';
import styles from './Menu.module.css';

const menuConfig = [
  { title: 'New', hotkey: 'F2' },
  null,
  { title: 'Beginner' },
  { title: 'Intermediate' },
  { title: 'Expert' },
];

interface MenuProps {
  selectedDifficulty: string;
  onSelect: (title: string) => void;
}

export function Menu({ selectedDifficulty, onSelect }: MenuProps) {
  return (
    <div className={styles.menu}>
      <Dropdown>
        <DropdownButton>Game</DropdownButton>
        <DropdownContent>
          {menuConfig.map((menuItem) => {
            if (!menuItem) {
              return <DropdownSeparator key="separator" />;
            }
            return (
              <DropdownItem
                key={menuItem.title}
                checked={menuItem.title === selectedDifficulty}
                onSelect={() => {
                  onSelect(menuItem.title);
                }}
              >
                <div>{menuItem.title}</div>
                {menuItem.hotkey && <div>{menuItem.hotkey}</div>}
              </DropdownItem>
            );
          })}
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
