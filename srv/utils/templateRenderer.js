const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
exports.renderTemplate = (templateName, data) => {
 const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
 const content = fs.readFileSync(templatePath, 'utf-8');
 const template = handlebars.compile(content);
 return template(data);
};