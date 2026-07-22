export let time: string[] = ["00", "00", "00"];

export function incrementTime(
  currentTime: string[],
  secondsToAdd: number,
): string[] {
  const totalSeconds =
    currentTime.map(Number)[0] * 3600 +
    currentTime.map(Number)[1] * 60 +
    currentTime.map(Number)[2] +
    secondsToAdd;

  const newHours: number = Math.floor(totalSeconds / 3600) % 24;
  const newMinutes: number = Math.floor((totalSeconds % 3600) / 60);
  const newSeconds: number = totalSeconds % 60;

  return [
    String(newHours).padStart(2, "0"),
    String(newMinutes).padStart(2, "0"),
    String(newSeconds).padStart(2, "0"),
  ];
}

export function setTimeValue(newValue: number): void {
  time = incrementTime(time, newValue);
}
