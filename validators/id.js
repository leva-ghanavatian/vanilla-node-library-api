const { createParser, objectId } = require("../helpers/validation");

const idInput = createParser({ id: objectId("id") });

module.exports = { parseId: value => idInput.parseCreate({ id: value }).id };