import Digit from './Digit';
import styles from './ScoreBoard.module.css';

function convert(num: number): string[] {
  if (num > 999) return ['9', '9', '9'];
  if (num < -99) return ['-', '9', '9'];

  const digits = num.toString().split('');
  while (digits.length < 3) {
    digits.unshift('0');
  }
  return digits;
}

interface DisplayProps {
  name: string;
  num: number;
}

export function Display({ num, name }: DisplayProps) {
  const digits = convert(num);
  return (
    <div data-value={num} data-testid={name} className={styles.display}>
      {digits.map((d, i) => {
        return <Digit digit={d} key={i} />;
      })}
    </div>
  );
}
