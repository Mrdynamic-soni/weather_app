const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal  = (tempVal,orgval)=>{
      let temperature = tempVal.replace("{% tempval %}",(orgval.main.temp-273).toFixed(2));
      temperature = temperature.replace("{% mintemp %}",(orgval.main.temp_min-273).toFixed(2));
      temperature = temperature.replace("{% maxtemp %}",(orgval.main.temp_max-273).toFixed(2));
      temperature = temperature.replace("{% location %}",orgval.name);
      temperature = temperature.replace("{% Countrycode %}",orgval.sys.country);
      temperature = temperature.replace("{% tempstatus %}",orgval.weather[0].main);
      
      return temperature
};

const server = http.createServer((req,res)=>{
if(req.url == "/"){
   requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=3d5794433f5e8c1a6228aa51b7ad3b84")
   .on("data",function(chunk){
       const objdata = JSON.parse(chunk);
       const arrdata = [objdata];
    // console.log(arrdata);
       const realTimeData = arrdata.map(val=>replaceVal(homeFile,val)).join("");
           res.write(realTimeData);
   })
   .on("end",(err)=>{
       if(err)
       return console.log("connection closed due to error ", err);
       console.log("end")
       res.end();
   })
}
});
server.listen(4555,"localhost")