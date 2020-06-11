var arr = [];
var arr1 = [];
var arr2 = [];

for (let index = 0; index < 100; index++) {
    arr.push(Math.round(((Math.random()*2)-1)*3));
}

for (let index = 0; index < 100; index++) {
    arr1[index] = 0
    for (let i = 0; i < index; i++) {
        arr1[index] += arr[i];
    }
}

for (let index = 0; index < 100; index++) {
    arr2[index] = 0
    for (let i = 0; i < index; i++) {
        arr2[index] += arr1[i];
    }
}

if (Math.max.apply(Math, arr2) >= 1000){
    arr2 = arr2.map(x => x*(1000/Math.max.apply(Math, arr2)))
}

 if (Math.min.apply(Math, arr2) <= 0){
    arr2 = arr2.map(x => x*(1/Math.min.apply(Math, arr2)) + 1)
}

console.log(Math.max.apply(Math, arr2))
console.log(Math.min.apply(Math, arr2))