function decode(encoded: string, rows: number): string {
  const dist = Math.floor(encoded.length / rows);
  let ans = "";

  for (let i = 0; i < rows; i++) {
    for (let j = i; j < encoded.length; j += dist) {
      if (encoded[j] === "_") {
        ans += " ";
      } else {
        ans += encoded[j];
      }
    }
  }

  return ans;
}

console.log(decode("mnes__ya_____mi", 3));
