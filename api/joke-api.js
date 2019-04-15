const axios = require('axios');

module.exports = {
  getJoke: () => {
    return axios
      .get('https://official-joke-api.appspot.com/random_joke')
      .then(res => {
        let joke = res.data.setup + '\n' + res.data.punchline;
        return joke;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
