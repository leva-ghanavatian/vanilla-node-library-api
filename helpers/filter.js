const { v, pick } = require("./validator");
const { ValidationError } = require("./errors");

// "__" separator, because field names already contain "_" (created_at).
const OPS = {
  eq: "$eq", ne: "$ne",
  gt: "$gt", gte: "$gte",
  lt: "$lt", lte: "$lte",
  in: "$in", nin: "$nin",
  like: "$regex",
};

// Reuse body rules, minus constraints that only make sense when writing.
const WRITE_ONLY = ["min", "max", "pattern", "messages", "default", "positive"];
const stripWrite = rule => {
  const copy = { ...rule };
  WRITE_ONLY.forEach(k => delete copy[k]);
  return copy;
};
const filterable = (schema, fields, extra = {}) => ({
  ...Object.fromEntries(
    Object.entries(pick(schema, fields)).map(([f, rule]) => [f, stripWrite(rule)])
  ),
  ...extra
});

const has = Object.hasOwn;
const MAX_IN = 50;
const escapeRegex = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildFilterParser = spec => {
  const checkers = Object.fromEntries(
    Object.entries(spec).map(([field, rule]) => [
      field,
      v.compile({ [field]: { ...rule, optional: false, convert: true } }) // real field name in messages
    ])
  );

  const coerce = (field, raw) => {
    const box = { [field]: raw };
    const result = checkers[field](box);
    if (result !== true) throw new ValidationError(result[0].message);
    return box[field];
  };

  return (query = {}) => {
    const filter = {};

    for (const [key, raw] of Object.entries(query)) {
      if (raw === "" || raw === undefined) continue;

      const at = key.indexOf("__");
      const field = at === -1 ? key : key.slice(0, at);
      const op = at === -1 ? "eq" : key.slice(at + 2);   // ?crime=2 is just crime__eq

      if (!has(checkers, field)) throw new ValidationError(`Unknown filter field: "${field}"`);
      if (!has(OPS, op)) throw new ValidationError(`Unknown filter operator: "${op}"`);

      const target = (filter[field] ??= {});
      if (op === "in" || op === "nin") {
        target[OPS[op]] = String(raw).split(",").slice(0, MAX_IN).map(s => coerce(field, s));
      } else if (op === "like") {
        if (spec[field].type !== "string") throw new ValidationError(`"${field}" does not support like`);
        target.$regex = new RegExp(escapeRegex(raw), "i");
      } else {
        target[OPS[op]] = coerce(field, raw);
      }
    }
    return filter;
  };
};

module.exports = { buildFilterParser, filterable };