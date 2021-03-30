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
let lastLeftIndex;//         to call image when refreshed
let lastMidIndex;//          to call image when refreshed
let lastRightIndex;//        to call image when refreshed

// products names
const productNames =['bag', 'banana', 'bathroom', 'boots', 'breakfast',
  'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen',
  'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb',
  'water-can', 'wine-glass'];

//products constructor
function ProDis(name){
  this.name = name;
  this.path = `../images/${name}.jpg`;
  this.votes = 0;
  this.shown = 0;
  ProDis.all.push(this);//   pushing every object created into an array called (all)
}

ProDis.all = [];//           an Array to contain all product

// creating product objects
for(let i=0; i<productNames.length; i++){
  new ProDis(productNames[i]);
}

// creating a function that will store any object created from the ProDis constructor into local storage
function setProducts(){
  let productsSave = JSON.stringify(ProDis.all); // converting product objects into strings
  localStorage.setItem('Products',productsSave); // saving product objects at local storage
}
// creating a function that will call data stored at local storage, and
// converting them into normal objects again, and then display new images
function saveData(){
  let previousData = localStorage.getItem('Products');
  let previousImgs = JSON.parse(previousData);
  // console.log(previousImgs);
  ProDis.all = previousImgs;
  display();
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
  // assigning the previous indexes to their variables
  diffLeftImg = leftIndex;
  diffMidImg = midIndex;
  diffRightImg = rightIndex;
  // declaring a random index to left image and making sure next iteration is different
  do{
    // rendering the left image
    leftIndex = randomNumb(ProDis.all.length-1, 0);
    leftImage.src = ProDis.all[leftIndex].path;
    leftImage.alt = ProDis.all[leftIndex].name;
    leftImage.title = ProDis.all[leftIndex].name;
  }while(leftIndex === diffLeftImg || leftIndex === diffMidImg || leftIndex === diffRightImg);
  ProDis.all[leftIndex].shown +=1;
  lastLeftIndex = leftIndex;
  localStorage.setItem('lastLeftIndex',lastLeftIndex);
  // declaring a random index to middle image and assuring that mid image
  // is different from its neighbor image and previous iteration image
  do{
    // rendering the middle image
    midIndex = randomNumb(ProDis.all.length-1, 0);
    midImage.src = ProDis.all[midIndex].path;
    midImage.alt = ProDis.all[midIndex].name;
    midImage.title = ProDis.all[midIndex].name;
  }while(midIndex === leftIndex || midIndex === diffMidImg || midIndex === diffLeftImg || midIndex === diffRightImg);
  ProDis.all[midIndex].shown +=1;
  lastMidIndex = midIndex;
  localStorage.setItem('lastMidIndex',lastMidIndex);
  // declaring a random index to right image and assuring that left image
  // is different from its neighbor image and previous iteration image
  do{
    // rendering the right image
    rightIndex = randomNumb(ProDis.all.length-1, 0);
    rightImage.src =ProDis.all[rightIndex].path;
    rightImage.alt = ProDis.all[rightIndex].name;
    rightImage.title = ProDis.all[rightIndex].name;
  }while(rightIndex === leftIndex || rightIndex === midIndex || rightIndex === diffRightImg || rightIndex === diffMidImg || rightIndex === diffLeftImg);
  ProDis.all[rightIndex].shown +=1;
  lastRightIndex = rightIndex;
  localStorage.setItem('lastRightIndex',lastRightIndex);
  // console.log('current',leftIndex,midIndex,rightIndex );
  // console.log('previous', diffLeftImg,diffMidImg,diffRightImg );
  // console.log(' ');
  setProducts();//           storing created object products into local storage
}
// display();
// console.table(ProDis.all);

// crating an event
section.addEventListener('click', voting);

// creating a voting function attached to the event
function voting(event){
  if(event.target.id !== 'products'){
    if(event.target.id === leftImage.id){
      ProDis.all[leftIndex].votes++;
    }else if(event.target.id === midImage.id){
      ProDis.all[midIndex].votes++;
    }else{
      ProDis.all[rightIndex].votes++;
    }
    setProducts();//      saving the votes into local storage
    saveData();//         displaying new images to vote for
    numRounds -=1;
    localStorage.setItem('rounds',numRounds);//        saving number of round so it does not gone when refreshing
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
      // displaying the results
      localStorage.removeItem('rounds');//           resetting number of rounds
      localStorage.removeItem('Products');//         resetting local storage
      compute();//                                   calling the function that will create the list
    }
  }
  // this.productsSave = JSON.stringify(ProDis.all); // converting product objects into strings
  // localStorage.setItem('Products',this.productsSave); // saving product objects at local storage
}

// creating a function that will display the results
function compute(){
  const list = document.getElementById('list');
  const table = document.createElement('ul');
  list.appendChild(table);
  for(let i=0; i<ProDis.all.length; i++){
    // setting votesChart and viewsChart data
    votesChart.push(ProDis.all[i].votes);//      pushing the votes of each time in an array to use in the chart
    viewsChart.push(ProDis.all[i].shown);//      pushing the views of each time in an array to use in the chart
    const elList = document.createElement('li');
    table.appendChild(elList);
    elList.innerHTML=`<span id="proNam">${ProDis.all[i].name}</span> had <span id="proVot">${ProDis.all[i].votes}</span> vote/s, and was seen <span id="proSh">${ProDis.all[i].shown}</span> times.`;
  }
  proChart();//                                  calling the function that will display the chart
}

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

// if there is a local storage then don't store new ones
if(localStorage.getItem('Products') !== null){
  let getData = localStorage.getItem('Products');
  let oldData = JSON.parse(getData);
  ProDis.all = oldData;
  numRounds = JSON.parse(localStorage.getItem('rounds'));
  display();//                                                displaying old data (before the refresh)
}else{
  display();//                                                 displaying for the first time
}
