import Digit from './Digit';

function convert(num: number): string[] {
  if (num > 999) return ['9', '9', '9'];
  if (num < -99) return ['-', '9', '9'];

  const digits = num.toString().split('');
  while (digits.length < 3) {
    digits.unshift('0');
  }
  return digits;
}

interface NumbersFieldProps {
  num: number;
}

export function Display({ num }: NumbersFieldProps) {
  const digits = convert(num);
  return (
    <div className="numbers-field">
      {digits.map((d, i) => {
        return <Digit digit={d} key={i} />;
      })}
    </div>
  );
}
