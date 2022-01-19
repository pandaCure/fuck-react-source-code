const resolve = require("resolve");
const { maxSatisfying } = require("semver");

var sum = 0;
const computerFloor = (n) => {
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 4;
  sum = computerFloor(n - 1) + computerFloor(n - 2) + computerFloor(n - 3);
  return sum;
};
console.log(computerFloor(11));
const mapArr = (a) => {
  const [m, n] = a;
  const b = [];
  for (let i = 0; i < m.length; i++) {
    const first = m[i];
    for (let j = 0; j < n.length; j++) {
      const end = n[j];
      b.push([first, end]);
    }
  }
  return b;
};
console.log(
  mapArr([
    ["red", "yellow"],
    ["S", "M", "L"],
  ])
);
const reserverArr = (arr) => {
  return arr.reduceRight((init, v) => {
    Array.isArray(v) ? init.push(reserverArr(v)) : init.push(v);
    return init;
  }, []);
};
console.log(reserverArr([[[1, 2, 3]]]));
console.log(reserverArr([1, [2, 3], 7, 5]));
// 定义重复字符串是由两个相同的字符串首尾拼接而成，例如  便是长度为6的一个重复字符串，而  则不存在重复字符串。

// 给定一个字符串，请返回其最长重复子串的长度。

// 若不存在任何重复字符子串，则返回 0 。

// 输入：
// "ababc"
// 复制
// 返回值：
// 4
// 复制
// 说明：
// abab为最长的重复字符子串，长度为4

const longRepreateString = (str) => {
  let head = 0;
  let end = Math.floor(str.length / 2);
  let left = 0;
  let right = 0;
  let sum = 0;
  if (head === end) return 0;
  while (head < end && end < str.length) {
    if (str[head] !== str[end]) {
      sum = 0;
      left = longRepreateString(str.slice(0, end));
      right = longRepreateString(str.slice(end));
    } else {
      sum += 2;
    }
    head++;
    end++;
  }
  return Math.max(left, right, sum);
};
console.log(longRepreateString("abcab"));
const pro = new Promise((resolve, reject) => {
  const innerpro = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 0);
    console.log(2);
    resolve(3);
  });
  innerpro.then((res) => console.log(res));
  resolve(4);
  console.log("pro");
});
pro.then((res) => console.log(res));
console.log("end");
Promise.race = (arr) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof arr[Symbol.iterator] !== "function") {
        reject("xxx");
      }
      for (let fun of arr) {
        fun.then(resolve).catch(reject);
      }
    } catch (error) {
      reject(error);
    }
  });
};
