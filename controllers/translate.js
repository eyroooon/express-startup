const translateRouter = require('express').Router();
const rp = require('request-promise');

translateRouter.post('/translate', async (req, res) => {
  let options = {
    method: 'POST',
    uri: 'https://translation.googleapis.com/language/translate/v2',
    form: {
      key: 'AIzaSyAWCoYUs5zREiRo5Iy_ZFG_j477WNHte4E',
      q: req.body.text,
      target: req.body.target,
    },
  };

  rp(options).then((response) => {
    const data = response.split(':');
    const resdata = data[3].split(',');
    const translatedWord = resdata[0].replace(/"/g, '');
    res.json(translatedWord);
  });
});

module.exports = translateRouter;
