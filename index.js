import { faker } from '@faker-js/faker';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';


const app = express();


app.use(bodyParser.json());
app.use(morgan('mini'));

const port = 9999;

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
  });

app.get('/us', (req, res) => {
  const files = fs.readdirSync('./uszip-split');
  const randomFile = files[Math.floor(Math.random() * files.length)];
  const parsedData = JSON.parse(fs.readFileSync(`./uszip-split/${randomFile}`));
    const getData = () => {
      let randomIndex = Math.floor(Math.random() * parsedData.length);
      let zip = parsedData[randomIndex].zip_code;
      zip = zip.toString();
      while (zip.length < 5) {
        zip = '0' + zip;
      }
      let city = parsedData[randomIndex].city;
      let state = parsedData[randomIndex].state;
      let fullState = parsedData[randomIndex].full_state;
      return {city,state,fullState,zip};
    }
    let zipAddress = getData();
    console.log(zipAddress.fullState)
    if (zipAddress.fullState === undefined) {
      zipAddress = getData();
    }
    const {city,state,fullState,zip} = zipAddress;
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.internet.userName();
    const phone = faker.phone.number('###-###-###')
    const fullAddress = faker.address.streetAddress();
    const company = faker.company.name();
    
    return res.json({
    firstName,
    lastName,
    email,
    password,
    username,
    phone,
    fullAddress,
    city,
    state,
    fullState,
    zip,
    company
    });
});