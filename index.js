import { faker } from '@faker-js/faker'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import fs from 'fs'

import randUserAgent from 'rand-user-agent'

const app = express()

app.use(bodyParser.json())
app.use(morgan('combined'))

const port = 9999

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`)
})

app.get('/ip', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    return res.status(200).send(ip)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

app.get('/logip', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    fs.appendFile('logip.txt', ip + '\n', (err) => {
      if (err) throw err
    })
    return res.status(200).send(ip)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

app.get('/us', (req, res) => {
  const os = ['windows', 'mac', 'linux']
  const randOs = os[Math.floor(Math.random() * os.length)]
  let agent
  agent = randUserAgent('desktop', 'chrome', randOs)
  while (true) {
    if (agent.includes('HeadlessChrome')) {
      agent = randUserAgent('desktop', 'chrome', randOs)
    } else {
      break
    }
  }
  const files = fs.readdirSync('./uszip-split')
  const randomFile = files[Math.floor(Math.random() * files.length)]
  const parsedData = JSON.parse(fs.readFileSync(`./uszip-split/${randomFile}`))
  const getData = () => {
    let randomIndex = Math.floor(Math.random() * parsedData.length)
    let zip = parsedData[randomIndex].zip_code
    zip = zip.toString()
    while (zip.length < 5) {
      zip = '0' + zip
    }
    let city = parsedData[randomIndex].city
    let state = parsedData[randomIndex].state
    let fullState = parsedData[randomIndex].full_state
    return { city, state, fullState, zip }
  }
  let zipAddress = getData()
  console.log(zipAddress.fullState)
  if (zipAddress.fullState === undefined) {
    zipAddress = getData()
  }
  const { city, state, fullState, zip } = zipAddress
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const username = faker.internet.userName()
  const phone = faker.phone.number('###-###-###')
  const fullAddress = faker.address.streetAddress()
  const company = faker.company.name()

  return res.json({
    firstName,
    lastName,
    email,
    userAgent: agent,
    password,
    username,
    phone,
    fullAddress,
    city,
    state,
    fullState,
    zip,
    company,
  })
})

app.get('/k4rtug3n', (req, res) => {
  try {
    const bin = req.query.bin
    const genSixteen = (bin) => {
      const generate = (bin) => {
        let ccnum
        ccnum = bin
        const binLength = bin.length
        const sisa = 16 - binLength
        for (let i = 0; i < sisa; i++) {
          ccnum += Math.floor(Math.random() * 10)
        }
        return ccnum
      }
      const luhnCheck = (sixteenDigitString) => {
        let sum = 0
        let alternate = false
        for (let i = sixteenDigitString.length - 1; i >= 0; i--) {
          let n = parseInt(sixteenDigitString.charAt(i))
          if (alternate) {
            n *= 2
            if (n > 9) {
              n = (n % 10) + 1
            }
          }
          sum += n
          alternate = !alternate
        }
        return sum % 10 === 0
      }
      let cc_number
      while (true) {
        const sixteenDigitString = generate(bin)
        if (luhnCheck(sixteenDigitString)) {
          cc_number = sixteenDigitString
          break
        }
      }
      return cc_number
    }
    const cc_number = genSixteen(bin)
    let month_exp = (Math.floor(Math.random() * 5) + 1).toString()
    if (month_exp.length === 1) {
      month_exp = '0' + month_exp
    }
    const this_year = new Date().getFullYear()
    const year_exp = (Math.floor(Math.random() * 5) + this_year)
      .toString()
      .slice(-2)

    let cvv = Math.floor(Math.random() * 900) + 100
    cvv = cvv.toString()
    const livecard = {
      card_number: cc_number,
      month_exp: month_exp,
      year_exp: year_exp,
      cvv: cvv,
    }
    return res.status(200).json(livecard)
  } catch (err) {
    return res.json({ error: 'invalid request' })
  }
})
