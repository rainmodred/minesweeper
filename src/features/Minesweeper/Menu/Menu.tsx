import {
  Dropdown,
  DropdownButton,
  DropdownContent,
  DropdownSeparator,
  DropdownItem,
} from '@/components/Dropdown/Dropdown';
import styles from './Menu.module.css';

export interface MenuItem {
  title: string;
  hotkey?: string;
  handler: () => void;
}

interface MenuProps {
  selectedItem: string;
  config: (null | MenuItem)[];
}

export function Menu({ selectedItem, config }: MenuProps) {
  return (
    <div className={styles.menu}>
      <Dropdown>
        <DropdownButton>Game</DropdownButton>
        <DropdownContent>
          {config.map((menuItem) => {
            if (!menuItem) {
              return <DropdownSeparator key="separator" />;
            }
            return (
              <DropdownItem
                key={menuItem.title}
                checked={menuItem.title === selectedItem}
                onSelect={menuItem.handler}
              >
                <div>{menuItem.title}</div>
                {menuItem.hotkey && <div>{menuItem.hotkey}</div>}
              </DropdownItem>
            );
          })}
        </DropdownContent>
      </Dropdown>

      <Dropdown>
        <DropdownButton>Help</DropdownButton>
        <DropdownContent>
          <DropdownItem checked={false} onSelect={() => {}}>
            <a
              href="https://github.com/rainmodred/minesweeper"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Github
            </a>
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
