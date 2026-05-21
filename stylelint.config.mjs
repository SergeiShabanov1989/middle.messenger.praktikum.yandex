/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "use",
          "forward",
          "mixin",
          "include",
          "if",
          "else",
          "each",
          "for",
          "function",
          "return",
        ],
      },
    ],
    "no-descending-specificity": null,
    "selector-class-pattern": null,
    "media-query-no-invalid": null,
    "property-no-deprecated": [true, { ignoreProperties: ["clip"] }],
  },
};
