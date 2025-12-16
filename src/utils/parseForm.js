const { IncomingForm } = require('formidable');

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
      filter: ({ mimetype }) => mimetype && mimetype.includes('image')
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

module.exports = parseForm;
