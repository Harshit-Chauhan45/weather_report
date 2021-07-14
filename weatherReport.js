let puppeteer = require('puppeteer');
let fs=require("fs");
let ps=require("prompt-sync");
let prompt=ps();
let data={};
let n=[];
new Promise(function (resolve, reject) {
let inputUser=prompt("Enter the region where you want to check the weather : ");
resolve();
new Promise(function(resolve,reject){

(async function(){
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      defaultViewport: null,
      args: ["--start-maximized"],
    });
    const page = await browser.newPage();
    //for opening the site from where the data is fetch
    await page.goto('https://www.accuweather.com/en/us/google/94043/weather-forecast/74907_poi');
    await page.waitForSelector(".search-input");
    await page.click(".search-input");
    //for typing the input which user has given
    await page.type(".search-input",inputUser);
    await page.click(".icon-search");
    await page.waitForSelector(".locations-list.content-module>a");
    await page.click(".locations-list.content-module>a");

    await page.waitForSelector(".spaced-content.detail .value");
    //for extracting wind
    await page.waitForSelector(".spaced-content.detail .value");
    let Wind= await page.evaluate(function(){
      let a=document.querySelectorAll(".spaced-content.detail .value");
      return a[2].innerText;

   })
   console.log("Wind=" + Wind);
   
   //for extracting air quality
   await page.waitForSelector(".spaced-content.detail .value");
    let airQuality= await page.evaluate(function(){
      let a=document.querySelectorAll(".spaced-content.detail .value")
      return a[1].innerText;

   })
   console.log("Air Quality=" + airQuality);

   //for extracting wind gusts
   await page.waitForSelector(".spaced-content.detail .value");
   let windGusts= await page.evaluate(function(){
    let a=document.querySelectorAll(".spaced-content.detail .value")
    return a[3].innerText;
    })
    console.log("Wind Gusts=" + windGusts);
    
    //for extracting temperature right now
    await page.waitForSelector(".forecast-container .temp");
    let actualTemp= await page.evaluate(function(){
       let a=document.querySelectorAll(".forecast-container .temp");
       return a[0].innerText;

    })
    
    console.log("temperature=" + actualTemp);

    //for extracting tonight temperature
    let tonightTemperature=await page.evaluate(function(){
      let a=document.querySelectorAll(".forecast-container .temp");
      return a[1].innerText;
    })
    
    console.log("Tonight Temperature=" + tonightTemperature);
    
    //for extracting tomorrow temperature
    let tomorrowTemperature=await page.evaluate(function(){
      let a=document.querySelectorAll(".forecast-container .temp");
      return a[2].innerText;
    })
    
    console.log("Tomorrow Temperature=" + tomorrowTemperature);
    

    
      //for pushing data in data object
      n.push(Wind,airQuality,windGusts,actualTemp,tonightTemperature,tomorrowTemperature);
      data[inputUser]=n;
      //creating JSON file for keeping the data
      if(fs.existsSync("Project.json")==false)
      {
      fs.writeFileSync("Project.json", JSON.stringify(data));
      }

      //if JSON file already exists this will add data to it
      else{
        let buffer=fs.readFileSync("Project.json")
        let info=JSON.parse(buffer);
        for(let key in data){
          info[key]=data[key];
        }
        //info[inputUser]=data;
        fs.writeFileSync("Project.json", JSON.stringify(info)); 
      }
    await browser.close();
    
  })();
  resolve();  
});
});



