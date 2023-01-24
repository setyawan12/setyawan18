const needle = require('needle');
const { load } = require('cheerio');
const fs = require('fs');

module.exports = getInfo = async (link) => {
  const host = 'https://ttsave.app/download'
  const body = { id: link }
  const res  = await needle("post", host, body, {json: true})
  try {
    const $ = load(res.body)
    return {
      success: true,
      author: {
        name: $('div div h2').text(),
        profile: $('div a').attr('href'),
        username: $('div a.font-extrabold.text-blue-400.text-xl.mb-2').text()
      },
      video: {
        thumbnail: $('div.hidden.flex-col.text-center a:nth-child(5)').attr('href'),
		judul: $('div text-gray-600 px-2 text-center break-all w-3/4 p').text(),
        views: $('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(1) span').text(),
        loves: $('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(2) span').text(),
        comments: $('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(3) span').text(),
        shares: $('div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(4) span').text(),
        url: {
          no_wm: $('div.hidden.flex-col.text-center a:nth-child(1)').attr('href'),
          wm: $('div.hidden.flex-col.text-center a:nth-child(2)').attr('href'),
        }
      },
      backsound: {
        name: $('div.flex.flex-row.items-center.justify-center.gap-1.mt-5 span').text(),
        url: $('div.hidden.flex-col.text-center a:nth-child(3)').attr('href')
      }
    }
  } catch (error) {
    const file = 'log/error.json'
    if (!fs.existsSync(file)) fs.writeFileSync(file, '[]')
    const errLog = JSON.parse(fs.readFileSync(file).toString())
    console.error(error)
    let log = {
      time: new Date().toLocaleString('en-US', {timezone: 'Asia/Jakarta'}),
      error: {
        in: error,
        cause: error.message
      }
    }
    errLog.push(log)
    fs.writeFile(file, JSON.stringify(errLog), (err) => {
      if (err) {
        console.log(err);
        return false
      }
      console.log("\n[!] Something error, error saved to log/error.json\n");
    })
    return { success: false }
  }
}