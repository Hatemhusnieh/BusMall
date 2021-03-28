'use strict';

// defining global variables for use in functions
let leftIndex; //            left image index
let midIndex; //             middle image index
let rightIndex; //           right image index
let numRounds = 25; //        number of rounds counter
let results; //              results of the voting

// products names
const productNames =['bag', 'banana', 'bathroom', 'boots', 'breakfast',
  'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen',
  'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb',
  'water-can', 'wine-glass'];

//products constructor
function ProDis(name){
  this.name = name;
  this.path = `./images/${name}.jpg`;
  this.votes = 0;
  this.shown = 0;
  ProDis.all.push(this);
}
ProDis.all = [];//          an Array to contain all product

// creating product objects
for(let i=0; i<productNames.length; i++){
  new ProDis(productNames[i]);
}

// console.table(ProDis.all);

// retrieving HTML elements
const leftImage = document.getElementById('product1');
const midImage = document.getElementById('product2');
const rightImage = document.getElementById('product3');
const section = document.getElementById('products');
const result = document.getElementById('result');

//generating a random number
function randomNumb(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// rendering 3 images
function display(){
  // rendering the left image
  leftIndex = randomNumb(ProDis.all.length-1, 0);
  leftImage.src = ProDis.all[leftIndex].path;
  leftImage.alt = ProDis.all[leftIndex].name;
  leftImage.title = ProDis.all[leftIndex].name;
  ProDis.all[leftIndex].shown +=1;
  // assuring that mid image is different
  do{
    // rendering the middle image
    midIndex = randomNumb(ProDis.all.length-1, 0);
    midImage.src = ProDis.all[midIndex].path;
    midImage.alt = ProDis.all[midIndex].name;
    midImage.title = ProDis.all[midIndex].name;
  }while(midIndex === leftIndex);
  ProDis.all[midIndex].shown +=1;
  // assuring that left and mid images are not ad right image
  do{
  // rendering the right image
    rightIndex = randomNumb(ProDis.all.length-1, 0);
    rightImage.src =ProDis.all[rightIndex].path;
    rightImage.alt = ProDis.all[rightIndex].name;
    rightImage.title = ProDis.all[rightIndex].name;
  }while(rightIndex === leftIndex || rightIndex===midIndex);
  ProDis.all[rightIndex].shown +=1;
}
// display();
// console.table(ProDis.all);

// crating an event
section.addEventListener('click', voting);

// creating a voting function
function voting(event){
  if(event.target.id !== 'products'){
    if(event.target.id === leftImage.id){
      ProDis.all[leftIndex].votes++;
    }else if(event.target.id === midImage.id){
      ProDis.all[midIndex].votes++;
    }else{
      ProDis.all[rightIndex].votes++;
    }
    display();
    numRounds -=1;
    // showing a button when reaching the decided rounds number
    if (numRounds === 0) {
      section.removeEventListener('click', voting);//   stopping the event

      leftImage.src = '../images/thanks.png';
      leftImage.alt = 'thanks';
      leftImage.title ='thanks';
      midImage.src = '../images/thanks.png';
      midImage.alt = 'thanks';
      midImage.title = 'thanks';
      rightImage.src ='../images/thanks.png';
      rightImage.alt = 'thanks';
      rightImage.title = 'thanks';

      results = document.createElement('button');
      result.appendChild(results);
      results.textContent='Results !';
      // creating an event when pressing on the button
      results.addEventListener('click', compute);
    }
    // console.table(ProDis.all);
  }
}


// creating a function that will display the results
function compute(){
  const table = document.createElement('ul');
  result.appendChild(table);
  for(let i=0; i<ProDis.all.length; i++){
    const elList = document.createElement('li');
    table.appendChild(elList);
    elList.textContent=`${ProDis.all[i].name} had ${ProDis.all[i].votes} vote/s, and was seen ${ProDis.all[i].shown} times.`;
  }
}
// displaying for the first time
display();

