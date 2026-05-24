export const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
