const ttdl =  require("./index.js");

const link = "https://www.tiktok.com/@dakwahmuezza/video/7150544062221749531"

ttdl.getInfo(link)
  .then((result) => {
    console.log(result);
  })