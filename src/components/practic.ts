const filterArray = <T>(arr: T[],  predicate: (item: T) => boolean): T[] => {
  // code
  const result: T[] = [];

  // Проходим по каждому элементу массива
  for (const item of arr) {
    // Если предикат возвращает true, добавляем элемент в результат
    if (predicate(item)) {
      result.push(item);
    }
  }
  // Возвращаем отфильтрованный массив
  return result;
}

// Пример 1: Фильтрация чисел
const numbers = [1, 2, 3, 4, 5]
const isEven = (num: number) => num % 2 === 0

const result = filterArray(numbers, isEven)
// console.log(result) // [2, 4]

// Пример 2: Фильтрация строк
const words = ['hello', 'world', 'typescript']
const startsWithT = (word: string) => word.startsWith('t')

const result2 = filterArray(words, startsWithT)
// console.log(result2) // ["typescript"]

const mapArray = <T, U>(array: T[], transform: (item: T) => U): U[] => {
  const result: U[] = []
  for (const item of array) {
    result.push(transform(item))
  }
  return result
}

// Пример 1: Преобразование чисел в строки
const numbers1 = [1, 2, 3, 4]
const transformNumberToString = (num: number) => `Number: ${num}`

const result3 = mapArray(numbers1, transformNumberToString)
// console.log(result3) // ["Number: 1", "Number: 2", "Number: 3", "Number: 4"]

// Пример 2: Преобразование строк в их длины
const words2 = ['hello', 'world', 'typescript']
const getLength = (word: string) => word.length

const lengthResults = mapArray(words2, getLength)
// console.log(lengthResults) // [5, 5, 10]

// Пример 3: Преобразование объектов в строки
type Person = { name: string; age: number }
const people: Person[] = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
]
const toDescription = (person: Person) => `${person.name} is ${person.age} years old`

const descriptions = mapArray(people, toDescription)
// console.log(descriptions) // ["Alice is 25 years old", "Bob is 30 years old"]

function updateArray<T>(arr: T[], incl: T): T[] {
  // code
  const result: T[] = [...arr]
  if(!(result.includes(incl))) {
    result.push(incl)
  }
  return result
}

// Строки
const stringArray = ['apple', 'banana', 'cherry']
const result5 = updateArray(stringArray, 'banana') // ['apple', 'banana', 'cherry']
const result6 = updateArray(stringArray, 'date') // ['apple', 'banana', 'cherry', 'date']
console.log(result5)
console.log(result6)

// Числа
const numberArray = [1, 2, 3]
const result7 = updateArray(numberArray, 2) // [1, 2, 3]
const result8 = updateArray(numberArray, 4) // [1, 2, 3, 4]
console.log(result7)
console.log(result8)
