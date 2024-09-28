export function compareDeadline(deadline: bigint) {
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
  return deadline > currentTimestamp;
}

export function validateBetAmount(amount: number) {
  if (amount <= 0) {
    return false;
  }

  const decimalPlaces = amount.toString().split('.')[1] || '';
  if (decimalPlaces && decimalPlaces.length != 2) {
    return false;
  }

  return true;
}
