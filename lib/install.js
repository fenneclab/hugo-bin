import picocolors from 'picocolors';
import bin from './index.js';

bin().run(['version'])
  .then(() => {
    console.log(picocolors.green('Hugo binary successfully installed!'));
  })
  .catch(error => {
    console.error(picocolors.red(`${error.message}\nHugo binary installation failed!`));
  });
