export function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}
