export const shuffle = <T>(list: T[], rand: () => number): T[] => {
  const copy = list.slice();
  
  let currentIndex = copy.length;

  while (currentIndex > 0) {
    const randomIndex = Math.floor(rand() * currentIndex);
    currentIndex--;

    const temp = copy[currentIndex];
    copy[currentIndex] = copy[randomIndex];
    copy[randomIndex] = temp;
  }
  
  return copy;
}
