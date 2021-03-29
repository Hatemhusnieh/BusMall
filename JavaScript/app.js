'use strict';

// defining global variables for use in functions
let leftIndex; //            left image index
let midIndex; //             middle image index
let rightIndex; //           right image index
let numRounds = 25; //       number of rounds counter
let diffLeftImg;//           different left image index
let diffMidImg;//            different le image index
let diffRightImg;//          different right image index
let votesChart =[];//        to be used in proChart function
let viewsChart =[];//        to be used in proChart function

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

//generating a random number
function randomNumb(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// rendering 3 images
function display(){
  // making sure next iteration is different
  diffLeftImg = leftIndex;
  do{
    // rendering the left image
    leftIndex = randomNumb(ProDis.all.length-1, 0);
    leftImage.src = ProDis.all[leftIndex].path;
    leftImage.alt = ProDis.all[leftIndex].name;
    leftImage.title = ProDis.all[leftIndex].name;
  }while(diffLeftImg === leftIndex || leftIndex === diffMidImg || leftIndex === diffRightImg);
  ProDis.all[leftIndex].shown +=1;
  // assuring that mid image is different from its neighbor image and previous iteration image
  diffMidImg = midIndex;
  do{
    // rendering the middle image
    midIndex = randomNumb(ProDis.all.length-1, 0);
    midImage.src = ProDis.all[midIndex].path;
    midImage.alt = ProDis.all[midIndex].name;
    midImage.title = ProDis.all[midIndex].name;
  }while(midIndex === leftIndex || midIndex === diffMidImg || midIndex === diffLeftImg || midIndex === diffRightImg);
  ProDis.all[midIndex].shown +=1;
  // assuring that left image is different from its neighbor image and previous iteration image
  diffRightImg = rightIndex;
  do{
    // rendering the right image
    rightIndex = randomNumb(ProDis.all.length-1, 0);
    rightImage.src =ProDis.all[rightIndex].path;
    rightImage.alt = ProDis.all[rightIndex].name;
    rightImage.title = ProDis.all[rightIndex].name;
  }while(rightIndex === leftIndex || rightIndex === midIndex || rightIndex === diffRightImg || rightIndex === diffMidImg || rightIndex === diffLeftImg);
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
      leftImage.src = './images/thanks.png';
      leftImage.alt = 'thanks';
      leftImage.title ='thanks';
      midImage.src = '../images/thanks.png';
      midImage.alt = 'thanks';
      midImage.title = 'thanks';
      rightImage.src ='../images/thanks.png';
      rightImage.alt = 'thanks';
      rightImage.title = 'thanks';
      // displaying the results
      compute();
    }
  }
}

// creating a function that will display the results
function compute(){
  const list = document.getElementById('list');
  const table = document.createElement('ul');
  for(let i=0; i<ProDis.all.length; i++){
    // setting votesChart and viewsChart data
    votesChart.push(ProDis.all[i].votes);
    viewsChart.push(ProDis.all[i].shown);
    const elList = document.createElement('li');
    table.appendChild(elList);
    elList.innerHTML=`<span id="proNam">${ProDis.all[i].name}</span> had <span id="proVot">${ProDis.all[i].votes}</span> vote/s, and was seen <span id="proSh">${ProDis.all[i].shown}</span> times.`;
  }
  proChart();
}
// displaying for the first time
display();

// a function that will display a chart of products data after all rounds are finished
function proChart(){
  let ctx = document.getElementById('myChart').getContext('2d');
  let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: productNames,
      datasets: [{
        label: 'Votes',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: votesChart
      },{
        label: 'Views',
        backgroundColor: '#0affd6',
        borderColor: '#0affd6',
        data: viewsChart
      }
      ]
    },

    // Configuration options go here
    options: {}
  });
}
